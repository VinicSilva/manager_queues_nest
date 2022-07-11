'use strict';

const autocannon = require('autocannon');
var randomstring = require("randomstring")

const instance = autocannon(
  {
    headers: {
      'Content-Type': 'application/json',
    },
    url: 'http://localhost:3000',
    method: 'POST',
    body: JSON.stringify({ message: `XPTO ${new Date()}` }),
  },
  console.log,
);

// this is used to kill the instance on CTRL-C
process.once('SIGINT', () => {
  instance.stop();
});

// just render results
autocannon.track(instance, { renderProgressBar: true });
