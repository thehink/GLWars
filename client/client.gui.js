client.gui = {};

client.gui.progbar = function(id){
	this.id = '#'+id;
	this.value = 0;
};

client.gui.progbar.prototype = {
	set: function(percent){
		this.value = percent <= 100 ? percent : 100;
		$(this.id + ' > .completed-bar').width(this.value+"%");
		$(this.id + ' > .status-bar-text > .bar-value').text(this.value);
	},
	
	reset: function(){
		this.set(0);
	},
};

client.gui.healthBar = new client.gui.progbar("health-bar");
client.gui.shieldBar = new client.gui.progbar("shield-bar");
client.gui.energyBar = new client.gui.progbar("energy-bar");


client.gui.login = {
	show: function(){
		$("#login").show();
	},
	hide: function(){
		$("#login").hide();
	},
	setMessage: function(type, msg){
		
	},
};

client.gui.progressbar = {
	value: 0,
	
	show: function(percent){
		if(percent)this.set(percent);
		$("#loader").show();
	},
	
	hide: function(){
		$("#loader").hide();
	},
	
	reset: function(){
		this.set(0);
	},
	
	set: function(percent){
		this.value = percent <= 100 ? percent : 100;
		$("#progressbar-completed").width(this.value+"%");
		$("#progressbar-status").text(this.value+"% Done");
	},
	
	
	
};