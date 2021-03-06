en.resources.add("emitter", "BasicFire", {
	numParticles: 1024,
	texture: 0,
	radius: 40,
	size: 80,
	size_rand: 79,
	angle: Math.PI/4,
	angle_rand: 0.1,
	velocity: 45,
	velocity_rand: 40,
	lifespan: 5,
	lifespan_rand:5,
	color: new THREE.Color(0xffffff).setHSV(193/360, 80/100, 100/100),
	to_color: new THREE.Color(0xffffff).setHSV(1/360, 80/100, 100/100),
});