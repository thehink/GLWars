var static = require("ns"),
  http = require('http'),
  util = require('util'),
  socketIO = require('socket.IO');
  
  
 var server = {};
 
 server.init = function(){
	 server.network.init();
 };