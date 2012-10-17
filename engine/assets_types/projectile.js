en.resources.define("projectile",{
	type: "Projectile",
	proj_type: en.utils.vars.projectile_types.BULLET,  //bullet || rocket || laser || railgun
	
	speed: 1000,
	acceleration: 5,
	density: 1,                          //projectile is thrusting, depending not only only at start velocity
	decoy: 1,                           //rate projectile decoys
	range: en.math.random2(100, 200),							//range projectile can travel
	rotation: Math.PI,						//(degrees)which direction is the projectile going
	
	size_x: 1,
	size_y: 2,
	
	damage: 2,
	
	explosion: {
		explode_range_limit: true,
		constant_damage: false, 		// constant or dynamic damage depending on the length to the center of the explosion.
		damage: 10,
		radius: 5,
	},

	materials: {
		projectile: "projectiles.bullet",
	},
	
	particle_effects: {
		tail: "default_tail",
		hit: "default_hit",
		explosion: "default_explosion",
	},
}, function(content, callback){
	callback("projectile", content);
});
