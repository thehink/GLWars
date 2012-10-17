en.bind("resources/load", function(done, total){
	client.utils.resourceListener(done, total, client.init);
});
$(document).ready(function(e) {
	en.resources.load();
});
