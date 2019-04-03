const express = require('express')
const io = require('socket.io')

const db = require('../db/mongodb');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongoose').Types.ObjectId;

let today = new Date();
let tomorrow = new Date();
tomorrow.setDate(today.getDate()+1);


module.exports = (io) => {
        io.on("connection", socket => {
            db.productSchema.find({}, (err, doc) => {
                expiredProduct = [];
                for (let i = 0; i < doc.length; i++) {
                    if (doc[i]['expireIn'] <= tomorrow) {
                        console.log(doc[i]['expireIn'])
                        expiredProduct.push(doc[i])
                    }
                }
            io.emit("notification", doc)
            });


            socket.on('deleteProduct', function(product)  {
                console.log(product.value._id);
                db.productSchema.deleteOne({_id: new ObjectId(product.value._id)}).exec();
            });
            

            socket.on('deleteAllProducts', products => {
                console.log(22, products);
               products.forEach(product => {
                   console.log(455, product);
                   db.productSchema.deleteOne({_id: new ObjectId(product.value._id)}).exec();
               })
            })
        }); 
        
        
}



