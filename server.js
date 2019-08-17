'use strict';

const Server = require('socket.io');

class Queue {

  constructor(q) {
    this.events = new Set();
    this.name = q;
    this.q = Queue.io.of(`/${q}`);

    // Why .bind()?
    // In the connect method, 'this' is referenced inside of socket.on()
    // socket.on() sees 'this' as it's own, not this class instance, so we need
    // to use bind to force our own context.
    this.q.on('connection', this.connect.bind(this));
  }

  connect(socket) {
    socket.on('subscribe', (event,callback) => {
      if ( this.events.has(event) ) {
        socket.join(event);
        const message = `Subscribed to ${event} in ${this.name} ... ${socket.id}`;
        console.log(message);
        if ( callback ) { callback(undefined, message); }
          // Can also be written like this ... why?
          // callback && callback(message)
        console.log('All Subscribers...', event, this.connections(event));
      }
      else {
        const message = `Invalid Event ${event}`;
        console.log(message);
        callback && callback(message);
      }
    });
  }

  monitorEvent(event) {
    this.events.add(event);
  }

  connections(event) {
    return Object.keys(this.q.adapter.rooms[event].sockets);
  }

  /**
   * The publish static method is run when a non-connected client wants to simply "publish" an event
   * Publishers do not need to connect to a queue and monitor it. They are short lived, and only call on the
   * Server with a 'publish' event to a named queue with payload periodically
   * @param message
   */
  static publish(message, callback) {
    let {queue, event, payload} = message;
    Queue.io.of(queue).to(event).emit('trigger', payload);
    callback && callback();
  }

  /**
   * The static start method spins up the server and logs all connections.
   * It also sets up a generic listener for 'publish' events that don't require the client
   * be connected directly to any named queue. They can just fire 'publish' at their core socket
   */
  static start() {
    const PORT = process.env.PORT || process.env.port || 3333;
    Queue.io = new Server(PORT);
    Queue.io.on('connection', socket => {
      console.log('connected', socket.id);
      socket.on('publish', Queue.publish);
    });
    console.log(`Q server up on ${PORT}`);
  }

}

module.exports = Queue;
