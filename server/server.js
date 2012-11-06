var modulesPath = "./../../../nodejs/node_modules/";

var static = require(modulesPath+'node-static'),
  http = require('http'),
  util = require('util');
 
var BinaryServer = require(modulesPath+'binaryjs').BinaryServer,
	fs = require('fs');
  
  
 var server = {};
 
 server.init = function(){
	 server.network.init();
 };