const express = require('express');
const router = express.Router();
const ObjectId = require('mongoose').Types.ObjectId;

const db = require('./../db/mongodb');
const checkJwt = require('./../middleware/checkJwt');

const mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);


function uniq(array) {
   let map = new Map();
   let count = 0;

   let a = array.map(product => product['_id'])

   for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array.length; j++) {
         if (array[i]['_id'] === array[j]['_id']) {
            count++;
            array.splice(1, array[j]);
         }
      }
      map.set(array[i], count);
      count = 0;
   }

   return map;
}
 




router.get('/get-cart', checkJwt, (req, res) => {
   let userId = req.decoded.user._id;
   let products = [];


   db.cartSchema.findOne({ owner: new ObjectId(userId) })
      .populate('products')
      .lean()
      .exec((err, result) => {
         if (err) throw err;
         if (result) {
            let count;
            let finalArray = []

            let map = uniq(result.products)
           
            for (let [k, v] of map) {
                k.count = v;
                finalArray.push(k);
            }
            console.log(map);
            res.json({
               success: true,
               products: finalArray
            });
         }
         
         

          

      })
});

router.post('/', checkJwt, (req, res, nexe) => {
   let userId = req.decoded.user._id
   let prodctId = req.body.productId;
   

   db.cartSchema.findOne({ owner: new ObjectId(userId) }, (err, doc) => {
      if (err) console.log(err);
      if (doc) {
         doc.products.push(new ObjectId(prodctId))
         doc.save();
      } else {
         let cart = new db.cartSchema();
         cart.owner = new ObjectId(userId)
         cart.save();
         db.userSchema.findById(new ObjectId(userId), (err, user) => {
            if (err) {
               res.send('error , call 911');
            } else {
               db.cartSchema.findOne({ owner: new ObjectId(user._id) }, (err, cart) => {
                  if (err) console.log(434, err);
                  if (cart) {
                     user.cart = cart.owner;
                     cart.products.push(new ObjectId(prodctId));
                     cart.save();
                     user.save();
                     res.send('done')
                  }
               })
            }
         })
      }

   });
});

router.post('/remove-one-product', checkJwt,(req, res) => {
   let userId = req.decoded.user._id
   console.log('shooping:  id- ', req.body.id)
   db.cartSchema.findOne({owner: new ObjectId(userId) }, (err, product) => {
      if (err) throw err;
      if (product) {
         for (let i = 0; i < product.products.length; i++) {
            if (product['products'][i] == req.body.id) {
               product['products'].splice(i, 1);
               console.log('p:', product['products'][i])
               break;
            }
            
         }
         product.save();
         console.log('product: ', product)
      }
   })
  
});

router.post('/submit-buy', checkJwt, (req, res) => {
   let userId = req.decoded.user._id;
   db.cartSchema.findOneAndRemove({owner: new ObjectId(userId)}, function(err, doc) {
      if (err) throw err;
      console.log('submit: ', doc)
      const newHistory = new db.historySchema();
      newHistory.products = doc.products;
      newHistory.owner = doc.owner;
      newHistory.totaPrice = req.body.totaPrice;
      
      newHistory.save((err, doc) =>{
         res.json({
            success: true
         });
      });
   });
});

router.get('/history', checkJwt, (req, res) => {
   let _id = req.decoded.user._id;

   db.historySchema.find({owner: _id})
     .populate('products', 'name price imageUrl')
     .exec((err, result) =>{
         if (result){
            console.log('result: ', result)
            res.json({
               success: true,
               order: result
            })
         }       
      })
})

module.exports = router;
