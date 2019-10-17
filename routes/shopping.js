const express = require('express');
const router = express.Router();
const ObjectId = require('mongoose').Types.ObjectId;

const db = require('./../db/mongodb');
const checkJwt = require('./../middleware/checkJwt');

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
   console.log(5566, userId);
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
               console.log(123321, err);
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
   db.cartSchema.findOne({ products: req.body.id, owner: new ObjectId(userId) }, (err, product) => {
      if (err) throw err;
      if (product) {
         product.remove();
         console.log(622333)
      }
   })
})

module.exports = router;
