client.gui = {};


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