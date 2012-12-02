en.Object = function(options){
	options = en.utils.defaultOpts({
		type: "Object",
		mesh: "spaceship",
		material: "spaceship_hull",
		
		mass: 12,
		density: 1.0,
		friction: 0.3,
		restitution: 0.1,
		position: {
			x: 0,
			y: 0
		},
		linear_damping: 0.5,
		angular_damping: 5,
		rotation: Math.PI/2,
		categoryBits: en.utils.vars.COLLISION_GROUP.OBJECT,
		maskBits: en.utils.vars.COLLISION_MASKS.OBJECT,
		size: 5,
	}, options);
	en.Base.apply(this, [options]);
};

en.Object.prototype = {
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
		fix_def.shape = new Box2D.Collision.Shapes.b2CircleShape(this.size);
		fix_def.density = this.density;
		fix_def.friction = this.friction;
		fix_def.restitution = this.restitution;
		
		var body = this.stage.physics_world.CreateBody(body_def);
		
		body.SetUserData (this);
		body.CreateFixture(fix_def);
		body.SetLinearDamping(this.linear_damping);
		body.SetAngularDamping(this.angular_damping);
		
		this.body = body;
		return this.body;
	},
	
	init: function(){
		this.Create_Body();
		this.call("init");
	},
	
	__update: function(){
		this.update();
		this._update();
	},
	
	structFull: en.struct.add("en.Object.full", [
		["id", "Uint8", 1],
		["type", "String"],
		["mesh", "String"],
		["material", "String"],
		
		["mass", "Float32", 1],
		["density", "Float32", 1],
		["friction", "Float32", 1],
		["restitution", "Float32", 1],
		["position", "Float32", 2],
		["linear_damping", "Float32", 1],
		["angular_damping", "Float32", 1],
		["rotation", "Float32", 1],
		["size", "Float32", 1],
		["categoryBits", "Int32", 1],
		["maskBits", "Int32", 1],
	]),
	
	structState: en.struct.add("en.Object.state", [
		["id", "Uint8", 1],
		["body", "Struct", [
			["position", "Float32", 2],
			["velocity", "Float32", 2],
			["rotation", "Float32", 1],
			["angualar_velocity", "Float32", 1],
		]]
	]),
	
	getState: function(){
		var position = this.body.GetPosition(),
			velocity = this.body.GetLinearVelocity(),
			rotation = this.body.GetAngle(),
			angular_velocity = this.body.GetAngularVelocity();
		
		return {
			id: this.id,
			body: {
				position: [position.x, position.y],
				velocity: [velocity.x, velocity.y],
				angualar_velocity: rotation,
				angular_velocity: angular_velocity,
			}
		}
	},

	getFullState: function(){
	},
	
	setState: function(data){
		
	},

	setFullState: function(){
	},
	
	update: function(){
		
	},
	
	destroy: function(){
		this.call("destroy");
		this.stage.removeObject(this);
	},
};