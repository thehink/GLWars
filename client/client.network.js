client.network = {
	client: {},
	keyPressStream: {},
	gameStateStream: {},
};

client.network.init = function(){
	
};

client.network.connect = function(onConnected){
	if(!this.client._socket || this.client._socket.readyState != 1)
		this.client = new BinaryClient('ws://'+window.location.hostname+':1337');
		
	this.client.on('open', onConnected);
	this.client.on('stream', client.network.onStream);
};

client.network.login = function(username, password){
	
	var that = client.network;
	
	if(!that.client._socket || that.client._socket.readyState != 1){
		client.network.connect(function(){
			client.network.login(username, password);
		});
	}else{
		var buffer = en.buildBuffer(en.structID.authentication, {
				username: username || "",
				password: password || "",
			});
			
		var stream = client.network.client.createStream(en.metas.authentication);
			stream.write(buffer);
			stream.end();
	}
	
};

client.network.streamListeners = [];

client.network.streamListeners[en.metas.state] = function(stream){
	client.network.stream = stream;
	
	stream.on('data', function(buffer){
		var data = en.readBufferToData(buffer);
		switch(data._sid){
			case en.structID.stageFullStateSpaceship:
				client.player.setData(data);
				client.player.deployMenu();
			break;
			case en.structID.stageFullState:
				client.Stage.setFullState(data);
			break;
			case en.structID.serverDeployPlayer:
				client.player.onDeploy(data.id);
			break;
			case en.structID.stageState:
				client.Stage.setState(data);
			break;
		}

	});
};

client.network.deploy = function(data){
	client.network.stream.write(en.buildBuffer(en.structID.deployPlayer, data));
};

client.network.sendClientData = function(data){
	client.network.stream.write(en.buildBuffer(en.structID.clientData, data));
};

client.network.streamListeners[en.metas.message] = function(stream){
	stream.on('data', function(buffer){
		var data = en.readBufferToData(buffer);
		alert('Title: '+ data.title + '\n' + 'Message: '+ data.message);
	});
};

client.network.onStream = function(stream, meta){
	if(typeof client.network.streamListeners[meta] == "function")
		client.network.streamListeners[meta](stream);
};