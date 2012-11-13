en.resources.add("emitter", "Explosion", {
	numParticles: 512,
	texture: 0,
	radius: 10,
	size: 120,
	size_rand: 110,
	angle: 0,
	angle_rand: Math.PI,
	velocity: 20,
	velocity_rand: 15,
	lifespan: 18,     //can not be 15 for some wierd reason. Todo: figure out why
	lifespan_rand: 20,
	color: new THREE.Color(0xffffff).setHSV(193/360, 80/100, 100/100),
	to_color: new THREE.Color(0xffffff).setHSV(20/360, 80/100, 100/100),
});