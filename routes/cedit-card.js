const express = require('express');
const router = express.Router();
const privateKey = require('../config/config').PRIVATE_KEY;
const stripe = require('stripe')('sk_test_vllYrL6F5rd32Vp9V1Pn1UqA00zY8JrlNs');
const db = require('../db/mongodb');

router.post('/', (req, res) => {
    console.log(3345, req.body.token);
    console.log(677, req.body.token.token.email);
    console.log(11111, req.body.token.token.id)
     stripe.customers.create({
       
        card: req.body.token.token.id,
        email: req.body.token.token.email,
       
    }, function(err, cus) {
        if(err) {
            console.log(9999, err)
        }
        console.log(444, cus)
        const credit = new db.credits();
        credit.credit = req.body.token;
        credit.save();
        res.send({
            success: true,
        })
    })
})


module.exports = router;