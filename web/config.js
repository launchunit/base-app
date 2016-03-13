
exports.defaults = {

  server: {
    port: process.env.NODE_PORT || process.env.PORT || 5002,
    gzipStatic: process.env.GZIP_STATIC || false
  },

  logger: {
    level: 'debug',
    request: true
  },

  views: {
    baseUrl: process.env.BASE_URL || '',
    assetUrl: process.env.ASSET_URL || '',
    version: process.env.VERSION || Date.now(),
    GA: process.env.GA || 'UA-xxxxxx',
  },

};


exports.production = {};
