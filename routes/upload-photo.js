var express = require('express');
var router = express.Router();
var multer = require('multer');
const path = require('path');
const DIR = './uploads';
const checkJwt = require('./../middleware/checkJwt');
var glob = require("glob");
//const uploadPhoto = require('../socket/upload-photo-socket');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server)



var fs = require('fs'),
    request = require('request');


    var download = function(uri, filename, callback){
      request.head(uri, function(err, res, body){
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);
    
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
      });
    };

    

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, DIR);
    },
    filename: (req, file, cb) => {
      cb(null, req.decoded.user._id +  path.extname(file.originalname));
    }
});

let upload = multer({storage: storage});


router.post('', checkJwt, upload.single('photo'), function (req, res) {
  
  if (!req.file) {
      console.log("No file received");
      return res.send({
        success: false
        
      });
  
    } else {
      console.log('file received');

      let dataUrl;

      fs.readFile(
        './uploads/' + file, 'base64',
        (err, base64Image) => {
           dataUrl = `data:image/png;base64, ${base64Image}`
         
        });
         res.json(dataUrl)
    }
});

testFolder = 'uploads/'

router.get('/get-pic', checkJwt, (req, res) => {
  fs.readdirSync(testFolder).forEach(file => {
  
   
    if ( ( req.decoded.user._id + '.png' === file )  ||
       ( (req.decoded.user._id + '.jpeg') === file )    
      ) {
   
        fs.readFile(
          './uploads/' + req.decoded.user._id + '.png', 'base64',
          (err, base64Image) => {
            const dataUrl = `data:image/png;base64, ${base64Image}`
             res.json(dataUrl);
          })
    }
   
  });
  
});


module.exports = router;
