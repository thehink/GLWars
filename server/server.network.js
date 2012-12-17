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
		
		this.server = BinaryServer({port: 1337});
		this.server.on('connection', server.network.onConnect);
		
		server.players.add(new server.Player({
			username: "Admin",
			password: "Admin",
		}));
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
				player.stateStream.write(en.buildBuffer(en.structID.stageFullStatePlayer, player.getFullState()));
				player.stateStream.write(en.buildBuffer(en.structID.stageFullState, server.stage.stage.getFullState()));
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
	var stateBuffer = en.buildBuffer(en.structID.stageState, server.stage.stage.getState());
	
	var newObjects = false,
		removedObjects = false;
	
	if(server.stage.stage.deltaObjects.length > 0){
		newObjects = true;
		var newObjectsBuffer = en.buildBuffer(en.structID.stageFullState, server.stage.stage.getDeltaState());
	}
	
	if(server.stage.stage.deltaRemove.length > 0){
		removedObjects = true;
		var removedObjectsBuffer = en.buildBuffer(en.structID.stageRemoved, server.stage.stage.getRemovedState());
	}
	
	for(var i = 0; i < server.players.active.length; i++){
		var player = server.players.getPlayer(server.players.active[i]);
		var client = player.client;
		
		if(player.stateStream.writable){
			if(removedObjects)
				player.stateStream.write(removedObjectsBuffer);
			
			if(newObjects)
				player.stateStream.write(newObjectsBuffer);
			
			if(player.updateClientID){
				player.stateStream.write(en.buildBuffer(en.structID.serverDeployPlayer, {id:player.id}));
				player.updateClientID = false;
			}
			
			player.stateStream.write(stateBuffer);
				
		}else{
			server.players.setOffline(player);
		}
	}
};

server.network.onClientData = function(buffer){
	var data = en.readBufferToData(buffer);
	
	switch(data._sid){
		case en.structID.deployPlayer:
			server.players.deploy(this.player, data);
		break;
		case en.structID.clientData:
			server.players.parseClientData(this.player, data);
		break;
		case en.structID.ping:
			server.network.ping(this.player, data);
		break;
	}
	
};

server.network.ping = function(player, data){
	player.stateStream.write(en.buildBuffer(en.structID.recPing, {
		time: server.stage.stage.t,
	}));
};

server.network.broadcast = function(buffer){
	for(var i = 0, l= server.players.active.length; i < l; ++i){
		var client = server.players.getPlayer(server.players.active[i]).client;
		if(client)
			client.send(buffer);
	}
};