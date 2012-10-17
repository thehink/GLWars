client.player = {
	pl: {},
};

client.player.init = function(player){
};

client.player.set = function(Player){
	client.player.pl = Player;
};

client.player.get = function(){
	return client.player.pl;
};


client.player.update = function(){
	if(client.keys[en.utils.vars.KEY.ARROW_UP])
		this.pl.startThrust()
	else
	this.pl.stopThrust();
		
	if(client.keys[en.utils.vars.KEY.ARROW_DOWN])
		this.pl.backThrust();
		
	if(client.keys[en.utils.vars.KEY.ARROW_LEFT])
		this.pl.turnLeft();
		
	if(client.keys[en.utils.vars.KEY.ARROW_RIGHT])
		this.pl.turnRight();
		
	if(client.keys[en.utils.vars.KEY.X])
		this.pl.fire();
		
	if(client.keys[en.utils.vars.KEY.Z])
		this.pl.test();
		
	if(client.keys[en.utils.vars.KEY.SPACE])
		this.pl.boost();
};