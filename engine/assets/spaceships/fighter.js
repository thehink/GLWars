en.resources.add("spaceship", "Fighter", {
	name: "Fighter",
	type: "Spaceship",
	netSynch: true,
	synchStep: true, 
	images: {
		ship: "ship_fighter",
		shield: "shield",
	},
	
	soundFX: {
		engine: "ShipEngine",
		boost: "ShipBoost",
	},
	
	particle_effects: {
		thrust: "ThrustEffect",
		explosion: "DefaultExplosion",
	},
	
	material: "spaceship_hull",
	color: 0xffffff,
	
	size: 2,
	mass: 12,
	categoryBits: en.utils.vars.COLLISION_GROUP.PLAYER,
	maskBits: en.utils.vars.COLLISION_MASKS.PLAYER,

	speed_forward: 400,
	speed_backward: 100,
	thrust: 15,
	decay: .99,
	turnSpeed: 0.45,
	turning: 0,
	health: 100,
	maxHealth: 100,
	shields: 100,
	maxShields: 100,
	shield_radius: 2.1,
	shield_recharge_time: 10,
	shield_recharge_frequency: 5,

	boostForce: 700,
	boostTime: 900,
	boostRecharge: 3000,
	
	//KEY DATA
	
	firing: false,
	boosting: false,
	thrusting: 0,
	turning_left: false,
	turning_right: false,
	weapon: 0,
	
	//END KEY Data

	weapon_spots: {
		primary: {
			weapon: -1,
			spots: [
				{
					angle: 0.1,
					x: 1.2,
					y: 2.5,
				},
				{
					angle: -0.1,
					x: -1.2,
					y: 2.5,
				}
			],
		},
		
		secondary:{
			weapon: -1,
			spots: [
				{
					angle: 0,
					x: 0,
					y: 2,
				}
			],
		},
		
		special: {
			weapon: -1,
			spots: [],
		},
		
		bonus: {
			weapon: -1,
			spots: [],
		},
		
	},
	
	weapon_bonus: {
		firerate: 1.0,
		recoil: 1.0,
	},
});