client.player = {
	pl: null,
	data: {
		points: 421,
		level: 24,
		xp: 24,
		
		material: "spaceship_hull",
		
		color: 0x00A5FF,
		
		hull: 0,
		hulls_unlocked: [0],
		
		primary: 0,
		secondary: 0,
		special: 0,
		
		size: 2,
		
		weapons_unlocked: [0],
		
		
	},
};

client.player.setData = function(playerData){
	this.data = playerData;
};

client.player.init = function(player){
	client.player.set(new (en.getClass("Player"))(player || {}));
};

client.player.deployMenu = function(){
	client.gui.login.hide();
	client.hud.deployment.show();
};

client.player.deploy = function(){
	var deployData = {
		color: client.player.data.color,
		hull: 1,
		weapons: [
			{
				weaponID: 1,
			}
		]
	}
	
	client.network.deploy(deployData);
};


client.player.onDeath = function(){
};

client.player.onDeploy = function(id){
	var player = client.Stage.objects.get(id);
	if(player){
		client.hud.deployment.hide();
		this.set(player);
		client.hud.show();
	}
};

client.player.set = function(Player){
	Player.bind("_explode", function(){
		client.hud.hide();
		setTimeout(client.hud.deployment.show, 2000);
	});
	
	this.pl = Player;
};

client.player.get = function(){
	return client.player.pl;
};

client.player.keyChange = function(){
	if(client.player.pl){
		this.pl.thrusting = client.keys[en.utils.vars.KEY.ARROW_UP] ? 1 : (client.keys[en.utils.vars.KEY.ARROW_DOWN] ?  2 : 0);	
		this.pl.turning_right = client.keys[en.utils.vars.KEY.ARROW_RIGHT] || false;
		this.pl.turning_left = client.keys[en.utils.vars.KEY.ARROW_LEFT] || false;
		this.pl.firing = client.keys[en.utils.vars.KEY.X] || false;
		this.pl.boosting = client.keys[en.utils.vars.KEY.SPACE] || false;
		
		this.pl.setAwake();

		client.network.sendClientData(this.pl.getRT_data());
		
	};
};

client.player.update = function(){
	if(this.pl){
		client.hud.energyBar.set((0.5+ 100*this.pl.boostTimeleft/this.pl.boostTime | 0));
		client.hud.healthBar.set((0.5+ 100*this.pl.health/this.pl.maxHealth | 0));
		client.hud.shieldBar.set((0.5+ 100*this.pl.shields/this.pl.maxShields | 0));
		
	}
};