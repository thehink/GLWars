client.network = {
	client: {},
};

client.network.init = function(){

};

client.network.login = function(username, password){
	
	if(this.client._socket.readyState != 1)
		this.client = new BinaryClient('ws://127.0.0.1:1337');

	
	this.client.on('open', function(stream, meta){
		var test = new ArrayBuffer( 10 );
		this.client.send();
	});
	
	this.client.on('stream', client.network.handleStream);
};

client.network.handleStream = function(stream, meta){
	
};