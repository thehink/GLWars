en.Spaceship = function(options){
	options = en.utils.defaultOpts({
		name: "default",
		type: "Spaceship",
		images: {
			ship: "ships/TestSpaceShip",
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

		speed_forward: 400,
		speed_backward: 100,
		mass: 12,
		thrust: 15,
		decay: .99,
		turnSpeed: 0.45,
		size: 2,

		health: 100,
		shields: 100,
		shield_radius: 2.1,
		shield_recharge_time: 10,
		shield_recharge_frequency: 5,

		boostForce: 700,
		boostTime: 100,
		boostRecharge: 100,

		weapon_spots: {
			heavy:{
				name: "heavy",
				spots: [
					{
						angle: 0,
						x: 0,
						y: 2,
					}
				],
			},
			medium: {
				name: "medium",
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
		
		categoryBits: en.utils.vars.COLLISION_GROUP.PLAYER,
		maskBits: en.utils.vars.COLLISION_MASKS.PLAYER,
	}, options);
	
	this.weapons = [];
	this.activeWeapon = 0;
	
	this.boosting = false;
	this.boostedTime = 0;
	this.boostLock = false;
	
	en.Entity.apply(this, [options]);
	this.defaultt();
};

en.Spaceship.prototype = {
	
	defaultt: function(){
		this.addWeapon("default");
		this.setWeapon(0);
	},
	
	explode: function(){
		this.call("explode");
		this.destroy_queue = true;
	},
	
	damage: function(who, type, damage){

		
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
			if(this.health <= 0){
				this.explode();
			}
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
		if(!this.body.IsAwake())this.stage.setAwake(this, true);
		this.body.ApplyTorque(this.body.GetInertia()*this.turnSpeed/(1/60.0));
	},
	
	turnRight: function(){
		if(!this.body.IsAwake())this.stage.setAwake(this, true);
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
			this.activeWeapon = new en.Weapon(this.weapons[w]);
		}
	},
	
	startThrust: function(speed){
		if(!this.thrusting){
			this.thrusting = true;
			this.stage.setAwake(this, true);
			this.thrusting = 1;
		}
	},
	
	backThrust: function(){
		this.thrusting = 2;
	},
	
	stopThrust: function(){
		this.thrusting = 0;
	},
	
	boost: function(){
		if(!this.thrusting)this.thrusting = 1;
		if(!this.boostLock && this.boostedTime++ < this.boostTime){
			this.boosting = true;
		}else if(this.boosting){
			this.boosting = false;
			this.boostLock = true;
		}

	},
	
	stopBoost: function(){
		if(this.boosting)
			this.boosting = false;
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
		var boostForce = this.boosting ? this.boostForce : 0;
		
		if(!this.boosting && this.boostedTime > 0){
			this.boostedTime -= this.boostTime/this.boostRecharge;
		}else if(this.boostLock)
			this.boostLock = false;
		
		if (this.thrusting == 1) {
            var xx1 = Math.cos(this.body.GetAngle())*(this.speed_forward + boostForce),
				yy1 = Math.sin(this.body.GetAngle())*(this.speed_forward + boostForce);
            this.body.ApplyForce(new b2Vec2(xx1, yy1), this.body.GetPosition());
        }
		
		if (this.thrusting == 2) {
            var xx1 = -Math.cos(this.body.GetAngle())*(this.speed_backward + boostForce),
				yy1 = -Math.sin(this.body.GetAngle())*(this.speed_backward + boostForce);
            this.body.ApplyForce(new b2Vec2(xx1, yy1), this.body.GetPosition());
        }
	},
	
};