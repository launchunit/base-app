
exports.defaults = {

  server: {
    port: process.env.NODE_PORT || process.env.PORT || 5001
  },

  logger: {
    level: 'debug',
    request: true
  },

  masterToken: false,

  mongoUrl: process.env.MONGO_URL || 'mongodb://',

  redisUrl: process.env.REDIS_URL || '',

  plaid: {
    id: process.env.PLAID_ID || '',
    secret: process.env.PLAID_SECRET || ''
  }

  // String or comma separated keys for key rotation
  // HMAC_salt: process.env.HMAC_SALT || 'sample-salt-key',
};


exports.production = {};
