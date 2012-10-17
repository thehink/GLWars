en.resources.add("ship", "reference", {
	name: "default",
	type: "Spaceship",
	images: {
		ship: "ships/TestSpaceShip",
		shield: "shield",
	},
	
	particle_effects: {
		tail: "ship/default/tail",
		explosion: "ship/default/explosion",
	},
	
	weapons: [],
	activeWeapon: null,
	
	speed_forward: 1000,
	speed_backward: 100,
	mass: 12,
	thrust: 15,
	decay: .99,
	turnSpeed: 5.0,
	size: 1,

	health: 100,
	shields: 100,
	shield_radius: 3.5,
	shield_recharge_time: 10,
	shield_recharge_frequency: 5,
	speed: 10,
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
	categoryBits: en.utils.vars.COLLISION_GROUP.PLAYER,
	maskBits: en.utils.vars.COLLISION_MASKS.PLAYER,
});