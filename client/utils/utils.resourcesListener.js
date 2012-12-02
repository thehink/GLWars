client.utils.resourceListener = function(total, loaded, callback){

	
	//todo: retrieve resource list
	client.gui.progressbar.set((0.5+100*loaded/total >> 0));
	
	if(loaded/total == 1){
		client.gui.progressbar.set(100);
		setTimeout(function(){
			client.gui.progressbar.hide();
			client.init();
		}, 500);
		
	}
};
