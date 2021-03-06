var modulesPath = "./nodejs/node_modules/";

var static = require(modulesPath+'node-static'),
  http = require('http'),
  util = require('util');
 
var BinaryServer = require(modulesPath+'binaryjs').BinaryServer,
	fs = require('fs');
	
 var server = {
	 isRunning: true,
	 lastFrame: 0,
 };
 
 var ArrayBuffer = Buffer;
  
 server.init = function(){
	  en.bind("resources/load", function(total, done){
		console.log("Loading resources:", Math.round(100*done/total) + "%");
		
		if(done/total == 1){
			//en.extend(server.Player, en.Player);
			server.stage.init();
			server.start();
	 		server.network.init();
		}
	});
	en.resources.load();
 };
 
 server.start = function(){
	 server.isRunning = true;
	 server.tick();
 };
 
 server.stop = function(){
	 server.isRunning = false;
 };
 
 server.tick = function(){
	 en.onFrame();
	 
	 var now = Date.now();
	 if(now - server.lastFrame > 50){
		server.network.onFrame();
		server.lastFrame = now;
		server.bots.update();
	}
	 
	 if(server.isRunning)
	 	setTimeout(server.tick, 1000/60);
 };