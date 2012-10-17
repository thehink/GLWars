client.gui = {};

client.gui.progressbar = {
	value: 0,
	
	show: function(set){
		if(set)this.set(set);
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