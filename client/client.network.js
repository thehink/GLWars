client.network = {
	client: {},
	keyPressStream: {},
	gameStateStream: {},
};

client.network.init = function(){
	
};

client.network.connect = function(onConnected){
	if(!this.client._socket || this.client._socket.readyState != 1)
		this.client = new BinaryClient('ws://127.0.0.1:1337');
		
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

client.network.streamListeners[en.metas.message] = function(stream){
	stream.on('data', function(buffer){
		var data = en.readBufferToData(buffer);
		alert('Title: '+ data.title + '\n' + 'Message: '+ data.message);
	});
};

client.network.streamListeners[en.metas.gameState] = function(){
	stream.on('data', function(buffer){
		var data = en.readBufferToData(buffer);
		
	});
};

client.network.onStream = function(stream, meta){
	
	if(typeof client.network.streamListeners[meta] == "function")
		client.network.streamListeners[meta](stream);
};