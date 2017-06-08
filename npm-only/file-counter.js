var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var lodash = require('lodash');
var countFiles = require('count-files');
var winFs = require('windows-fs');

//resource wireup
app.use("/css", express.static(__dirname + '/css'));

// server config
http.listen(3000, function(){
	console.log('listening on *:3000');

	var dirPath = "c:/temp";
	var result = winFs.statDirectory(dirPath);
});

//routing
app.get('/', function(req, res){
	res.sendFile(__dirname + '/file-count.htm');
});