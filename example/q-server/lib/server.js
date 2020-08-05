'use strict';

const Server = require('socket.io');

class Queue {

  constructor(q) {
    this.events = new Set();
    this.name = q;
    this.q = Queue.io.of(`/${q}`);
    this.q.on('connection', this.connect.bind(this));
  }
  
  monitorEvent(event) { 
    this.events.add(event); 
  }

  clients(room) {
    return Object.keys(this.q.adapter.rooms[room].sockets);
  }

  connect(socket) {
    socket.on('subscribe', (event,cb) => {
      if ( this.events.has(event) ) {
        socket.join(event);
        const message = `Subscribed to ${event} in ${this.name} ... ${socket.id}`;
        console.log(message);
        cb && cb(undefined, message);
      }
      else {
        const message = `Subscribed to ${event} in ${this.name} ... ${socket.id}`;
        console.log(message);
        cb && cb(message);
      }
    });
  }
  
  static publish(message) {
    let {queue, event, payload} = message;
    Queue.io.of(queue).to(event).emit('trigger', payload);
  }

  static start() {
    const PORT = process.env.PORT || 3333;
    Queue.io = new Server(PORT);
    Queue.io.on('connection', socket => {
      console.log('connected', socket.id);
      socket.on('publish', Queue.publish);
    });
    console.log(`Q server up on ${PORT}`);
  }

}

module.exports = Queue;
