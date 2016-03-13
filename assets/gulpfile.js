
process.chdir(__dirname);

const path = require('path'),
  gulp = require('gulp'),
  size = require('gulp-size'),
  rename = require('gulp-rename'),
  gulpif = require('gulp-if'),
  plumber = require('gulp-plumber');

/**
 * Constants
 */
const PORT = 5003,
  PRODUCTION = process.env.NODE_ENV === 'production';


/**
 * SVG
 */
gulp.task('svg', function() {

  const svgSprite = require('gulp-svg-sprite');

  return gulp.src('./svg/*.svg')
    .pipe(plumber())
    .pipe(svgSprite({
      shape: {
        dimension: { attributes: false }
      },
      svg: {
        xmlDeclaration: false,
        doctypeDeclaration: false,
        dimensionAttributes: false,
      },
      mode: {
        symbol: {
          inline: true,
          dest: '.',
          sprite: 'defs.svg'
        }
      }
    }))
    .on('error', function(err) {
      // console.log(err);
      this.emit('end');
    })
    .pipe(size({
      showFiles: true
    }))
    .pipe(gulp.dest('../web/views/layouts'));
});

/**
 * Img
 */
gulp.task('img', function() {

  const imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant');

  return gulp.src('./img/*')
    .pipe(plumber())
    .pipe(imagemin({
      progressive: true,
      use: [ pngquant() ]
    }))
    .pipe(size({
      showFiles: true
    }))
    .pipe(gulp.dest('../web/public/img'));
});

/**
 * Jade for SPA
 */
gulp.task('jade', ['svg'], function() {

  const jade = require('gulp-jade');

  const LOCALS = require('config-loader')({
    configFilePath: '../web/config.js'
  }).views;

  return gulp.src('../web/views/layouts/spa.jade')
    .pipe(plumber())
    .pipe(jade({
      debug: false,
      compileDebug: false,
      cache: false,
      pretty: ! PRODUCTION,
      locals: LOCALS,
    }))
    // .pipe(gulpif(args.gzip, gzip(GZIP_OPTS)))
    .pipe(rename({
      basename: 'index',
    }))
    .pipe(size({
      showFiles: true
    }))
    .pipe(gulp.dest('./spa'));
});

/**
 * SASS
 */
gulp.task('sass', function(done) {

  const sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    csso = require('gulp-csso'),
    autoprefixer = require('autoprefixer');

  const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ];

  return gulp.src('./sass/index.sass')
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer({
        browsers: AUTOPREFIXER_BROWSERS
      })
    ]))
    // Only Minify In Production
    .pipe(gulpif(PRODUCTION, csso()))
    .pipe(rename({
      basename: 'style',
    }))
    .pipe(size({
      showFiles: true
    }))
  // Inline base64 Images
  // .pipe(base64({
  //   baseDir: 'public/images',
  //   maxImageSize: 8*1024, // 8KB
  //   debug: false
  // }))
  // .pipe(gulpif(args.prod, purify([
  //   'public/js/*.js', 'public/*.html'
  // ], { info: true })))
  // .pipe(gulpif(args.gzip, gzip(GZIP_OPTS)))
    .pipe(gulp.dest('../web/public/css'));
});

/**
 * SPA Dev Server
 */
gulp.task('spa', function() {

  const Opts = {
    publicPath: path.join(__dirname, '../web/public'),
    locals: require('config-loader')({
      configFilePath: '../web/config.js'
    }).views
  };

  const app = require('express')(),
    config = require('./webpack.config.dev')(Opts),
    compiler = require('webpack')(config);

  // Setup Server
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }));

  app.use(require('webpack-hot-middleware')(compiler));

  app.get('*', (req, res) => {
    res.sendFile(__dirname + '/spa/index.html');
  });

  app.listen(PORT, function(err) {
    if (err) console.log(err);
    console.log(`Listening at ${PORT}`);
    require('open')(`http://localhost:${PORT}`);
  });
});

/**
 * Assets Watcher
 */
gulp.task('watch', ['jade','sass','img'], function() {
  gulp.watch('./sass/**/*.sass', ['sass']);
  gulp.watch('./svg/**/*.svg', ['svg']);
  gulp.watch('./img/*', ['img']);
});

/**
 * Prod Build
 */
gulp.task('build', ['svg','sass','img'], function() {

  const Opts = {
    publicPath: path.join(__dirname, '../web/public'),
    locals: require('config-loader')({
      configFilePath: '../web/config.js'
    }).views
  };

  config = require('./webpack.config.prod')(Opts),
  require('webpack')(config, (err, stats) => {
    console.log(`Webpack Release #${stats.hash}`);
  });
});
