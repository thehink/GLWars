
server.Player = function(options){
	options = en.utils.defaultOpts({
		id: 0,
		online: true,
		banned: false,
		username: "",
		password: "",
		client: {},
	}, options);

	
	en.Player.apply(this, [options]);
};

server.Player.prototype = {

};
