
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');



//const file1 = require('./socket/socket')(io);
const path = require('path');
 const expressSS = require('express');

const bodyparser = require('body-parser')
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

const config = require('./config/config');
const dotenv = require('dotenv');

const db = require('./db/mongodb'); 
const jwt = require('jsonwebtoken');
//

app.set('socketio', app.io);
app.io             = io;
var array_of_connection = [] ;

app.io.use(function(socket, next){
    if (socket.handshake.query && socket.handshake.query.token){
      jwt.verify(socket.handshake.query.token, '333', function(err, decoded) {
        if(err) return next(new Error('Authentication error'));
        decoded_token = decoded ;
        socket.handshake.query.decoded=decoded;
       
        next();
      });
    } else {
        next(new Error('Authentication error'));
    }    
  })

app.io.sockets.on('connection', function(socket){
    console.log('connect client')
    array_of_connection.push(socket);
})

app.set('array_of_connection',array_of_connection);

// routes
const apiRoute = require('./routes/api');
const indexRoute = require('./routes/index');
const shoppingRoute = require('./routes/shopping');
const chargeCardRoute = require('./routes/cedit-card');
const uploadPhotoRoute = require('./routes/upload-photo');
const chatRoute = require('./routes/chat');
const userMSgRoute = require('./routes/user-msg');
const allMessageRoute = require('./routes/all-msg');


// message
 const message = require('./routes/message')(io);
 //const message = require('./routes/chat')(io);

 mongoose.Promise = global.Promise;

 const ConnectionUri = config.db 
 //const ConnectionUri = 'mongodb+srv://rabie:A1b2c3d4e5@cluster0-kixy3.gcp.mongodb.net/test?retryWrites=true&w=majority'
mongoose.connect(ConnectionUri, err => {
    if (err) {
        console.log('Error in connecting to Mongo DB !!');
        throw err;
    }
    console.log('successfully connected to database ..');
})

// let app = express();



// profile picture
 
app.use(expressSS.static(path.join(__dirname, 'uploads'))); 

app.use(expressSS.static(path.resolve('uploads')));





app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(cors());

app.use('/product-image/', expressSS.static('./product-image'));

app.use('/profile-image/', expressSS.static('./uploads'));





// use routes
app.use('/api', apiRoute);
app.use('/shopping', shoppingRoute);
app.use('/charg-card', chargeCardRoute)
app.use('/shopping', shoppingRoute);
app.use('/upload-photo', uploadPhotoRoute);
app.use('/register', indexRoute);
app.use('/chat', chatRoute);
app.use('/user-msg', userMSgRoute);
app.use('/all-msg', allMessageRoute);


app.use(expressSS.static(__dirname + '/deploy'));

// setInterval( ()=> file1 ,1000);
app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/deploy/index.html'));
});


const port =  process.env.PORT ||  3000 || 8000 ;
http.listen(port, err => {
    if (err) throw err;
    console.log(`server running on port:  ${port}`)
})


module.exports = app;