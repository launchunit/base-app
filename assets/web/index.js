
/**
 * Non Spa App
 */
console.log('Non SPA App');

const Plaid = require('./plaid')();
const $ = require('./cash');


$('.is-cta').on('click', function(e) {
  e.preventDefault();
});
