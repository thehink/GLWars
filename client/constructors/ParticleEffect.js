client.PEE = function(emitter, opt, effect){
	for(var i in opt){
		this[i] = opt[i];
	}
	this.emitter = emitter || new client.PE(client.stage.ParticleSystem, {}); 	//particle Emitter
	this.effect = effect;
};

client.PEE.prototype = {
	update: function(frame){
		/*if(frame < 10){										//play when framecount is under 10
			this.emitter.unPause();							//make it emit
			this.setAngle(this.emitter.angle + 0.1, 0.1);	//make it spin
		}else
			this.emitter.pause();	
			*/
	},
	
	setAngle: function(angle, range, frame){
		//deafult function to set angle. Can be overwritten by effect.
		this.emitter.setAngle(angle, range || this.emitter.angle_rand);
	},
	
	setVelocity: function(vel, range, frame){
		//deafult function to set velocity. Can be overwritten by effect.
		this.emitter.setAngle(vel, range || this.emitter.velocity_rand);
	},
	
	setInitVelocity: function(x, y){
		this.emitter.setInitVelocity(x, y);
	},
	
	translate: function(x, y){
		this.emitter.translate(x, y);
	},
	
	setOptions: function(options){
		this.emitter.setOptions(options);
	},
	
};

client.particleEffect = function(opt){
	this.emitters = [];
	this.needsAllocation = true;
	
	for(var i in opt.emitters){
		var pe = en.resources.get("emitter", opt.emitters[i].emitter);	//get emitter if defined
		if(pe)
			this.numEmitters = this.emitters.push(new client.PEE(pe, opt.emitters[i], this));	//if emitter exist add it to emitter pool
	}
	
	this.frame = 0;
	this.paused = true;
};

client.particleEffect.prototype = {
	dispatch: function(ev){
		if(this["_"+ev])this["_"+ev]();
	},
	
	addEmitter: function(emitter){							//Adds emitter to pool
		this.numEmitters = this.emitters.push(emitter);
	},
	
	init: function(){
		client.stage.ParticleEffects.push(this);
		/*
		for(var i = 0; i < this.numEmitters; ++i){
			this.emitters[i].emitter.start();
		}
		*/
		
	},
	
	start: function(options){
		return this;
	},
	
	setOptions: function(options){
		for(var i = 0; i < this.numEmitters; ++i){
			this.emitters[i].setOptions(options);
		}
		return this;
	},
	
	restart: function(){										//start/restart emitter;
		this.frame = 0;
		if(this.paused)this.unPause();
	},
	
	pause: function(){
		if(this.paused)return false;
		this.paused = true;
		for(var i = 0; i < this.numEmitters; ++i){
			this.emitters[i].emitter.pause();
		}
	},
	
	unPause: function(){
		if(!this.paused)return false;
		this.paused = false;
		for(var i = 0; i < this.numEmitters; ++i){
			this.emitters[i].emitter.unPause();
		}
	},
	
	update: function(){
		for(var i = 0; i < this.numEmitters; ++i){
			this.emitters[i].update(this.frame++);
		}
	},
	
	translate: function(x, y){
		for(var i = 0; i < this.numEmitters; ++i){
			this.emitters[i].translate(x, y);
		}
	},
	
	setInitVelocity: function(x, y){
		for(var i = 0; i < this.numEmitters; ++i){
			this.emitters[i].setInitVelocity(x, y);
		}
	},
	
	setAngle: function(angle, range){
		for(var i = 0; i < this.numEmitters; ++i){
			this.emitters[i].setAngle(angle, range);
		}
	},
	
	setVelocity: function(velocity, range){
		for(var i = 0; i < this.numEmitters; ++i){
			this.emitters[i].setVelocity(velocity, range);
		}
	},
	
	destroy: function(){								//completely remove emitters from memory in gpu to make place for new ones
		var i = client.stage.ParticleEffects.indexOf(this);
		if(i > -1)
			client.stage.ParticleEffects.splice(i,1);
		
	},
};
