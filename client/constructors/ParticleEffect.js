client.PEE = function(upd){
	this.emitter = opt.emitter || new client.PE(client.stage.ParticleSystem, {}); 	//particle Emitter
	this.update = upd.update || function(frame){			//default/example function
		if(frame < 10){										//play when framecount is under 10
			this.emitter.unPause();							//make it emit
			this.setAngle(this.emitter.angle + 0.1, 0.1);	//make it spin
		}else
			this.emitter.pause();							//pause the emiting
	};
	
	for(var asd in upd){
	}
};

client.PEE.prototype = {
	setAngle: function(){
		//deafult function to set angle. Can be overwritten by effect.
	},
	
	setVelocity: function(){
		//deafult function to set velocity. Can be overwritten by effect.
	},
	
};

client.particleEffect = function(opt){
	this.emitters = [];
	this.numEmitters = 0;
	this.frame = 0;
};

client.particleEffect.prototype = {
	dispatch: function(ev){
		if(this["_"+ev])this["_"+ev]();
	},
	
	addEmitter: function(emitter){							//Adds emitter to pool
		this.numEmitters = this.emitters.push(emitter);
	},
	
	init: function(){
		for(var i = 0; i < this.numEmitters; ++i){
			this.emitters[this.active[i]].emitter.start();
		}
	},
	
	start: function(){										//start/restart emitter;
		this.frame = 0;
	},
	
	pause: function(){
		for(var i = 0; i < this.numEmitters; ++i){
			this.emitters[this.active[i]].emitter.pause();
		}
	},
	
	unPause: function(){
		for(var i = 0; i < this.numEmitters; ++i){
			this.emitters[this.active[i]].emitter.unPause();
		}
	},
	
	update: function(){
		for(var i = 0; i < this.numEmitters; ++i){
			this.emitters[this.active[i]].emitter.update(this.frame);
		}
		this.frame++;
	},
	
	translate: function(x, y){
		for(var i = 0; i < this.numEmitters; ++i){
			this.emitters[this.active[i]].emitter.translate(x, y);
		}
	},
	
	setInitVelocity: function(x, y){
		for(var i = 0; i < this.numEmitters; ++i){
			this.emitters[this.active[i]].emitter.setInitVelocity(x, y);
		}
	},
	
	destroy: function(){								//completely remove emitters from memory in gpu to make place for new ones
	},
};
