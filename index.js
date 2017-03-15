var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/client.html');
});

io.on('connection', function(socket){
  var id
  socket.on('chat message', function(msg){
    socket.broadcast.emit('chat message', msg, id);
    //io.emit('some event', { for: 'everyone' });
    //io.emit('chat message', msg);
    socket.emit('chat message', msg, id);
    console.log('message: ' + msg);
  });
  socket.on('addme', function(username){
    id=username;
    socket.emit('check id', username, 'You are connect.');
    socket.broadcast.emit('chat message', username + ' is on deck.', '');
  });
});


http.listen(port, function(){
  console.log('listening on *:' + port);
});
