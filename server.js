var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const users = [];
io.on('connection', function(socket) {
  socket.on('disconnect', function() {
    if (!socket.user) {
      return;
    }
    let userIndex = users.indexOf(socket.user);
    users.splice(userIndex, 1);
    io.emit('users updated', users);
    io.emit('room updates', { user: socket.user, action: 'Left', date: new Date() });
  });

  socket.on('login', function(user) {
    if (user) {
      socket.user = user;
      users.push(user);
    }
    io.emit('users updated', users);
    io.emit('room updates', { user: user, action: 'Joined', date: new Date() });
  });

  socket.on('chat message', function(msg) {
    io.emit('chat message', { user: socket.user, message: msg, date: new Date() });
  });
});

const port = process.env.PORT || 3000;
http.listen(port, function() {
  console.log('listening on *:' + port);
});
