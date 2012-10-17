en.resources.add("emitter", "BasicFire", {
	numParticles: 1024,
	texture: 0,
	radius: 40,
	size: 100,
	size_rand: 60,
	angle: Math.PI/4,
	angle_rand: 0.1,
	velocity: 50,
	velocity_rand: 40,
	color: new THREE.Color(0xffffff).setHSV(1/360, 80/100, 100/100),
	to_color: new THREE.Color(0xffffff).setRGB(0,0,0.2),
});