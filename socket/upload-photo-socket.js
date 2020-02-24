var io = require('socket.io')();
var socketFunction = {}
socketFunction.socketStartUp = function (server) {
    io.attach(server);
    io.on('connection', function (socket) {
       io.emit('upload-photo', 'sssss');
    })
}
 module.exports = socketFunction;