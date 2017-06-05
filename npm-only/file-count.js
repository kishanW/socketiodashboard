var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var lodash = require('lodash');

//resource wireup
app.use("/css", express.static(__dirname + '/css'));

// server config
http.listen(3000, function(){
	console.log('listening on *:3000');
});

//routing
app.get('/', function(req, res){
	res.sendFile(__dirname + '/file-count.htm');
});
