en.Player = function(options){
	
	options = en.utils.defaultOpts({
		username: "test",
		level: 0,
		xp: 0,
		kills: 0,
		deaths: 0,
		unlocked_hulls: [
			0
		],
		unlocked_weapons: [
			0
		],
	}, options);
	
	en.Spaceship.apply(this, [options]);
};

en.Player.prototype = function(){
	
};