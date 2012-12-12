
server.stage = {};

server.stage.init = function(){
	var stage = this.stage = new en.Stage({
		name: "Main",
	});

	
	en.addStage(stage);
};
