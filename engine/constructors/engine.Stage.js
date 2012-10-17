en.Stage = function(options, state){
	options = en.utils.defaultOpts({
		name: "",
		objects: new en.List(),
		count: 0,
		physics_world: null,
		width: 5132/en.scale,
		height: 5132/en.scale,
		lastUpdate: 0,
		i: 0,
		s: 0,
	}, options);
	
	en.Base.apply(this, [options]);
	
	
	this.init_physics();
	
	if(state)this.setState(state);
};

en.Stage.prototype = {
	init_physics: function(){
		var world = this.physics_world = new Box2D.Dynamics.b2World(new b2Vec2(0, 0), true);
		
		var fixDef = new b2FixtureDef;
		fixDef.density = 1.0;
		fixDef.friction = 0.3;
		fixDef.restitution = 0.2;
		 
		var bodyDef = new b2BodyDef;
		
		bodyDef.type = b2Body.b2_staticBody;
		fixDef.shape = new b2PolygonShape;
		
		//
		// Walls
		//
		fixDef.shape.SetAsBox(this.width, 2);
		bodyDef.position.Set(0, this.height/2);
		world.CreateBody(bodyDef).CreateFixture(fixDef);
		
		bodyDef.position.Set(0, -this.height/2);
		world.CreateBody(bodyDef).CreateFixture(fixDef);
		
		fixDef.shape.SetAsBox(2, this.height);
		bodyDef.position.Set(this.width/2, 0);
		world.CreateBody(bodyDef).CreateFixture(fixDef);
		
		bodyDef.position.Set(-this.width/2, 0);
		world.CreateBody(bodyDef).CreateFixture(fixDef);
		
		var contactListener = new Box2D.Dynamics.b2ContactListener;
		contactListener.PostSolve = function(contact) {
			var fixA = contact.GetFixtureA().GetBody().GetUserData(),
				fixB = contact.GetFixtureB().GetBody().GetUserData();
			
			if (fixA)
				fixA.call("collide", contact);
		
			if (fixB)
				fixB.call("collide", contact);
		};
		world.SetContactListener(contactListener);
	},
	
	/* name: addObject
	 * params: object@en.Object
	 * description: add a object this stage
	 */
	insertObject: function(object){
		object.id = this.count++;
		this.objects.add(object.type, object.id, object);
		object.stage = this;
		object.init();
		this.call("object/insert", object);
	},
	
	removeObject: function(object){
		this.physics_world.DestroyBody(object.body);
		this.objects.remove(object.id);
	},
	
	setMovingObject: function(object){
		object.SetAwake(true);
		this.objects.addToGroup("awake", object.id);
	},
	
	removeAllObjects: function(){
		for(var i in this.objects){
			this.removeObject(this.objects[i]);
		}
	},
	
	setAwake: function(object, awake){
		object.body.SetAwake(awake);
		if(awake)this.objects.addToGroup("awake", object.id);
		else
		this.objects.removeFromGroup("awake", object.id);
	},
	
	isAwake: function(object){
		return object.body.IsAwake();
	},
	
	update: function(mult, step){
		
		//en.call("stage/begin/update", mult);
		var group = this.objects.index;
		for(var i = 0, l = group.length; i < l; ++i){
			var obj = this.objects.get(group[i]);
			if(obj){
				if(obj.destroy_queue){
					obj.destroy();
				}else
				if(obj.body.IsAwake()){
					obj.__update();
				}else{
					this.objects.removeFromGroup("awake", obj.id);
				}
			}
		}
		
		this.physics_world.Step(1 / 60, 10, 10);
		this.physics_world.ClearForces();
		this.lastUpdate = Date.now();
	/*
		if(this.s++ == 50){
			console.log(this.objects.index.length);
			this.s = 0;
		};
		*/
		//en.call("stage/end/update", mult);
	},
	
	setState: function(state){
		this.name = state.name || this.name;
		
		this.resetState();
		
		for(var i = 0, l = state.objects.length; i < l; ++i){
			var obj = state.objects[i];
			
			// try get custom constructor
			var constructor = en.call("obj_constructor", obj.type);
			
			// check if valid constructor OR use default if exists
			if(typeof constructor==="function"){
				this.insertObject(new constructor(obj));
			}else if(typeof en[obj.type] === "function"){
				this.insertObject(new constructor(obj));
			}else
				en.log("WARNING: Object without constructor", obj);
		}
	},
	
	getState: function(){
		var state = {
			name: this.name,
			objects: [],
			maxWidth: this.maxWidth,
			maxHeight: this.maxHeight
		}
		
		for(var i in this.objects){
			ret.objects.push(this.objects[i].getData());
		}
		
		return state;
	},
};