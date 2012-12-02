client.hud = {};

client.hud.progbar = function(id){
	this.id = '#'+id;
	this.value = 0;
};

client.hud.progbar.prototype = {
	set: function(percent){
		this.value = percent <= 100 ? percent : 100;
		$(this.id + ' > .completed-bar').width(this.value+"%");
		$(this.id + ' > .status-bar-text > .bar-value').text(this.value);
	},
	
	reset: function(){
		this.set(0);
	},
};

client.hud.healthBar = new client.hud.progbar("health-bar");
client.hud.shieldBar = new client.hud.progbar("shield-bar");
client.hud.energyBar = new client.hud.progbar("energy-bar");

client.hud.deployment = {
	init: function(){
		$("#deploy-button").click(client.player.deploy);
	},
	
	show: function(){
		$("#deployment").show();
	},
	hide: function(){
		$("#deployment").hide();
	},
};