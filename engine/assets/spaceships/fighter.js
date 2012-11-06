en.resources.add("ship", "Fighter", {
	name: "default",
	type: "Spaceship",
	images: {
		ship: "ships/TestSpaceShip",
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

	speed_forward: 1000,
	speed_backward: 100,
	mass: 12,
	decay: .99,
	turnSpeed: 0.45,
	size: 2,

	health: 100,
	shields: 100,
	shield_radius: 3.5,
	shield_recharge_time: 10,
	shield_recharge_frequency: 5,
	
	weapon_spots: {
		front: {
			x: 0,
			y: 2,
		},
		sideRight: {
			x: 1.2,
			y: 2.5,
		},
		sideLeft: {
			x: -1.2,
			y: 2.5,
		},
	},
	
	weapon_bonus: {
		firerate: 1.0,
		clip: 1.0,
		ammo: 1.0,
		recoil: 1.0,
	},
});