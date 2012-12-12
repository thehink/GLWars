
server.players = {};

server.players.idsByName = {};
server.players.players = [];
server.players.active = [];

server.players.getAllActivePlayers = function(){
	var l = server.players.active.length,
		players = new Array(l);
	for(var i = 0; i < l; ++i){
		players[i] = server.players.getPlayer(server.players.active[i]);
	}
	return players;
};

server.players.getPlayer = function(id){
	return server.players.players[id];
};

server.players.getByUsername = function(username){
	return this.getPlayer(this.idsByName[username]);
};

server.players.remove = function(player){
	var index = this.players.indexOf(player);
	if(index > -1)
		this.players.splice(index, 1);
};

server.players.add = function(player){
	player.id = server.players.players.push(player)-1;
	server.players.idsByName[player.username] = player.id;
	return player;
};

server.players.setOnline = function(player, client){
	player.online = true;
	player.client = client;
	player.stateStream = client.createStream(en.metas.state);
	player.stateStream.player = player;
	player.stateStream.on('data', server.network.onClientData);
	
	if(this.active.indexOf(player.id) == -1)
		server.players.active.push(player.id);
	return player;
};


server.players.setOffline = function(player){
	player.online = false;
	player.destroy_queue = true;
	var i = this.active.indexOf(player.id);
	if(i > -1)
		this.active.splice(i, 1);
	return player;
};

server.players.login = function(username, password, client){
	var player = this.getByUsername(username);
	if(player){
		if(player.password == password)
			return server.players.setOnline(player, client);
		else
			return false;
		
	}else{
		var player = new server.Player({
			username: username,
			password: password,
		});
		
		this.setOnline(this.add(player), client);
		return player;
	}
		
};

server.players.logout = function(player){
	this.setOffline(player);
};

server.players.deploy = function(player, data){
	player.resetState();
	player.color = data.color || 0;
	
	player.updateClientID = true;
	server.stage.stage.insertObject(player);
};

server.players.parseClientData = function(player, data){
	player.setRT_data(data);
	player.setAwake();
};