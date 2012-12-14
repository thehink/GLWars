var modulesPath = "./nodejs/node_modules/";

var static = require(modulesPath+'node-static'),
  http = require('http'),
  util = require('util');
  
  
  var port = 80;
  var clientFiles = new static.Server(__dirname+'\\client');

  var httpServer = http.createServer(function (request, response) {
	  request.addListener('end', function () {
		  clientFiles.serve(request, response);
	  });
  });
  
  httpServer.listen(port);