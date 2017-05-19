var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var lodash = require('lodash');

//resource wireup
app.use("/css", express.static(__dirname + '/css'));

//data
io.deplopyments = [];

//routing
app.get('/', function(req, res){
	res.sendFile(__dirname + '/status.htm');
});

app.get('/startdeployment', function(req, res){
	var envName = req.query.env.toLowerCase();
	var newDeployment = {
		envName: envName,
		initialcount: req.query.count,
		currentfilecount: 0
	};
	io.deplopyments[io.deplopyments.length] = {
		envName: envName, 
		dep: newDeployment
	};

	console.log(`new deployment started in: ${envName} with a count of files: ${req.query.count}`);

	io.sockets.emit("new deployment", newDeployment);
	res.send('');
});

app.get('/updatecount', function(req, res){
	var envName = req.query.env.toLowerCase();
	var filecount = req.query.filecount;
	
	var dep = findDeployment(envName)[0].dep;
	if(dep)
	{
		dep.currentfilecount = filecount;
		console.log(`deployment update in ${envName} - new file count: ${filecount}`);
		io.sockets.emit("deployment update", dep);
		res.send('<h1>' + filecount + '</h1>');
	}
	else
	{
		res.send('<h1> deployment not found</h1>');
	}	
});

//socket io stuff
io.on('connection', function(socket){
	io.on('connect', function(){
		console.log('user connected, deployments: ' + io.deplopyments.length);    
	});

	socket.on('disconnect', function(){
		console.log('user disconnected');
	});

	socket.on('get manifest', function(){
		console.log("requesting manifest. deployments: " + io.deplopyments.length);
		io.sockets.emit("deployment manifest", io.deplopyments);
	});
});

// server config
http.listen(3000, function(){
	console.log('listening on *:3000');
});


function findDeployment(envName){
	var dep = lodash.filter(io.deplopyments, x=> x.envName === envName);
    return dep;
};