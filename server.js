
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');
const file1 = require('./socket/socket')(io);
const path = require('path');
// const moment = require('moment');
 const expressSS = require('express');

const bodyparser = require('body-parser')
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

const config = require('./config/config');


//
const db = require('./db/mongodb'); 
const jwt = require('jsonwebtoken');
//


// routes
const apiRoute = require('./routes/api');
const indexRoute = require('./routes/index');
const shoppingRoute = require('./routes/shopping');
const chargeCardRoute = require('./routes/cedit-card');

mongoose.connect(process.env.MONGODB_URI ||config.db, err => {
    if (err) {
        console.log('Error in connecting to Mongo DB !!');
        throw err;
    }
    console.log('successfully connected to database ..')
})

// let app = express();

// 
    user = new db.userSchema();
    user.email = 'raga@raga.com'; user.password = '1111'; user.name = 'raga';user.isAdmin = true;

    user.save((err, result) => {
        if (err) {
            res.json(
                {
                    success: false,
                    message: 'error in database'
                }
            );
        }
        var token = jwt.sign(
            { user: result },
            config.secret
        );
// 
app.use(expressSS.static(path.join(__dirname, 'deploy'))); 


app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(cors());





// use routes
 setInterval( ()=> file1 ,1000);

 app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/deploy/index.html'));
}); 



app.use('/api', apiRoute);
app.use('/shopping', shoppingRoute);
app.use('/charg-card', chargeCardRoute)

app.use('/', indexRoute);

const port =  process.env.PORT || 8000;
http.listen(port, err => {
    if (err) throw err;
    console.log(`serer running on port:  ${port}`)
})

