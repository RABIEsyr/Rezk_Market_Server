var jwt = require('jsonwebtoken');
const db =require('../db/mongodb');
const checkJwt = require('./../middleware/checkJwt');
const ObjectId = require('mongoose').Types.ObjectId;



exports = module.exports = function(io){

  io.on('connection', function (socket) {
      
    socket.on('join', function(data) {
      console.log(data);
      socket.join(data)
});

  socket.on('send-messages', function(data) {
    socket.emit('broad', data);
    io.to(data).emit('receive_message', {msg: 'hello'});
  });
      
     
  });
}