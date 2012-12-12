en.utils.vars = {	
	projectile_types: {
		BULLET: 0x0001,				//bullet
		ROCKET: 0x0002,				//rocket like projectile
		RAILGUN: 0x0004,			//instantaneous projectile
		LASER: 0x0008				
	},
	
	COLLISION_GROUP: {
		PLAYER: 0x0001,
		ENEMY: 0x0002,
		OBJECT: 0x0004,
		PROJECTILE: 0x0008,
		WALL: 0x0010,
		ALL: 0xFFFF		
	},
	
	//################
	//collision masks
	//################
	
	COLLISION_MASKS: {
		PLAYER: 0xFFFF,		
		ENEMY: 0xFFFF,// & ~0x0008,
		OBJECT: 0xFFFF,
		PROJECTILE: 0xFFFF,
		PROJECTILE_HEAVY: 0xFFFF & ~0x0008,
		WALL: 0xFFFF & ~0x0010,
		ALL: 0xFFFF,	
	},
	
	PHYSICS_RELATIONS: {
		PLAYER: 0xFFFF,
	},
	
	KEY: {
		ARROW_UP: 38,
		ARROW_DOWN: 40,
		ARROW_LEFT: 37,
		ARROW_RIGHT: 39,
		SPACE: 32,
		A: 65,
		B: 66,
		C: 67,
		D: 68,
		E: 69,
		F: 70,
		G: 71,
		H: 72,
		I: 73,
		J: 74,
		K: 75,
		L: 76,
		M: 77,
		N: 78,
		O: 79,
		P: 80,
		Q: 81,
		R: 82,
		S: 83,
		T: 84,
		U: 85,
		V: 86,
		W: 87,
		X: 88,
		Y: 89,
		Z: 90,
		X: 88,
		
	},
};