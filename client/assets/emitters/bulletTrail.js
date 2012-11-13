en.resources.add("emitter", "BulletTrail", {
	numParticles: 32,
	texture: 0,
	radius: 5,
	size: 60,
	size_rand: 50,
	angle: 0,
	angle_rand: 0.1,
	velocity: 6,
	velocity_rand: 5,
	lifespan: 13,     //can not be 15 for some wierd reason. Todo: figure out why
	lifespan_rand: 10,
	color: new THREE.Color(0xffffff).setHSV(122/360, 80/100, 100/100),
	to_color: new THREE.Color(0xffffff).setHSV(200/360, 80/100, 100/100),
});