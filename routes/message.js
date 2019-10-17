var jwt = require('jsonwebtoken');
const db =require('../db/mongodb');
const checkJwt = require('./../middleware/checkJwt');
const ObjectId = require('mongoose').Types.ObjectId;


exports = module.exports = function(io){
 
  let sender;
  let clients = [];
  let senderTokent;
  let sessionID = {};
  var sockets = {};
  let id;
  let adminsArr = [];
  var array_of_connection = [] ;

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
     // console.log('2222989' ,sessionID,'09900')
     array_of_connection.push(socket);
    
     
      socket._id = senderTokent.user._id;
      socket.on('send-message', function(message) {
               
        db.userSchema.find({isAdmin: true}, function(err, admins) {          
          const newMessage = new db.chatSchema();

          newMessage.from = senderTokent.user._id;

          for (let admin of admins) {
            newMessage.to.push(new ObjectId(admin._id))
          }
          
          newMessage.content = message;

          newMessage.save();

          for (let i = 0; i < array_of_connection.length; i++) {
            if (array_of_connection[i].decoded.user.isAdmin) {
               array_of_connection[i].emit('receive-message', message)
            }
          }

          
        })
        
      
      });
  });
}