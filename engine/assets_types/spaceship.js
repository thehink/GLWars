en.resources.define("spaceship", {
		name: "default",
		images: {
			ship: "ships/TestSpaceShip",
			shield: "shield",
		},
		
		particle_effects: {
			tail: "ship/default/tail",
			explosion: "ship/default/explosion",
		},
		
		weapons: [],
		activeWeapon: 0,
		
		maxSpeed: 7,
		mass: 60,
		thrust: 15,
		decay: .99,
		turnspeed: 4,
		
		properties: {
			life: 100,
			shields: 100,
			shield_radius: 5,
			shield_recharge_time: 10,
			shield_recharge_frequency: 5,
			speed: 10,
			acceleration: 6,
			weapon_spots: [
				{
					x: -50,
					y: -50,
				},
				{
					x: 50,
					y: 50,
				},
			],
			weapon_bonus: {
				damage: 1.0,
				firerate: 1.0,
				clip: 1.0,
				ammo: 1.0,
				recoil: 1.0,
			},
			form: [
				{x:0, y:0},
				{x:50, y:0},
				{x:50, y:50},
				{x:0, y:50},
			],
		},
}, function(content, callback){
	callback("ship", content);
});
