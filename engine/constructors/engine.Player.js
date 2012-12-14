en.Player = function(options){
	
	options = en.utils.defaultOpts({
		type: "Player",
		netSynch: true,
		username: "test",
		level: 0,
		points: 0,
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

en.Player.prototype = {
	getFullState: function(){
		return {
			id: this.id,
			name: this.name,
			type: this.type,
			material: this.material,
			color: this.color,
			
			username: this.username,
			level: this.level,
			points: this.points,
			xp: this.xp,
			kills: this.kills,
			deaths: this.deaths,
			
			mass: this.mass,
			density: this.density,
			friction: this.friction,
			restitution: this.restitution,
			position: {
				x: this.position.x,
				y: this.position.y,
			},
			linear_damping: this.linear_damping,
			angular_damping: this.angular_damping,
			rotation: this.rotation,
			size: this.size,
			categoryBits: this.categoryBits,
			maskBits: this.maskBits,
		};
	},
};

en.struct.extend("stageFullState", "Player", [
		["id", "Uint8", 1],
		["type", "String"],
		["name", "String"],
		["material", "String"],
		
		["username", "String"],
		["level", "Int32", 1],
		["points", "Int32", 1],
		["xp", "Int32", 1],
		["kills", "Int32", 1],
		["deaths", "Int32", 1],
		
		["color", "Int32", 1],
		
		["mass", "Float32", 1],
		["density", "Float32", 1],
		["friction", "Float32", 1],
		["restitution", "Float32", 1],
		["position", "Struct", [
			["x", "Float32", 1],
			["y", "Float32", 1],
		]],
		["linear_damping", "Float32", 1],
		["angular_damping", "Float32", 1],
		["rotation", "Float32", 1],
		["size", "Float32", 1],
		["categoryBits", "Int32", 1],
		["maskBits", "Int32", 1],
]);

en.struct.extend("stageState", "Player", [
	  ["id", "Uint8", 1],
	  ["health", "Int32", 1],
	  ["shields", "Int32", 1],
	  ["boostTimeleft", "Int32", 1],
	  ["body", "Struct", [
		  ["position", "Float32", 2],
		  ["velocity", "Float32", 2],
		  ["rotation", "Float32", 1],
		  ["angular_velocity", "Float32", 1],
	  ]],
	  ["clientData", "Struct", [
		["firing", "Bool"],
		["boosting", "Bool"],
		["thrusting", "Uint8", 1],
		["turning_right", "Bool"],
		["turning_left", "Bool"],
		["weapon", "Uint8", 1]
	  ]]
]);