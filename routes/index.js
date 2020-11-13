const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const fs = require('fs');
const db = require('../db/mongodb');
const config = require('../config/config');




router.post('/sign-up', (req, res) => {
    email = req.body.email;
    password = req.body.password
    name = req.body.name;
  
    if (email && password && name) {

        db.userSchema.findOne({ email: email }, (err, doc) => {
            if (err) console.log(err);

            if (doc) {
                res.json(
                    {
                        success: false,
                        message: 'email already exists'
                    }
                );
            } else {
                user = new db.userSchema();
                user.email = email; user.password = password; user.name = name;
                user.save((err, result) => {
                    if (err) {
                        res.json(
                            {
                                success: false,
                                message: 'errr in database'
                            }
                        );
                    }
                    var token = jwt.sign(
                        { user: result },
                        config.secret
                    );

                    res.json(
                        {
                            success: true,
                            message: 'successfuly logged in',
                            token: token
                        }
                    );
                });
            }

        });

    } else {
        res.json({
            success: false,
            message: 'send your credentials'
        });
    }

});

router.post('/sign-in', (req, res) => {
    email = req.body.email;
    password = req.body.password

    if (email && password) {

        db.userSchema.findOne({ email: email }, (err, doc) => {
            if (err) console.log(err);

            if (doc) {
                var token = jwt.sign(
                    {user: doc},
                    config.secret
                );

                res.json(
                    {
                        success: true,
                        message: 'you are logged in',
                        token: token
                    }
                );
            } else {
                res.json(
                    {
                        success: false,
                        message: 'email and password not match'
                    }
                )
            }
        });

    } else {
        res.json({
            success: false,
            message: 'send your credentials for login'
        });
    }

});

module.exports = router;
