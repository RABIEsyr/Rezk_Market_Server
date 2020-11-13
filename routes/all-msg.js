const express = require('express');
const router = express.Router();
const db = require('../db/mongodb');
const checkIsAdmin = require('../middleware/checkIsAdmin');
const checkJwt = require('./../middleware/checkJwt');

router.get('/',checkJwt, checkIsAdmin, (req, res) => {
    db.chatSchema.find({})
     .lean()
     .populate('from')
     .exec((err, msgs) => {
         for (let i = 0; i < msgs.length; i++) {
             if ( msgs[i].from.isAdmin == true) {
                 msgs.splice(i, 1)
                 i--;
             }
         }
        

        //  for (let i = 0; i < msgs.length; i++) {
        //     for (let j = 0; j < msgs.length; j++) {
        //         if (msgs[i].from._id === msgs[j].from._id) {
        //             if (new Date(msgs[i].date) >= new Date(msgs[j].date)) {
        //                 msgs.splice(j, 1)
        //             } else {
        //                 msgs.splice(i, 1)
        //             }
                    
        //         }
        //     }
        //  }

        //  if (msgs[0].date > msgs[1].date) {
        //      msgs.splice(1, 1)
        //  } else {
        //     msgs.splice(0, 1)
        //  }

        var obj = {};

for ( var i=0, len=msgs.length; i < len; i++ )
    obj[msgs[i]['from']['_id']] = msgs[i];

msgs = new Array();
for ( var key in obj )
    msgs.push(obj[key])

    console.log(msgs)
         res.json({msgs});
     });

    
});

module.exports = router;