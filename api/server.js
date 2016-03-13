
'use strict';

/**
 * Module Dependencies
 */
const BodyParser = require('body-parser'),
  Hpp = require('hpp'),
  mongoDB = require('mongodb-client'),
  promiseHelpers = require('promise-helpers'),
  Middleware = require('cortado').Middleware,
  Redis = require('redis-client');


/**
 * Init the App
 */
process.chdir(__dirname);
global.app = null;
global.app = {};


/**
 * Cortado Framework
 */
Object.assign(app, require('cortado').ApiServer({
  errorFilePath: './errors.js'
}));

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
app.Server.use('/status', Middleware.Api.statusOK);

/**
 * Authenticate Master Token
 */
if (app.config.masterToken) {
  app.Server.use(Middleware.Api.authenticateToken({
    token: app.config.masterToken
  }));
}

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
 * Load Models from a Path
 */
// mongoDB.loadModels('./models');

/**
 * Start MondoDB
 */
mongoDB.connect({
  mongoUrl: app.config.mongoUrl,
  debug: app.config.env === 'development',
})
.then(db => {

  /**
   * Save Db Instance
   */
  app.db = db;

  /**
   * Start Redis
   */
  if (app.config.redisUrl)
    return Redis.connect({
      redisUrl: app.config.redisUrl
    });


  return promiseHelpers.resolve();
})
.then(redis => {

  /**
   * Save Redis Instance
   */
  app.redis = redis;

  /**
   * Load Routes
   */
  require('./routes');
  app.Server.use(Middleware.Api.route_404);
  app.Server.use(Middleware.Api.error);

  /**
   * Start the Server
   */
  app.Server.listen(app.config.server.port, err => {

    logger.info('Server Started '.concat(app.config.server.port,
                ' @',app.config.env,' environment.'));

    // To V8 fast properties, http://goo.gl/r7ZpKt
    require('to-fast-properties')(app);
  });

});
