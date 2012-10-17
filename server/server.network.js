server.network = {
	server: {
		clientFiles: {},
		httpServer: {},
		websocket: {},
		denyFF: [
		"node_modules",
		"server",
		"build.bat",
		],
	},
	
    init: function () {
        var port = 80;
        server.network.server.clientFiles = new static.Server(__dirname+'\\client');

        server.network.server.httpServer = http.createServer(function (request, response) {
            request.addListener('end', function () {
				var deny = false;
                for(var i = 0, l= server.network.server.denyFF.length; i < l ; ++i){
					if(request.url.match(server.network.server.denyFF[i])){
						deny = true;
						break;
					}
				}
				if(!deny){
                	server.network.server.clientFiles.serve(request, response);
				}else{
					console.log("Access Denied");
				}
            });
        });
		
        server.network.server.httpServer.listen(port);
        server.network.server.websocket = socketIO.listen(server.network.server.httpServer);
        server.network.server.websocket.on('connection', server.network.listeners);
    },
};

server.network.listeners = function(client){
	
}