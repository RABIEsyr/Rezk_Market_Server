var jwt = require('jsonwebtoken');
const db =require('../db/mongodb');
const checkJwt = require('./../middleware/checkJwt');
const ObjectId = require('mongoose').Types.ObjectId;


exports = module.exports = function(io){
 
 
  var array_of_connection = [] ;
  let senderTokent;
  let sessionID = {};
  let id;

  io.use(function(socket, next){
    if (socket.handshake.query && socket.handshake.query.token){
      jwt.verify(socket.handshake.query.token, '333', function(err, decoded) {
        if(err) return next(new Error('Authentication error'));
        socket.decoded = decoded;
        senderTokent = decoded;
        sessionID[id] = senderTokent.user._id

        next();
      });
    } else {
        next(new Error('Authentication error'));
    }    
  })
  .on('connection', function(socket) {  
     array_of_connection.push(socket);
      
      socket._id = senderTokent.user._id;
      const sessionMap = {};

      socket.on('send-message', function(message) {
             sessionMap[message._id]  = socket.id 
             
        db.userSchema.find({isAdmin: true}, function(err, admins) {          
          const newMessage = new db.chatSchema();
           
          newMessage.from = message._id;

          for (let admin of admins) {
              newMessage.to.push(admin._id)
          }         

          newMessage.content = message.message;

          newMessage.save();

          for (let i = 0; i < array_of_connection.length; i++) {
              if (array_of_connection[i].decoded.user.isAdmin) {
                  array_of_connection[i].emit('receive-message', message)               
              }                     
          }

        });
      
      });
  });
}