
'use strict';

/**
 * Module Dependencies
 */
const deepFreeze = require('deep-freeze'),
  BodyParser = require('body-parser'),
  Hpp = require('hpp'),
  Static = require('serve-static'),
  Middleware = require('cortado').Middleware;


/**
 * Init the App
 */
process.chdir(__dirname);
global.app = null;
global.app = {};


/**
 * Express Server
 */
Object.assign(app, require('cortado').WebServer());

/**
 * Load Config
 */
app.config = require('config-loader')({
  configFilePath: './config.js',
  env: app.Server.get('env')
});

/**
 * Global Logger
 */
require('logger')({
  level: app.config.logger.level,
  stringify: app.config.env === 'production',
  // sentryDSN:
  // sentryEnv:
});

/**
 * View Engine
 */
app.Server.set('view engine', 'jade');
app.Server.set('views', __dirname + '/views');
app.Server.locals = deepFreeze(Object.assign({
  pretty: false,
  env: app.config.env
}, app.config.views));


/**
 * Request Logger
 */
if (app.config.logger.request) {
  app.Server.use(logger.request);
}

/**
 * Load Data
 */
app.data = require('dir-loader')({
  dirPath: './data'
});

/**
 * Security Headers
 */
app.Server.use(Middleware.Security({
  enableHSTS: false
}));

/**
 * Server Status Endpoint
 */
app.Server.use('/status', Middleware.Web.statusOK);

/**
 * Public Dir Static files
 */
app.Server.use(Static(__dirname + '/public', {
  index: false,
  // fallthrough: false,
  redirect: false,
  maxAge: '30d',
  // Set Gzip Headers Prod
  setHeaders: app.config.server.gzipStatic
    ? (res, path) => {
        if (/\.(css|js)$/i.test(path))
          res.setHeader('Content-Encoding','gzip');
      }
    : undefined
}));

/**
 * Bodyparser
 */
app.Server.use(BodyParser.json({
  inflate: false,
  strict: true
}));

/**
 * HTTP Parameter Pollution Attacks
 */
app.Server.use(Hpp({
  checkQuery: true,
  checkBody: false
}));


/**
 * Load Routes
 */
require('./routes');
app.Server.use(Middleware.Web.route_404);
app.Server.use(Middleware.Web.error);

/**
 * Start the Server
 */
app.Server.listen(app.config.server.port, err => {

  logger.info('Server Started '.concat(app.config.server.port,
              ' @',app.config.env,' environment.'));

  // To V8 fast properties, http://goo.gl/r7ZpKt
  require('to-fast-properties')(app);
});
