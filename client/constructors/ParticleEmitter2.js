
client.PE = function(system, options){
	
	this.system = system;
	this.particles = [];
	this.allocated = 0.0;
	
	en.utils.options(this, {
		numParticles: 4096, 			//must be power of two or else there will be artifacts
		emitterLifeTime: -1,
		texture: 0,
		area: {
			x: 10,
			y: 100,
		},
		radius: 40,
		position: {
			x: 0,
			y: 0,
		},
			
		gravity: {
			x: 0,
			y: 0,
		},
		
		initVelocity: {
			x: 0,
			y: 0,
		},
			
		size: 100,
		size_rand: 60,
			
		angle: Math.PI/4,
		angle_rand: 0.1,
			
		velocity: 50,
		velocity_rand: 40,
			
		lifespan: 10,	   // if -1 they live forever till removed
		lifespan_rand:10, //should be zero for now. before I can synchronize particle system attributes with texture particles 100%
			
		color: new THREE.Color(0xffffff).setHSV(1/360, 80/100, 100/100),
		to_color: new THREE.Color(0xffffff).setRGB(0,0,0.2),

	}, options);
	
	this.allocate();
};

client.PE.prototype = {
	
	allocate: function(){
		this.system.allocate_emitter(this);
	},
	
	uploadData: function(){
		if(this.allocated && !this.paused){
			this.system.setEmitterData(this);
		}
	},
	
	destroy: function(){
		this.system.deAllocateEmitter(this);
	},
	
	addParticles: function(num){
		this.system.allocate(this, num);
	},
	
	removeParticles: function(num){
		var t = this.particles.length-num-1;
		for(var i = this.particles.length-1; i > t; --i){
			this.system.deAllocateParticle(this.particles[i]);
			this.particles.pop();
		}
	},
	
	start: function(){
		if(this.particles.length+1 < this.numParticles){
			this.system.allocate(this, this.numParticles-this.particles.length+1);
			this.uploadData();
		}
	},
	
	translate: function(x, y){
		this.position.x = x;
		this.position.y = y;
		this.uploadData();
	},
	
	setAngle: function(angle, rand){
		this.angle = angle;
		this.angle_rand = typeof rand == "number" ? rand : this.angle_rand;
		this.uploadData();
	},
	
	setLifespan: function(){
	},
	
	setVelocity: function(vel, vel_random){
		this.velocity = typeof vel == "number" ? vel : this.velocity;
		this.velocity_rand =  typeof vel_random == "number" ? vel_random : this.velocity_rand;
		this.uploadData();
	},
	
	setInitVelocity: function(x, y){
		this.initVelocity.x = x;
		this.initVelocity.y = y;
		this.uploadData();
	},
	
	pause: function(){
		var prev = {x:this.position.x, y: this.position.y};
		this.translate(99999,99999);
		this.position = prev;
		this.paused = true;
	},
	
	unPause: function(){
		this.paused = false;
		this.start();
		this.uploadData();
	},
	
	stop: function(){
		for(var i = this.particles.length-1; i > -1; --i){
			this.system.deAllocateParticle(this.particles[i]);
			this.particles.pop();
		}
	},
};