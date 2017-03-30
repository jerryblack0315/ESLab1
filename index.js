var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var acc = require("./myfunction")
var fs = require("fs"),
    filename = "account.csv",
    encode = "utf8";
var port = process.env.PORT || 3000;
var usernames = [];

app.get('/', function(req, res){
	res.sendFile(__dirname + '/client.html');
});
app.get('/private', function(req, res){
	res.sendFile(__dirname + '/private.html');
});

fs.readFile("index.js")

io.of('/').on('connection', function(socket){
	var id, pass;
	socket.on('chat message', function(msg,ID){
		//id=ID;
		socket.broadcast.emit('chat message', msg, ID);
		socket.emit('chat message', msg, ID);
		console.log('message: ' + msg);
	});
	
	socket.on('addme', function(username, password){
		id=username;
		pass=password;

		if(usernames.indexOf(id)!==-1){
			id=null;
			socket.emit('already login');
		}
		else{
           var exist=false;
			fs.readFile(filename, encode, function(err, file) {
 			 arrData=acc.CSVToArray(file,'');
			  for(var i=1;i<arrData.length;i++){
   			 	if(arrData[i][0]===id){
					if(arrData[i][1]===acc.SHA256(pass)){
						usernames.push(id);
						socket.emit('check id', username, 'You are connect.');
						socket.broadcast.emit('chat message', username + ' is on deck.','', 'SERVER');
						updateUsernames();
						exist=true;
						break;
					}
					else {  // 密碼錯
							id=null;
							socket.emit('wrong password');
							exist=true;
						    break;
					}
					
				}
				
  			  }
			if(exist===false){
				fs.appendFile(filename, id + ',' + acc.SHA256(pass) + '\n', function (err){console.log("register" + id)});
				usernames.push(id);
				socket.emit('regist successfully', username, 'Welcome! You have been registed successfully.');
				socket.broadcast.emit('chat message', username + ' is on deck.','', 'SERVER');
				updateUsernames();
			}	
      
			});
		}
		
	});
	function updateUsernames(){
		io.sockets.emit('updatenames', usernames);
	}
	
	socket.on('private_chat', function(trans,receive){
		io.emit('private_message start', trans ,receive);
		
		
	});
	
	socket.on('disconnect', function(data){
		if (!id) return;
		io.sockets.emit('chat message', id + ' lefts the chatroom.','', 'SERVER');
		usernames.splice(usernames.indexOf(id), 1);
		updateUsernames();
		
		
	});
});

io.of('/private').on("connection", function(socket){
	var id, partner_id;
	socket.on('private_chat message', function(msg,ID1,ID2){
		//id=ID;
		socket.broadcast.emit('private_chat message', msg, ID1,ID2);
		socket.emit('private_chat message', msg, ID1,ID2);
		console.log('message: ' + msg);
	});
	socket.on("transmit our id", function(my, your){
		id=my;
		partner_id=your;
	});
	socket.on('disconnect', function(data){
		socket.broadcast.emit('private_server say', id, partner_id);
		console.log(id + partner_id);
	});
});


http.listen(port, function(){
	console.log('listening on *:' + port);
});
