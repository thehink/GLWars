client.utils.resourceListener = function(total, loaded, callback){

	
	//todo: retrieve resource list
	client.gui.progressbar.set(100*loaded/total);
	
	if(loaded/total === 1){
		client.gui.progressbar.set(100);
		setTimeout(client.gui.progressbar.hide, 600);
		client.init();
	}
};
