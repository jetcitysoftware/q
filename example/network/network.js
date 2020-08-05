'use strict';

const Q = require('./lib/subscriber.js');

const network = new Q('network');

network.subscribe('attack', (payload) => {
  console.log('Shields Up!', payload);
});
