
'use strict';

/**
 * Module Dependencies
 */
// https://github.com/kenwheeler/cash
const _ = require('lodash'),
  $ = require('cash-dom'),
  store = require('store'),
  qs = require('query-string');

/**
 * Globals
 */
const URL = 'https://api.nylas.com/oauth/authorize';


$('.is-cta').on('click', function(e) {

  e.preventDefault();
  $(this).html('Connecting...');

  const opts = {
    client_id: '6d81dlgjqsbdnizyxg59xi8i2',
    response_type: 'token',
    scope: 'email',
    redirect_uri: 'http://localhost:5002/login/'
  };

  window.location.replace(`${URL}?${qs.stringify(opts)}`);
});

// Login Page
if (window.location.pathname.trim() === '/login/') {
  const data = qs.parse(window.location.search);
  // LocalStore
  store.clear();
  store.set('nylas', data);
  window.location.replace('/app/');
}

// App Page
if (window.location.pathname.trim() === '/app/') {

  if (! store.get('nylas')) {
    window.location.replace('/');
  }

  else {
    // Display Content
    const account = store.get('nylas');
    $('.is-landing').removeClass('is-success');

    // Display Account
    $('#content .container').html(`
      <div id="email">
        <p>Email: ${account.email_address}</p>
        <p>Provider: ${account.provider}</p>
      </div>
    `);

    // Display Email Content
    fetch('https://api.nylas.com/threads', {
      json: true,
      headers: {
        'authorization': `Basic ${btoa(account.access_token+':')}`,
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      return res.json();
    })
    .then(res => {

      console.log(res);

      res =_.map(res, i => {
        return `<div>
          <hr>
          <p>id: ${JSON.stringify(i.id)}</p>
          <p>labels: ${JSON.stringify(i.labels)}</p>
          <p>from: ${JSON.stringify(i.participants)}</p>
          <p>subject: ${i.subject}</p>
          <p>unread: ${i.unread.toString()}</p>
          <p>snippet: ${i.snippet}</p>
        </div>`
      });

      $('#email').append(`<div id="email-content">${res}</div>`);
    })

  }
}
