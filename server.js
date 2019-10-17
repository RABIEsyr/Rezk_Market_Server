
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


// routes
const apiRoute = require('./routes/api');
const indexRoute = require('./routes/index');
const shoppingRoute = require('./routes/shopping');
const chargeCardRoute = require('./routes/cedit-card');
const uploadPhotoRoute = require('./routes/upload-photo');


// message
const message = require('./routes/message')(io);

// mongoose.Promise = global.Promise;

const ConnectionUri =  'mongodb+srv://rabie:A1b2c3d4e5@cluster0-kixy3.gcp.mongodb.net/test?retryWrites=true&w=majority' //config.db
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

// 
app.use(expressSS.static(path.join(__dirname, '/deploy'))); 

 app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/deploy/index.html'));
}); 

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(cors());






// setInterval( ()=> file1 ,1000);

// use routes
app.use('/api', apiRoute);
app.use('/shopping', shoppingRoute);
app.use('/charg-card', chargeCardRoute)
app.use('/shopping', shoppingRoute);
app.use('/upload-photo', uploadPhotoRoute);
app.use('/register', indexRoute);



const port =  process.env.PORT ||  3000 || 8000 ;
http.listen(port, err => {
    if (err) throw err;
    console.log(`serer running on port:  ${port}`)
})


