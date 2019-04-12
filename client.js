'use strict';

const io = require('socket.io-client');

const SERVER = process.env.Q_SERVER || process.env.REACT_APP_Q_SERVER || 'http://localhost:3333';

/** Class representing a subscriber instance to the Queue. */
class Q {

  constructor(q) {
    this.q = q; // a "namespace" in the Queue Server
    this.sockets = [];
  }

  /**
   * This function helps us subscribe
   * @param event {string} - indicating the event name (socket.io room in actuality)
   * @param callback {function} - Callback to execute on hearing the subscribed event
   */
  subscribe(event, callback) {
    // event is technically a socket.io room managed by the Queue Server
    console.log(`connect to: ${SERVER}/${this.q}`);
    this.sockets[event] = io.connect(`${SERVER}/${this.q}`);
    this.sockets[event].emit('subscribe', event, (err,status) => {
      if(err) { console.error(err); }
      else { console.log(status); }
    });
    this.sockets[event].on('trigger', callback);

  }

  /**
   * What queues am I connected to?
   * @returns {string[]}
   */
  subscriptions() {
    return Object.keys(this.sockets);
  }

  /**
   * TODO
   * Unsubscribe from an event
   * @param event
   */
  unsubscribe(event) {
  }

  /**
   * TODO
   * Completely disconnect from a queue (which will inherently unsubscribe from all events)
   */
  disconnect() {
  }

  /**
   * Static method to publish an event (room) with payload
   * Why static?  Publishers don't need to maintain a connection to an event queue. They are short-lived
   * This client library provides a simple means to quickly connect, publish a named event to a queue and then disconnect
   * @param queue
   * @param event
   * @param payload
   */
  static publish(queue, event, payload) {
    let q = io.connect(`${SERVER}`);
    let message = {queue,event,payload};
    q.emit('publish', message, (ret) => {
      q.disconnect();
    });
  }

}

module.exports = Q;
