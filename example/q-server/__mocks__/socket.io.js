'use strict';

module.exports = () => {

  const io = {};
  
  io.listen = port => {
    console.log('listener on ', port);
  };
  
  io.on = (command, callback) => {
    if ( command === 'connection' ) { 
      return io.socket;
    }
  };
  
  io.socket = {
    on: (command, callback) => {
      callback('ran', command);
    },
    
    emit:  (command, payload, callback) => {
      callback('server ran', command, 'with', payload);
    },
  };
  
  return io;
  
};


