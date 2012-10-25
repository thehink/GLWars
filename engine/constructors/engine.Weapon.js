en.Weapon = function(options){
	options = en.utils.defaultOpts({
		name: "default",
		type: "Weapon",
		firerate: 1000,
		recoil: 3,
		ammo: -1,
		clip: -1,
		projectile: "deafult",
		lastfire: 0,
	}, options);
	
	en.Base.apply(this, [options]);
};

en.Weapon.prototype = {
	fire: function(owner, position, angle){
		var opt = en.resources.get("projectile", this.projectile);
		
		switch(opt.proj_type){
			case en.utils.vars.projectile_types.BULLET:
				this.fire_double_bullet(owner, position, angle, opt);
			break;
			case en.utils.vars.projectile_types.ROCKET:
				this.fire_rocket(owner, position, angle, opt);
			break;
			case en.utils.vars.projectile_types.LASER:
				this.fire_laser(owner, position, angle, opt);
			break;
			case en.utils.vars.projectile_types.RAILGUN:
				this.fire_railgun(owner, position, angle, opt);
			break;
		}
		
		
	},
	
	fire_bullet: function(owner, position, angle, opt){
		opt.position = {x:position.x, y:position.y};
		opt.position.x += owner.size * Math.cos(angle);
		opt.position.y += owner.size * Math.sin(angle);
		opt.velocity = owner.body.GetLinearVelocity();
		opt.rotation = en.math.random2(angle-0.04, angle+0.04);
		opt.owner = owner;

		if((en.lastFrameTime - this.lastfire) > this.firerate){

			owner.stage.insertObject(new (en.getClass("Projectile"))(opt));
			
			this.lastfire = en.lastFrameTime;
		}
	},
	
	fire_double_bullet: function(owner, position, angle, opt){
		opt.position = {x:position.x, y:position.y};
		opt.velocity = owner.body.GetLinearVelocity();
		opt.owner = owner;
		
		if((en.lastFrameTime - this.lastfire) > this.firerate){

			opt.position.x += owner.size * Math.cos(angle-Math.PI/2);
			opt.position.y += owner.size * Math.sin(angle-Math.PI/2);
			
			opt.rotation = en.math.random2(angle+0.08, angle+0.12);
			owner.stage.insertObject(new (en.getClass("Projectile"))(opt));
			
			opt.position.x += 2*owner.size * Math.cos(angle+Math.PI/2);
			opt.position.y += 2*owner.size * Math.sin(angle+Math.PI/2);
			
			opt.rotation = en.math.random2(angle-0.08, angle-0.12);
			//owner.stage.insertObject(new (en.getClass("Projectile"))(opt));
			
			this.lastfire = en.lastFrameTime;
		}
	},
	
	fire_rocket: function(owner, position, angle, opt){
		if((en.lastFrameTime - this.lastfire) > this.firerate){
			var projectile = new (en.getClass("Projectile"))(opt);
			owner.stage.insertObject(projectile);
			this.lastfire = en.lastFrameTime;
		}
	},
	
	fire_laser: function(owner, position, angle, opt){
		var end = {
			x: opt.range * Math.cos(angle),
			y: opt.range * Math.sin(angle)
		};
		
		owner.stage.physics_world.RayCast(function(){
			console.log("laser_hit?");
		}, position, end);
		
		this.call("fire_laser", position, end);
	},
	
	fire_railgun: function(owner, position, angle, opt){
		
	},
};