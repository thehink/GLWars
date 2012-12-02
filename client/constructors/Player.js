client.Player = function(config){
	en.Player.apply(this, [config]);
	client.Spaceship.apply(this, [config]);
};

client.Player.prototype = {
};