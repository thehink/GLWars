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
		boostRecharge: 3000,
		
		//KEY DATA
		
		firing: false,
		boosting: false,
		thrusting: 0,
		turning_left: false,
		turning_right: false,
		weapon: 0,
		
		//END KEY Data

		weapon_spots: {
			special: {
				name: "special",
				spots: [],
			},
			
			secondary:{
				name: "secondary",
				spots: [
					{
						angle: 0,
						x: 0,
						y: 2,
					}
				],
			},
			primary: {
				name: "primary",
				spots: [
					{
						angle: 0.1,
						x: 1.2,
						y: 2.5,
					},
					{
						angle: -0.1,
						x: -1.2,
						y: 2.5,
					}
				],
			}
		},
		
		weapon_bonus: {
			firerate: 1.0,
			recoil: 1.0,
		},

	}, options);
	
	this.weapons = [];
	this.activeWeapon = 0;
	
	this.boostTimeleft = 0;
	this.boostLock = false;
	
	en.Entity.apply(this, [options]);
	this.defaultt();
};

en.Spaceship.prototype = {
	
	defaultt: function(){
		this.addWeapon("PlasmaGun");
		this.setWeapon(0);
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

		this.call("_damage", who, type, damage);
	},
	
	fire: function(){
		//todo: fire weapon
	
		if(this.activeWeapon){
			if(!this.body.IsAwake())this.stage.setAwake(this, true);
			this.activeWeapon.fire(this, this.body.GetPosition(), this.body.GetAngle());
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
	
	addWeapon: function(weaponName){
		
		var weapon = en.resources.get("weapon", weaponName);
		
		if(this.weapon_spots[weapon.class]){
			if(this.weapons.indexOf(weapon) == -1)
				this.weapons.push(new en.Weapon(weapon));
				
		}else{
			console.log("Ship can't carry weapon");
			this.call("WeaponCantEquipped");
		}
	},
	
	setWeapon: function(w){
		if(this.weapons[w]){
			this.activeWeapon = this.weapons[w];
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
		}else if(this.boostLock && this.boostTimeleft >= this.boostTime)
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
		this.destroy_queue = true;
	},
	
	destroy: function(method){
		this.call("explode");
		this.call("destroy");
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
			weapon: 0,
		};
		
		return data;
	},
	
	setRT_data: function(data){
		this.firing = data.firing;
		this.boosting = data.boosting;
		this.thrusting = data.thrusting;
		this.turning_left = data.turning_left;
		this.turning_right = data.turning_right;
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
		  positionDiff.Subtract(currentPos);
		  
		  
		  /*
		  var dtx = positionDiff.x / (state.body.velocity[0]-currentVelocity.x);
		  var dty = positionDiff.y / (state.body.velocity[1]-currentVelocity.y);

		  currentPos.Set(
		  	state.body.position[0] + (dtx*state.body.velocity[0]),
			state.body.position[1] + (dty*state.body.velocity[0])
		  );
		  */
		  
		 

		  
		  if(positionDiff.LengthSquared() > 625){
			  currentPos.Set(state.body.position[0], state.body.position[1]);
		  }else{
			  positionDiff.Multiply(0.01);
		  	  currentPos.Add(positionDiff);
		  }
		
		  
		 
		  
		  var currentRotation = this.body.GetAngle(),
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
		};
	},
};

en.struct.extend("stageFullState", "Spaceship", [
		["id", "Uint8", 1],
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
]);

en.struct.extend("stageState", "Spaceship", [
	  ["id", "Uint8", 1],
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