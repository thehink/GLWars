en.Spaceship = function(options){
	options = en.utils.defaultOpts({
		name: "default",
		type: "Spaceship",
		netSynch: true,
		synchStep: true, 
		images: {
			ship: "ship_fighter",
			shield: "shield",
		},
		
		soundFX: {
			engine: "ShipEngine",
			boost: "ShipBoost",
		},
		
		particle_effects: {
			thrust: "ThrustEffect",
			explosion: "DefaultExplosion",
		},
		
		material: "spaceship_hull",
		color: 0xffffff,
		
		size: 2,
		mass: 12,
		categoryBits: en.utils.vars.COLLISION_GROUP.PLAYER,
		maskBits: en.utils.vars.COLLISION_MASKS.PLAYER,

		speed_forward: 400,
		speed_backward: 100,
		thrust: 15,
		decay: .99,
		turnSpeed: 0.45,
		turning: 0,
		health: 100,
		maxHealth: 100,
		shields: 100,
		maxShields: 100,
		shield_radius: 2.1,
		shield_recharge_time: 10,
		shield_recharge_frequency: 5,

		boostForce: 700,
		boostTime: 2000,
		boostRecharge: 8000,
		
		//KEY DATA
		
		firing: false,
		boosting: false,
		thrusting: 0,
		turning_left: false,
		turning_right: false,
		weapon: en.utils.vars.WCLASS.primary,
		
		//END KEY Data

		weapon_spots: {
			primary: {
				weapon: en.res.weapon.PlasmaGun,
				spots: [
					{
						angle: 0.1,
						x: 1.7,
						y: 0.5,
					},
					{
						angle: -0.1,
						x: -1.7,
						y: 0.5,
					}
				],
			},
			
			secondary:{
				weapon: en.res.weapon.PlasmaGunTwo,
				spots: [
					{
						angle: 0,
						x: 0,
						y: 1,
					}
				],
			},
			
			special: {
				weapon: -1,
				spots: [],
			},
			
			bonus: {
				weapon: -1,
				spots: [],
			},
			
		},
		
		weapon_bonus: {
			firerate: 1.0,
			recoil: 1.0,
		},

	}, options);
	
	this.weapons = {};
	this.activeWeapon = 0;
	
	this.boostTimeleft = 0;
	this.boostLock = false;
	
	en.Entity.apply(this, [options]);
	this.setWeapons();
};

