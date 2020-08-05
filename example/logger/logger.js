'use strict';

const Q = require('./lib/subscriber.js');

const db = new Q('database');
const network = new Q('network');

db.subscribe('delete', (payload) => {
  console.log('delete happened', payload);
});

db.subscribe('create', (payload) => {
  console.log('create happened', payload);
});

network.subscribe('attack', (payload) => {
  console.log('RUN!');
});

console.log(db.subscriptions());
