
module.exports = function() {

  Plaid.create({
    env: 'tartan',
    clientName: 'Client Name',
    key: '56df4c7a152e16ec4a511f1d',
    product: 'connect',
    // To use Link with longtail institutions on Connect, set the
    // 'longtail' option to true:
    // longtail: true,
    onLoad: function() {
      // The Link module finished loading.
    },
    onSuccess: function(public_token, metadata) {
      console.log(public_token, metadata);
    },
    onExit: function() {
      // The user exited the Link flow.
    }
  });

};
