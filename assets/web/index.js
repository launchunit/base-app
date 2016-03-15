
'use strict';

/**
 * Module Dependencies
 */
// https://github.com/kenwheeler/cash
const $ = require('cash-dom');

/**
 * Globals
 */
const MODAL_CLASS = 'has-modal-open';
var plaid;


/**
 * Load Plaid
 */
loadjs.ready('plaid', () => {

  plaid = Plaid.create({
    env: 'tartan',
    clientName: 'Money.ai',
    key: 'fd73ce6fd3e1017d1f55a99f264da3',
    product: 'connect',
    // token: 'test,chase,connected',  // <- token to patch
    // longtail: true,
    onLoad: function() {},
    onSuccess: function(t, data) {
      $('html').removeClass(MODAL_CLASS);
      console.log(data)
    },
    onExit: function() {
      $('html').removeClass(MODAL_CLASS);
    }
  });
});


$('.is-cta').on('click', function(e) {
  e.preventDefault();
  plaid.open();
  $('html').addClass(MODAL_CLASS);
});

