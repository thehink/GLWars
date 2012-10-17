en.Spaceship = function(options){
	options = en.utils.defaultOpts({
		name: "default",
		type: "Spaceship",
		images: {
			ship: "ships/TestSpaceShip",
			shield: "shield",
		},
		
		particle_effects: {
			tail: "ship/default/tail",
			explosion: "ship/default/explosion",
		},
		
		weapons: [],
		activeWeapon: 0,
		
		speed_forward: 1000,
		speed_backward: 100,
		mass: 12,
		thrust: 15,
		decay: .99,
		turnSpeed: 0.45,
		size: 2,

		health: 100,
		shields: 100,
		shield_radius: 3.5,
		shield_recharge_time: 10,
		shield_recharge_frequency: 5,
		speed: 10,
		weapon_spots: [
			{
				x: -50,
				y: -50,
			},
			{
				x: 50,
				y: 50,
			},
		],
		weapon_bonus: {
			damage: 1.0,
			firerate: 1.0,
			clip: 1.0,
			ammo: 1.0,
			recoil: 1.0,
		},
		categoryBits: en.utils.vars.COLLISION_GROUP.PLAYER,
		maskBits: en.utils.vars.COLLISION_MASKS.PLAYER,
	}, options);
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
		this.destroy();
	},
	
	Take_Damage: function(who, type, damage, point, angle){
		
		if(this.shields > 0){
			this.shields -= damage;
			if(this.shields <= 0){
				this.call("shields_destroyed");
			}
		}else{
			this.health -= damage;
			if(this.health <= 0){
				this.explode();
			}
		}
		
		this.call("Take_Damage", who, type, damage, point, angle);
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
	
	addWeapon: function(weapon){
		this.weapons.push(weapon);
	},
	
	setWeapon: function(w){
		if(this.weapons[w]){
			var opt = en.resources.get("weapon", this.weapons[w]);
			this.activeWeapon = new en.Weapon(opt);
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
	
	_collide: function(contact){
		var fixA = contact.GetFixtureA().GetBody().GetUserData(),
			fixB = contact.GetFixtureB().GetBody().GetUserData();
			
			//console.log(contact);
	},
	
	update: function(){
		if (this.thrusting == 1) {
            var xx1 = Math.cos(this.body.GetAngle())*this.speed_forward,
				yy1 = Math.sin(this.body.GetAngle())*this.speed_forward;
            this.body.ApplyForce(new b2Vec2(xx1, yy1), this.body.GetPosition());
        }
		
		if (this.thrusting == 2) {
            var xx1 = -Math.cos(this.body.GetAngle())*this.speed_backward,
				yy1 = -Math.sin(this.body.GetAngle())*this.speed_backward;
            this.body.ApplyForce(new b2Vec2(xx1, yy1), this.body.GetPosition());
        }
	},
	
};