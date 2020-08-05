'use strict';

module.exports = () => {

  const io = {};
  
  io.listen = port => {
    console.log('listener on ', port);
  };
  
  io.connect = () => {
    return io.socket;
  };
  
  io.socket = {
    on: (command, callback) => {
      callback('ran', command);
    },
    
    emit:  (command, payload, callback) => {
      callback('server ran ' + command + ' with ' + JSON.stringify(payload));
    },
  };
  
  return io;
  
};


