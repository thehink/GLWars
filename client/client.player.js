client.player = {
	pl: {},
};

client.player.init = function(player){
	client.player.set(new (en.getClass("Player"))());
	client.Stage.insertObject(client.player.get());
};

client.player.deploy = function(){
	client.player.set(new (en.getClass("Player"))());
	client.Stage.insertObject(client.player.get());
};

client.player.set = function(Player){
	Player.bind("_explode", function(){
		client.hud.deployment.show();
	});
	
	client.player.pl = Player;
};

client.player.get = function(){
	return client.player.pl;
};


client.player.update = function(){
	if(client.keys[en.utils.vars.KEY.ARROW_UP])
		this.pl.startThrust();
	else
		this.pl.stopThrust();
		
	if(client.keys[en.utils.vars.KEY.ARROW_DOWN])
		this.pl.backThrust();
		
		
	if(client.keys[en.utils.vars.KEY.ARROW_RIGHT])
		if(this.pl.turning != 2)
			this.pl.turning = 2;
	
	if(client.keys[en.utils.vars.KEY.ARROW_LEFT])
		if(this.pl.turning != 1)
			this.pl.turning = 1;
		
	if(!client.keys[en.utils.vars.KEY.ARROW_LEFT] && !client.keys[en.utils.vars.KEY.ARROW_RIGHT])
		if(this.pl.turning != 0)
			this.pl.turning = 0;

	if(client.keys[en.utils.vars.KEY.X])
		this.pl.fire();
		
	if(client.keys[en.utils.vars.KEY.Z])
		explode();
		
	if(client.keys[en.utils.vars.KEY.SPACE])
		this.pl.boost();
	else
		this.pl.stopBoost();
};