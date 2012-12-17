server.bots = {
	numBots: 10,
	bots: [],
	active: [],
};

server.bots.add = function(){
	var bot = new en.Spaceship({
		id: 5000+server.stage.stage.count++,
	});
	
	bot.bind("explode", server.bots.destroyed)
	
	this.bots.push(bot);
	return bot;
};

server.bots.destroyed = function(bot){
	server.bots.bots.push(bot);
	setTimeout(server.bots.deploy, 10000);
};

server.bots.deploy = function(){
	var bot = server.bots.bots.pop();
	bot.resetState();
	bot.position = {
		x: (Math.random() * 100-50) || 0,
		y: (Math.random() * 100-50) || 0,
	};
	bot.color = Math.random() * 16777215 || 0;
	server.bots.active.push(bot);
	server.stage.stage.insertObject(bot);
};

server.bots.update = function(){
	if(this.active.length < this.numBots){
		server.bots.add();
		server.bots.deploy();
	}
};

