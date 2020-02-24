const express = require('express');
const router = express.Router();
const checkJwt = require('./../middleware/checkJwt');
const checkIsAdmin = require('../middleware/checkIsAdmin');
const ObjectId = require('mongoose').Types.ObjectId;
const db =require('../db/mongodb');

router.get('/:id', checkJwt || checkIsAdmin, (req, res) => {
   db.chatSchema.find(
       {
            $or: [
                {from:  req.params.id},
                {to:    req.params.id}          
            ]
        }
   ).exec(function(err, msgs) {
       res.json(msgs)
   });
});

router.post('/:id', checkJwt || checkIsAdmin, (req, res) => {
    socket_arr = req.app.get('array_of_connection');
    let from = req.decoded.user._id;
    let to = req.params.id;
    let message = req.body.message;
    
    const newMessage = new db.chatSchema();
    newMessage.from = from;
    newMessage.to = to
    newMessage.content = message;
    
    newMessage.save(function(err, message) {
        var i ;
        for(i=0;i<socket_arr.length;i++){
            if(req.params.id == socket_arr[i].handshake.query.decoded.user._id) {
                socket_arr[i].emit("receive-message", message );
            }
        }
        
        res.send(message)
    })
 });

module.exports = router;