server.network = {
	server: {
		clientFiles: {},
		httpServer: {},
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
		
        //server.network.server.httpServer.listen(port);
        
		this.server = BinaryServer({port: 1337});
		this.server.on('connection', server.network.onConnect);
		
    },
};

server.network.onConnect = function(client){
	client.on('stream', server.network.onStream);
};

server.network.streamListeners = [];

server.network.streamListeners[en.metas.authentication] = function(stream){
	stream.on('data', server.network.authenticate);
}

server.network.onStream = function(stream, meta){
	var onData = server.network.oasd;
	
	stream.client = this;
	
	if(typeof server.network.streamListeners[meta] == "function")
		server.network.streamListeners[meta](stream);
};

server.network.authenticate = function(buffer){
		var data = en.readBufferToData(buffer);
		
		if(data && data._sid == en.structID.authentication){
			var username = data.username,
				password = data.password;
				
			var player = server.players.login(username, password, this.client);
			
			if(player){
				this.client.send(en.buildBuffer(en.structID.gameState, server.stage.stage.getState()));
			}else{
				console.log("ERROR", "USERNAME:", username);
				this.client.send(en.buildBuffer(en.structID.message, {
					type: 1,
					title: "Error",
					message: "Something went wrong, probarly wrong password",
				}), en.metas.message);
			}
		}
};

server.network.onFrame = function(){
	
};

server.network.broadcast = function(buffer){
	for(var i = 0, l= server.players.active.length; i < l; ++i){
		var client = server.players.getPlayer(server.players.active[i]).client;
		if(client)
			client.send(buffer);
	}
};