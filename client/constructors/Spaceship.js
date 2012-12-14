client.Spaceship = function(config){
	config = config || {};
	config.shieldTimeout = 0;
	config.noUpdate = false;
	config.meshes = {};
	
	en.Spaceship.apply(this, [config]);
};

client.Spaceship.prototype = {
	_init: function(){
		
		this.thrustEffect = client.effects.play("ShipThrustFire", -1);
		this.thrustEffect.pause();
		
		this.engineAudio = en.resources.get("audio", "ship_engine").loop(true).play();
		this.engineAudio.node.playbackRate.value = 0.5;
		
		this.create_mesh();
	},
	
	_explode: function(){
		
		var position = this.body.GetPosition(),
			velocity = this.body.GetLinearVelocity();
		
		client.effects.play("Explosion", 15, {
			radius: this.size,
			position: {
				x: position.x*en.scale*2,
				y: position.y*en.scale*2,
			},
			initVelocity: {
				x: velocity.x/3,
				y: velocity.y/3,
			},
		});
		
		this.call("_explode");
		
	},
	
	_update: function(){
	
		  var pr = this.engineAudio.node.playbackRate.value;
	
		  if(this.thrusting){
				if(pr < 1.5) this.engineAudio.node.playbackRate.value+= 0.1;
				if(this.thrustEffect.paused)
					this.thrustEffect.restart();
				else
					this.thrustEffect.unPause();
			}
		  else{
		  	this.thrustEffect.pause();
			if(pr > 0.5) this.engineAudio.node.playbackRate.value-= 0.1;
		  }
			
		  if(pr > 1.5) this.engineAudio.node.playbackRate.value-= 0.1;
			
		  if(this.boosting){
			  if(pr < 3) this.engineAudio.node.playbackRate.value+= 0.3;
		  	  this.thrustEffect.boosting = true;
		  }
		  else{
		  	 this.thrustEffect.boosting = false;
		  }
			
		  var pos = this.body.GetPosition(),
			  mesh = this.mesh,
			  hull = this.meshes.hull;
			  
		  mesh.position.x = pos.x*en.scale;
		  mesh.position.y = pos.y*en.scale;
		  hull.rotation.z = this.body.GetAngle();
		  
		  if(this.shield_timeout > 0){
			  this.shield_timeout--;
			  this.meshes.shield.material.opacity = this.shield_timeout/10;
			  if(this.shield_timeout==0)this.meshes.shield.visible = false;
		  }
		  
		  
		  var vel = this.body.GetLinearVelocity();
		  
		  var angl = this.body.GetAngle() + (this.thrusting == 2 ? 0 : Math.PI);
		  this.thrustEffect.setInitVelocity(vel.x, vel.y);
		  this.thrustEffect.setAngle(angl);
		  var posX = Math.cos(angl)*en.scale*5;
		  var posY = Math.sin(angl)*en.scale*5;
		  this.thrustEffect.translate(pos.x*en.scale*2+posX, pos.y*en.scale*2+posY);
	},
	
	create_mesh: function(){
		
		var mesh = this.mesh = new THREE.Object3D();
		
		var material = en.resources.get("material", this.material),
			geometry = new THREE.PlaneGeometry(this.size*en.scale*2, this.size*en.scale*2);
		
		this.meshes.hull = new THREE.Mesh(geometry, material);
		this.meshes.hull.rotation.z = this.body.GetAngle();
		this.meshes.hull.material.color.setHex(this.color);
		
		var pos = this.body.GetPosition();
		this.mesh.position.set(pos.x*en.scale, pos.y*en.scale, 0);
		//mesh.overdraw = true;
		//mesh.castShadow = true;
		//mesh.receiveShadow = true;
		
		
		var shield_material = en.resources.get("material", "spaceship.shield"),
			geometry = new THREE.PlaneGeometry(this.size*en.scale*3+32, this.size*en.scale*3+32);
			
		this.meshes.shield = new THREE.Mesh(geometry, shield_material);
		this.meshes.shield.visible = false;
		
		for(var i in this.meshes){
			this.mesh.add(this.meshes[i]);
		}
		
		client.stage.layers.actors.add(this.mesh);
	},
	
	__BeginContact: function(body, contact){
		var body1 = contact.GetFixtureA().GetBody(),
			body2 = contact.GetFixtureB().GetBody();
			
		var man = new Box2D.Collision.b2WorldManifold();
		contact.GetWorldManifold(man);
		
		
		if(this.shields > 0){
			var collision_point = man.m_points[0],
				body_vel = body1.GetLinearVelocity().Copy(),
				body_pos = body.GetPosition();
				
			body_vel.Subtract(body2.GetLinearVelocity());
			
			var angle = Math.atan2(body_pos.y - collision_point.y, body_pos.x - collision_point.x);
			
			if(body_vel.LengthSquared() > 50){
				this.meshes.shield.rotation.z = angle;
				this.meshes.shield.visible = true;
				this.shield_timeout = 10;
			}
		}
	},
	
	_destroy: function(){
		this.thrustEffect.setInitVelocity(0, 0);
		client.effects.stop(this.thrustEffect);
		this.engineAudio.stop();
		client.stage.layers.actors.remove(this.mesh);
	},
	
};


