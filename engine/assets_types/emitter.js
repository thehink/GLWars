en.resources.define("emitter",{
	numParticles: 1024,
	texture: 0,
	radius: 50,
	size: 200,
	size_rand: 100,
	angle: 0,
	angle_rand: 0.2,
	velocity: 5,
	velocity_rand: 1,
	color: new THREE.Color(0xffffff).setHSV(200/360, 80/100, 100/100),
	to_color: new THREE.Color(0xffffff).setHSV(100/360, 50/100, 100/100),
}, function(content, callback){
	callback(content.type, content);
}, function(content){
	return new client.PE(client.stage.ParticleSystem, content);
});