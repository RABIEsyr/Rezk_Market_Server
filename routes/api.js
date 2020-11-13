const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const ObjectId = require('mongoose').Types.ObjectId;

const checkJwt = require('../middleware/checkJwt');
const checkIsAdmin = require('../middleware/checkIsAdmin');
const db = require('../db/mongodb');

var moment = require('moment');


var fs = require('fs'),
    request = require('request');
    var multer = require('multer');
    const path = require('path');
    const DIR = './product-image';

 

router.post('/new-product', checkJwt, checkIsAdmin, (req, res) => {
    let name = req.body.product.name;
    let addedBy = req.decoded.user._id;
    let category = req.body.product.category; let quantity = req.body.product.quantity;
    let price = req.body.product.price;
    let expireIn = req.body.product.expireIn; let imageUrl = req.body.product.imageUrl;

    let imgFile;
    try {
        imgFile = req.body.product.myFile
    } catch(e) {}

    if (imgFile) {
        console.log(imgFile)
    }
    if (name && price && addedBy) {
        let product = new db.productSchema();
        product.name = name; product.price = price; product.imageUrl = imageUrl;
        product.expireIn = expireIn
        product.category = category; product.addedBy = addedBy;
        product.quantity = quantity;
            console.log('new-prod', imageUrl)
        product.save((err, prod) => {
            if (err) {
                console.log(000, 'erorr')
                res.json({
                    success: false,
                    message: 'error in database'
                });
            } else {
                console.log(111, 'New Product')
                res.json({
                    success: true,
                    message: 'successfully added the product'
                })
            }
        })
    }

});



  

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname + '-' + Date.now() +     path.extname(file.originalname));
  }
});

let upload = multer({storage: storage});

router.post('/new-product-image',checkJwt, upload.single('photo'), (req, res) => {
    console.log('77')
    if (!req.file) {
        return res.send({
          success: false,
          message: 'error not added'
        });
    
      } else {
       const product = new db.productSchema();
       product.name = req.body.name;
       product.price = req.body.price;
       product.quantity = req.body.quantity;
       product.quantity = req.body.quantity;
       product.expireIn = req.body.expireIn;
       product.imageUrl = `product-image/${req.file.filename}`;
       product.save((err, product) => {
        return res.json({
            success: true,
            message: 'successfully added',
            product: product
          });
       });
       
      
      }
})

router.post('/edit-product', checkJwt, checkIsAdmin, (req, res) => {
    let id  = req.body.product.id;
    let name = req.body.product.name;
    let edityBy = req.decoded.user._id;
    let category = req.body.product.category; 
    let quantity = req.body.product.quantity;
    let price = req.body.product.price;
    let expireIn = req.body.product.expireIn; 
    let imageUrl = req.body.product.imageUrl;

    console.log(id);
    
    db.productSchema.findById(id, (err, product) => {
        product.name = name;
        product.category = category;
        product.expireIn = expireIn;
        product.price = price;
        product.imageUrl = imageUrl;
        product.quantity = quantity;
        product.editBy = edityBy;
        product.save((err, product) => {
            err ? res.json({success: flase}) : res.json({success: true})
        })
    });

});

router.get('/get-categories', checkJwt, (req, res) => {
    db.categorySchema.find({}, function (err, categories) {
        if (err) {
            res.json({ success: false })
        } else {
            res.json({ success: true, categories: categories })
        }
    });
});

router.post('/new-category', checkJwt, checkIsAdmin, (req, res) => {
    let categoryType = req.body.type;
    console.log(categoryType)
    let newCategory = new db.categorySchema();
    newCategory.type = categoryType;

    newCategory.save(function (err) {
        if (err) {
            res.json({ success: false, message: 'errorin database' });
        } else {
            db.categorySchema.find({}, function (err, categories) {
                if (err) {
                    res.json({ success: false })
                } else {
                    res.json({ success: true, categories: categories })
                }
            })
        }
    })

});


router.post('/search-prouduct-by-name', (req, res) => {
    let productName;
    let categoryType;
    
    try {
        productName = req.body.name;
        console.log(2213, req.body)
        categoryType = req.body.categoryId;
       // console.log(categoryType);
    } catch (error) {
        throw error;
    }

    if (productName) {
        let query = { name: new RegExp(productName, 'i')};
        if (categoryType)
            try {
                query.category = new ObjectId(categoryType);
            } catch (error) {
                throw error;
            }

        db.productSchema.find(query, function (err, products) {
            if (err) {
                res.json({ success: false, message: 'error in database' })
                throw err;
            } else {
                console.log(8555, products)
                res.json(products)
            }
        })

    } else {
        res.json({ success: false, message: 'provide a name' });
    }

});


router.get('/products', (req, res) => {
    let categoryType = req.body.categoryId;
    let query = {};
     let index  = +req.headers["index"];
    console.log(index)
    

    let productS;
    if (categoryType) {
        try {
            categoryType = new ObjectId(categoryType);
            query.category = categoryType;
        } catch (err) { throw err; }
    }
    db.productSchema.find(query, function (err, products) {
        if (err) {
            res.json({
                success: false,
                message: 'error in database'
            });
        } else {
            productS = products;
            // res.json({
            //     success: true,
            //     products: productS.slice(1, index+4)
            // });
            
            res.json(products.slice(index, index+6))
            
        }
    })
});

router.get('/products-no-index', checkJwt, (req, res) => {
    let query = {};

    db.productSchema.find(query, function (err, products) {
        if (err) {
            res.json('error in database')
        } else {
            res.json(products)

        }
    })
});

router.post('/products-filter', (req, res) => {
   try {
    price = req.params.price;
    console.log(price)
   } catch (error) {
       
   }

   db.productSchema.find({price: price})
   .exec(function(err, docs) {
       console.log(docs)
       res.json(docs)
   })
});

router.post('/delete-product', (req, res) => {

    db.productSchema.findById(req.body.id, function(err, doc) {
        if (err)
         throw err;;
        
         doc.remove(() => {
             res.json({
                 success: true
             })
         })
    })
  console.log('delete', req.body.id);
})

module.exports = router;