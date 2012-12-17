en.Object = function(options){
	options = en.utils.defaultOpts({
		name: "default",
		type: "Object",
		material: "spaceship_hull",
		
		netSynch: false,
		
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
	
	/*
	this.bodyDiff = {
		position: new b2Vec2(),
		rotation: 0,
	},
	*/
	
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
		fix_def.filter.groupIndex = -this.id;
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
		this.call("update");
	},
	
	setAwake: function(){
		this.stage.setAwake(this, true);
	},
	
	setAsleep: function(){
		this.stage.setAwake(this, false);
	},
	
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
				rotation: rotation,
				angular_velocity: angular_velocity,
			}
		}
	},

	getFullState: function(){
		return {
			id: this.id,
			type: this.type,
			material: this.material,
			
			mass: this.mass,
			density: this.density,
			friction: this.friction,
			restitution: this.restitution,
			position: {
				x: this.position.x,
				y: this.position.y,
			},
			linear_damping: this.linear_damping,
			angular_damping: this.angular_damping,
			rotation: this.rotation,
			size: this.size,
			categoryBits: this.categoryBits,
			maskBits: this.maskBits,
		};
	},
	
	setState: function(state){
		//this.stage.lastServerUpdate;
		
		//console.log(this.body.GetAngularVelocity()/state.body.angular_velocity, this.stage.serverDT);
		
		var mult = this.stage.serverDT/(100000/60);

		this.body.SetPositionAndAngle(new b2Vec2(state.body.position[0], state.body.position[1]), state.body.rotation);
		this.body.SetAngularVelocity(state.body.angular_velocity);
		this.body.SetLinearVelocity(new b2Vec2(state.body.velocity[0], state.body.velocity[1]));
	},

	setFullState: function(){
		
	},
	
	lagCompensate: function(){
		  var currentPos = this.body.GetPosition().Copy();
		  var positionDiff = this.bodyDiff.position.Copy();
		  positionDiff.Subtract(currentPos);
		  positionDiff.Multiply(0.1);
		  currentPos.Add(positionDiff);
		  
		  var currentRotation = this.body.GetAngle(),
			  angleDiff = this.bodyDiff.rotation-this.body.GetAngle();
  
		  this.body.SetPositionAndAngle(currentPos, (Math.abs(angleDiff) > 0.5 ? this.bodyDiff.rotation : currentRotation+0.1*angleDiff));
	},
	
	update: function(){
		
	},
	
	destroy: function(method){
		this.call("destroy");
		this.stage.removeObject(this);
		this.destroy_queue = false;
	},
};

en.struct.extend("stageFullState", "Object", [
		["id", "Int32", 1],
		["type", "String"],
		["material", "String"],
		
		["mass", "Float32", 1],
		["density", "Float32", 1],
		["friction", "Float32", 1],
		["restitution", "Float32", 1],
		["position", "Struct", [
			["x", "Float32", 1],
			["y", "Float32", 1],
		]],
		["linear_damping", "Float32", 1],
		["angular_damping", "Float32", 1],
		["rotation", "Float32", 1],
		["size", "Float32", 1],
		["categoryBits", "Int32", 1],
		["maskBits", "Int32", 1],
]);

en.struct.extend("stageState", "Object", [
	  ["id", "Int32", 1],
	  ["body", "Struct", [
		  ["position", "Float32", 2],
		  ["velocity", "Float32", 2],
		  ["rotation", "Float32", 1],
		  ["angular_velocity", "Float32", 1],
	  ]]
]);