en.Spaceship.prototype = {
	setWeapons: function(){
		for(var i in this.weapon_spots){
			var weapon = en.getRes(this.weapon_spots[i].weapon);
			if(weapon && (weapon.class == i || 1==1)){
				for(var j = 0; j < this.weapon_spots[i].spots.length; ++j){
					this.addWeapon(en.utils.vars.WCLASS[i], weapon);
				}
			}
		}

		this.setActiveWeapons(this.weapon);
	},
	
	damage: function(who, type, damage){
		if(!en.isServer)return false;
		
		if(this.shields > 0){
			var tmpshields = this.shields;
			this.shields -= damage;
			if(this.shields <= 0){
				this.call("shields_depleted");
				damage = damage-tmpshields;
			}
		}
		
		if(this.shields < 1){
			this.health -= damage;
		}
		
		this.lastDamaged = {
			who: who,
			type: type,
			damage: damage,
		};

		this.call("_damage", who, type, damage);
	},
	
	fire: function(){
		if(this.activeWeaponClass){
			this.stage.setAwake(this, true);
			
			var activeWeapons = this.weapons[this.weapon];
			
			for(var i = 0; i < activeWeapons.length; ++i){
				activeWeapons[i].fire(this, this.weapon_spots[this.activeWeaponClass].spots[i]);
			}

			
		}
	},
	
	
	turnLeft: function(){
		this.stage.setAwake(this, true);
		this.body.ApplyTorque(this.body.GetInertia()*this.turnSpeed/(1/60.0));
	},
	
	turnRight: function(){
		this.stage.setAwake(this, true);
		this.body.ApplyTorque(-this.body.GetInertia()*this.turnSpeed/(1/60.0));
	},
	
	addWeapon: function(wclass, weapon){
		
		if(!this.weapons[wclass])
			this.weapons[wclass] = [];
		
		this.weapons[wclass].push(new en[weapon.type](weapon));
	},
	
	setActiveWeapons: function(wclass){
		if(this.weapon_spots[en.utils.vars.WCLASSR[wclass]] && this.weapons[wclass] && this.weapons[wclass].length > 0){
			this.activeWeaponClass = en.utils.vars.WCLASSR[wclass];
			this.weapon = wclass;
		}
	},
	
	thrust_forward: function(){
		var boostForce = this.boosting ? this.boostForce : 0;
		var xx1 = Math.cos(this.body.GetAngle())*(this.speed_forward + boostForce),
			yy1 = Math.sin(this.body.GetAngle())*(this.speed_forward + boostForce);
        this.body.ApplyForce(new b2Vec2(xx1, yy1), this.body.GetPosition());
		
	},
	
	thrust_back: function(){
		var boostForce = this.boosting ? this.boostForce : 0;
		
		var xx1 = -Math.cos(this.body.GetAngle())*(this.speed_backward + boostForce),
			yy1 = -Math.sin(this.body.GetAngle())*(this.speed_backward + boostForce);
        this.body.ApplyForce(new b2Vec2(xx1, yy1), this.body.GetPosition());
	},
	
	stopThrust: function(){
		this.thrusting = 0;
	},
	
	boost: function(){
		if(!this.thrusting)this.thrusting = 1;
		
		if(!this.boostLock && this.boostTimeleft > 0){
			this.boosting = true;
			this.boostTimeleft -= this.stage.deltaTime;
		}else if(this.boosting){
			this.boosting = false;
			this.boostLock = true;
		}

	},
	
	stopBoost: function(){
		if(this.boosting)
			this.boosting = false;
	},
	
	resetState: function(){
		this.health = this.maxHealth;
		this.shields = this.maxShields;
		this.boostTimeleft = this.boostTime;
		this.destroy_queue = false;
	},
	
	_collide: function(contact){
		var fixA = contact.GetFixtureA().GetBody().GetUserData(),
			fixB = contact.GetFixtureB().GetBody().GetUserData();
			
			this.call("hit", this.body, contact);
	},
	
	_BeginContact: function(contact, force){
		var fixA = contact.GetFixtureA().GetBody().GetUserData(),
			fixB = contact.GetFixtureB().GetBody().GetUserData();
			this.call("_BeginContact", this.body, contact);
	},
	
	update: function(){
		if(this.health <= 0){
			if(en.isServer)this.explode();
		}
		
		if(!this.boosting && this.boostTimeleft < this.boostTime){
			this.boostTimeleft += this.stage.deltaTime * (this.boostTime / this.boostRecharge);
		}
		
		if(this.boostLock && this.boostTimeleft >= this.boostTime/3)
			this.boostLock = false;
		
		if(this.boostTimeleft > this.boostTime)
			this.boostTimeleft = this.boostTime;
			
		
		if(this.thrusting == 1)
			this.thrust_forward();
		else if(this.thrusting == 2)
			this.thrust_back();
		
		if(this.turning_left)
			this.turnLeft();
		else if(this.turning_right)
			this.turnRight();

		if(this.boosting)
			this.boost();
			
		if(this.firing)
			this.fire();
	},
	
	explode: function(){
		this.stage.deltaKilled.push({
			id: this.id,
			by: this.lastDamaged.who.id,
			type: 0,
		});
		this.destroy_queue = true;
	},
	
	destroy: function(method){
		console.log("destroyed: ", this.id);
		this.call("explode", this);
		this.call("destroy", this);
		this.stage.removeObject(this);
		this.destroy_queue = false;
	},
	
	getRT_data: function(){
		var data = {
			firing: this.firing,
			boosting: this.boosting,
			thrusting: this.thrusting,
			turning_left: this.turning_left,
			turning_right: this.turning_right,
			weapon: this.weapon,
		};
		
		return data;
	},
	
	setRT_data: function(data){
		this.firing = data.firing;
		this.boosting = data.boosting;
		this.thrusting = data.thrusting;
		this.turning_left = data.turning_left;
		this.turning_right = data.turning_right;
		this.setActiveWeapons(data.weapon);
	},
	
	setState: function(state){
		this.setRT_data(state.clientData);
		
		this.boostTimeleft = state.boostTimeleft;
		this.health = state.health;
		this.shields = state.shields;
		
		//this.bodyDiff.position.Set(state.body.position[0], state.body.position[1]);
		//this.bodyDiff.rotation = state.body.rotation;
		
		  var currentVelocity = this.body.GetLinearVelocity().Copy();
		  var currentPos = this.body.GetPosition().Copy();
		  var positionDiff = new b2Vec2(state.body.position[0], state.body.position[1]);
		  
		  /*
		  positionDiff.Add({
			 x:en.latancy*(state.body.velocity[0]/1000),
			 y:en.latancy*(state.body.velocity[1]/1000)
		  });
		  */
		  positionDiff.Subtract(currentPos);
		  
		  var realDiffX = positionDiff.x - currentPos.x;
		  var realDiffY = positionDiff.y - currentPos.y;
		  var predictedDiffX = en.latancy*state.body.velocity[0]/60;
		  var predictedDiffY = en.latancy*state.body.velocity[1]/60;
		  
		  //console.log("Realdiff      : ", realDiffX, realDiffY);
		  //console.log("Predicted diff: ", predictedDiffX, predictedDiffY);
		  
		  //currentPos.Add({x: predictedDiffX, y: predictedDiffY});

		  if(positionDiff.LengthSquared() > 25){
			  currentPos.Set(state.body.position[0], state.body.position[1]);
		  }else{
			  positionDiff.Multiply(0.01);
		  	  currentPos.Add(positionDiff);
		  }
		  
		  //console.log((positionDiff.Length() * 1000 | 0)/1000);
		 
		  
		  var currentRotation = this.body.GetAngle(),
		  	  rotation = state.body.rotation + en.latancy * (state.body.angular_velocity / 60),
			  angleDiff = state.body.rotation-this.body.GetAngle();

		this.body.SetPositionAndAngle(currentPos, (angleDiff > 0.5 ? state.body.rotation : currentRotation+0.12*angleDiff));
		this.body.SetAngularVelocity(state.body.angular_velocity);
		this.body.SetLinearVelocity(new b2Vec2(state.body.velocity[0], state.body.velocity[1]));
	},
	
	getState: function(){
		var position = this.body.GetPosition(),
			velocity = this.body.GetLinearVelocity(),
			rotation = this.body.GetAngle(),
			angular_velocity = this.body.GetAngularVelocity();
		
		return {
			id: this.id,
			health: this.health,
			shields: this.shields,
			boostTimeleft: this.boostTimeleft,
			body: {
				position: [position.x, position.y],
				velocity: [velocity.x, velocity.y],
				rotation: rotation,
				angular_velocity: angular_velocity,
			},
			clientData: this.getRT_data(),
		}
	},

	getFullState: function(){
		return {
			id: this.id,
			name: this.name,
			type: this.type,
			material: this.material,
			color: this.color,
			
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
			weapon_spots: this.weapon_spots,
		};
	},
};

