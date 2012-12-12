en.Stage = function(options, state){
	options = en.utils.defaultOpts({
		name: "",
		objects: new en.List(),
		count: 0,
		physics_world: null,
		width: 5132/en.scale,
		height: 5132/en.scale,
		weapons: [],
		i: 0,
		s: 0,
	}, options);
	
	this.deltaObjects = [];
	this.deltaRemove = [];
	
	this.lastUpdate = Date.now();
	this.deltaTime = 0;
	this.frameTime = 0;
	this.lastServerUpdate = 0;
	
	this.currentTime = Date.now();
	this.accumulator = 0;
	this.dt = 1000/60;
	this.t = 0;
	
	en.Base.apply(this, [options]);

	this.init();
	
	if(state)this.setState(state);
};

en.Stage.prototype = {
	init: function(){
		this.init_physics();
		this.init_weapons();
	},
	
	init_weapons: function(){
		this.weapons.push(en.res.weapon.PlasmaGun);
	},
	
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
		
		contactListener.BeginContact = function(contact, force) {
			var fixA = contact.GetFixtureA().GetBody().GetUserData(),
				fixB = contact.GetFixtureB().GetBody().GetUserData();
			
			if (fixA)
				fixA.call("BeginContact", contact);
		
			if (fixB)
				fixB.call("BeginContact", contact);
		};
		
		world.SetContactListener(contactListener);
	},
	
	/* name: addObject
	 * params: object@en.Object
	 * description: add a object this stage
	 */
	insertObject: function(object){
		object.id = object.id || 1000+this.count;
		this.count++;
		
		if(object.netSynch)
			this.deltaObjects.push(object.id);
		
		console.log("Inserting object of type: ", object.type);
		
		this.objects.add(object.type, object.id, object);
		object.stage = this;
		object.init();
		this.call("objectInsert", object);
	},
	
	removeObject: function(object, method){
		if(object.netSynch)
			this.deltaRemove.push({id: object.id, method: method || 0});
		
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
		if(object.body.IsAwake() && awake || !object.body.IsAwake() && !awake) return false;
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
		
		
/*
		 var newTime = Date.now();
         var frameTime = newTime - this.currentTime;
         if ( frameTime > 250 )
              frameTime = 250;	  // note: max frame time to avoid spiral of death
         this.currentTime = newTime;

         this.accumulator += frameTime;

         while ( this.accumulator >= this.dt )
         {
			  this.physics_world.Step(1/60, 8, 8);
              this.t += this.dt;
              this.accumulator -= this.dt;
         }

        var alpha = this.accumulator / this.dt;
		*/
	
		
		
		var timeStep = 1000/30;
		
		var dateNow = Date.now();
		
		this.deltaTime = dateNow-this.lastUpdate;
		this.lastUpdate = dateNow;
		
		this.t += this.deltaTime;

		this.frameTime += this.deltaTime;
		while(this.frameTime > 0){
			var dTime = Math.min(this.deltaTime, timeStep);
			this.physics_world.Step(dTime/1000, 8, 8);
			this.frameTime -= dTime;
		}
		
		this.physics_world.ClearForces();

	/*
		if(this.s++ == 50){
			console.log(this.objects.index.length);
			this.s = 0;
		};
		*/
		//en.call("stage/end/update", mult);
	},
	
	setStateZZZZZZZZ: function(state){
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
	
	setFullState: function(state){
		this.t = state.time;
		
		for(var i in state){
			if(typeof en.getClass(i) == "function"){
				var objs = state[i];
				for(var j = 0; j < objs.length; j++){
					this.insertObject(new (en.getClass(i))(objs[j]));
				}
			}
		}
	},
	
	setState: function(state){
		var deltaT = this.deltaT = this.t - state.time;
		
		this.serverDT = deltaT/this.deltaTime;
		
		//console.log(this.serverDT);

		//this.t = state.time - deltaT;

		for(var i in state){
			if(typeof en.getClass(i) == "function"){
				var objs = state[i];
				for(var j = 0; j < objs.length; j++){
					var obj = this.objects.get(objs[j].id);
					if(obj){
						obj.setState(objs[j]);
						obj.setAwake();
					}else console.log("object ", objs[j].id, " doesn't exist client side");
				}
			}
		}
		
		
		if(state.remove){
			for(var i = 0; i < state.remove.length; ++i){
				var dr = state.remove[i];
				var obj = this.objects.get(dr.id);
				if(obj){
					obj.destroy_queue = true;
					console.log(obj.id, "destroy queue");
				}else
					console.log("Object removed doesn't exist");
			}
		}
	},
	
	getState: function(){
		var state = {
			time: this.t | 0,
			remove: this.deltaRemove,
		};
		
		var indexes = this.objects.index;//this.objects.getGroup("awake");
		
		for(var i = 0; i < indexes.length; i++){
			var obj = this.objects.get(indexes[i]);
			if(obj.netSynch){
				if(!state[obj.type])
					state[obj.type] = [];
				state[obj.type].push(obj.getState());
			}
		}
		
		this.deltaRemove = [];
		
		return state;
	},
	
	stateBuild: function(group, reset){
		var state = {
			name: "test",
			time: this.t | 0,
			reset: reset,
		};
		
		for(var i = 0, l = group.length; i < l; ++i){
			var obj = this.objects.get(group[i]);
			if(obj.netSynch){
				if(!state[obj.type])
					state[obj.type] = [];
				
				state[obj.type].push(obj.getFullState());
			}
		};
		
		return state;
	},
	
	getDeltaState: function(){
		var state = this.stateBuild(this.deltaObjects, false);
		this.deltaObjects = [];
		return state;
	},
	
	getFullState: function(){
		return this.stateBuild(this.objects.index, true);
	},
};