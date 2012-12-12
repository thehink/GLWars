en.Weapon = function(options){
	options = en.utils.defaultOpts({
		name: "default",
		type: "Weapon",
		class: "medium",
		firerate: 1000,
		recoil: 3,
		ammo: -1,
		clip: -1,
		energy: 2,
		energyMax: 100,
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
				this.fire_bullet(owner, position, angle, opt);
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
		if((en.lastFrameTime - this.lastfire) > this.firerate){
			opt.position = position.getRotation(angle-Math.PI/2, 0, 2.5);
			opt.velocity = owner.body.GetLinearVelocity();
			opt.rotation = angle;
			opt.owner = owner;
			
			owner.stage.insertObject(new (en.getClass("Projectile"))(opt));
			this.lastfire = en.lastFrameTime;
		}
	},
	
	fire_double_bullet: function(owner, position, angle, opt){
		opt.position = {};
		opt.velocity = owner.body.GetLinearVelocity();
		opt.owner = owner;
		
		if((en.lastFrameTime - this.lastfire) > this.firerate){

			//opt.position.x += owner.size * Math.cos(angle-Math.PI/2);
			//opt.position.y += owner.size * Math.sin(angle-Math.PI/2);
			

			opt.position = position.getRotation(angle-Math.PI/2, 1.2, 2.5);
			opt.rotation = angle+0.01;
			owner.stage.insertObject(new (en.getClass("Projectile"))(opt));

			opt.position = position.getRotation(angle-Math.PI/2, -1.2, 2.5);
			opt.rotation = angle-0.01;
			owner.stage.insertObject(new (en.getClass("Projectile"))(opt));
			
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