en.struct.extend("stageFullState", "Spaceship", [
		["id", "Int32", 1],
		["type", "String"],
		["name", "String"],
		["material", "String"],
		["color", "Int32", 1],

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
		
		["weapon_spots", "Struct", [
			["primary", "Struct", [
				["weapon", "Int32", 1],
				["spots", "Array", [
					["angle", "Float32", 1],
					["x", "Float32", 1],
					["y", "Float32", 1],
				]],
			]],
			["secondary", "Struct", [
				["weapon", "Int32", 1],
				["spots", "Array", [
					["angle", "Float32", 1],
					["x", "Float32", 1],
					["y", "Float32", 1],
				]],
			]],
			["special", "Struct", [
				["weapon", "Int32", 1],
				["spots", "Array", [
					["angle", "Float32", 1],
					["x", "Float32", 1],
					["y", "Float32", 1],
				]],
			]]
		]],
		
]);

en.struct.extend("stageState", "Spaceship", [
	  ["id", "Int32", 1],
	  ["health", "Int32", 1],
	  ["shields", "Int32", 1],
	  ["boostTimeleft", "Int32", 1],
	  ["body", "Struct", [
		  ["position", "Float32", 2],
		  ["velocity", "Float32", 2],
		  ["rotation", "Float32", 1],
		  ["angular_velocity", "Float32", 1],
	  ]],
	  ["clientData", "Struct", [
		["firing", "Bool"],
		["boosting", "Bool"],
		["thrusting", "Uint8", 1],
		["turning_right", "Bool"],
		["turning_left", "Bool"],
		["weapon", "Uint8", 1]
	  ]]
]);