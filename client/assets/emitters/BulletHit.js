en.resources.add("emitter", "BulletHit", {
	numParticles: 128,
	texture: 0,
	radius: 5,
	size: 60,
	size_rand: 40,
	angle: 0,
	angle_rand: 0.1,
	velocity: 8,
	velocity_rand: 7,
	lifespan: 16,     //can not be 15 for some wierd reason. Todo: figure out why
	lifespan_rand: 10,
	color: new THREE.Color(0xffffff).setHSV(200/360, 80/100, 100/100),
	to_color: new THREE.Color(0xffffff).setHSV(1/360, 80/100, 100/100),
});