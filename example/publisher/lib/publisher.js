'use strict';

const io = require('socket.io-client');

const SERVER = process.env.Q_SERVER || 'http://localhost:3333';

class Q {

  constructor(q) {
    this.q = io.connect(`${SERVER}`);
  }

  /**
   * Publish an event (room) with payload 
   * @param queue
   * @param event
   * @param payload
   */ 
  publish(queue, event, payload) {
    let message = {queue,event,payload};
    this.q.emit('publish', message); 
  }
  
}

module.exports = Q;
