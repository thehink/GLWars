en.Projectile = function(options){
	options = en.utils.defaultOpts({
		name: "default",
		type: "Projectile",
		proj_type: "bullet",  //bullet || rocket || laser || railgun
		
		speed: 25,
		acceleration: 5,
		density: 1,                          //projectile is thrusting, depending not only only at start velocity
		linear_damping: 0.1,
		angular_damping: 5,                      //rate projectile decoys
		range: en.math.random2(10, 12),							//range projectile can travel
		rotation: Math.PI,						//(degrees)which direction is the projectile going
		
		size_x: 0.3,
		size_y: 0.1,
		
		damage: 2,
		
		explosion: {
			explode_range_limit: true,
			constant_damage: false, 		// constant or dynamic damage depending on the length to the center of the explosion.
			damage: 10,
			radius: 5,
		},
	
		materials: {
			projectile: "projectiles.bullet",
		},
		
		categoryBits: en.utils.vars.COLLISION_GROUP.PROJECTILE,
		maskBits: en.utils.vars.COLLISION_MASKS.PROJECTILE,
		
		particle_effects: {
			tail: "default_tail",
			hit: "default_hit",
			explosion: "default_explosion",
		},
		collision: true,
	}, options);
	
	en.Object.apply(this, [options]);
};

en.Projectile.prototype = {
	
    init: function(){		
		var velX = this.speed * Math.cos(this.rotation),
			velY = this.speed * Math.sin(this.rotation);

		this.Create_Body();
		this.body.SetLinearVelocity(new b2Vec2(this.velocity.x, this.velocity.y));
		this.body.ApplyImpulse(new b2Vec2(velX, velY), this.body.GetPosition());
		
		this.call("init");
	},
	
	Create_Body: function(){
		var body_def = new Box2D.Dynamics.b2BodyDef,
			fix_def = new Box2D.Dynamics.b2FixtureDef,
			mass_data = new b2MassData();
			
		body_def.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
		body_def.angle = this.rotation;
		body_def.position.x = this.position.x;
		body_def.position.y = this.position.y;
	
		fix_def.filter.categoryBits = this.categoryBits;
		fix_def.filter.maskBits = this.maskBits;
		fix_def.shape = new Box2D.Collision.Shapes.b2PolygonShape(this.size);
		fix_def.shape.SetAsBox(this.size_x, this.size_y);
		fix_def.density = this.density;
		fix_def.friction = this.friction;
		fix_def.restitution = this.restitution;

		mass_data.center = new b2Vec2(0,0);
		mass_data.mass = this.mass; 
		mass_data.I = 0;
		
		var body = this.stage.physics_world.CreateBody(body_def);
		
		body.SetUserData (this);
		body.CreateFixture(fix_def);
		body.SetLinearDamping(this.linear_damping);
		body.SetAngularDamping(this.angular_damping);
		body.SetBullet(true);
		body.SetSleepingAllowed(false);
		//body.SetMassData(mass_data);
		
		this.body = body;
		return this.body;
	},
	
	_collide: function(contact){
		this.call("hit", this.body, contact);
		this.destroy_queue = true;
	},
	
	destroy: function(collided){
		this.call("destroy");
		this.stage.removeObject(this);
	},
	
	update: function(){
		if(--this.range < 0){
			this.destroy_queue = true;
		}
		
		
		//this.call(en.eventVars.UPDATE);
	},
};