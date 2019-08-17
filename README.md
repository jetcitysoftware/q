# Simple Node Message Queue (@nmq)

A simple message queue system based on socket.io that allows you to build a queue server which can receive and broadcast categorized events, clients that can subscribe to said events, and publishers that can publish to the server.

## Server Interface

Create a server to manage queues and events. Clients will eventually connect to the server to subscribe to these, and Publishers will be able to send messages.

1. Set an environment variable `PORT` with the port number to listen on
1. Start a server - `Q.start()`
1. Create a new queue/category - `const qname = new Q('name')`
1. Monitor events - `qname.monitorEvent('event-name')`

This example starts a Q server with 2 message queues (database and network) and will accept notifications of specific events for each of them.

**server.js**
```javascript
const Q = require('@nmq/q/server');
Q.start();

const db = new Q('database');
db.monitorEvent('create');
db.monitorEvent('update');
db.monitorEvent('delete');

const network = new Q('network');
network.monitorEvent('attack');
network.monitorEvent('no-service');
```

## Client/Subscriber Interface

Create any number of clients to connect to your queue server. Typically, your server will be running and deployed and clients can use this library to connect to that queue server and listen for events, running code (callbacks) when those events are fired.

Clients can connect to multiple queues and any number of events.

1. Create an environment variable called `Q_SERVER` that contains the full URL and PORT of your running queue server
1. Create  new reference to any valid Queue
1. Subscribe to any valid events in that Queue
1. Perform any actions when those events occur
1. Each event, when fired, will send data (payload) into the callback you define.

Here are a few simple examples

**database-logger.js**

This application will connect to the Queue server created above and respond to any `delete` or `create` events in the `database` queue.

```javascript
const Q = require('@nmq/q/client');

const db = new Q('database');

db.subscribe('delete', (payload) => {
  console.log('delete happened', payload);
});

db.subscribe('create', (payload) => {
  console.log('create happened', payload);
});
```

**network-logger.js**

This application will connect to the Queue server created above and respond to the `attack` event in the `network` queue.

```javascript
const Q = require('@nmq/q/client');

const network = new Q('network');

network.subscribe('attack', (payload) => {
  console.log('Shields Up!', payload);
});
```

## Publisher Interface

Given a running server which exposes named queues and events and some separately running connected clients that are subscribed to those events, you can now use publish events into those queues from any application.

As these events fire, the server will "hear" them, reformat them, and then broadcast them out to all connected and subscribed clients who may then act upon the payload sent.

1. Create an environment variable called `Q_SERVER` that contains the full URL and PORT of your running queue server
1. Call the `publish` method on the queue server with the following parameters:
 
 * Queue Name
 * Event Name
 * Payload - Can be of any type (string, array, object, boolean)

```javascript
const Q = require('@nmq/q/client');

Q.publish('database', 'delete', {id:77});
Q.publish('database', 'create', {id:99,name:'John'});
Q.publish('network', 'attack', {type: 'DDOS',source:'Russia'});
```

### Dependencies
* [socket.io](http://socket.io)
