client.Spaceship = function(config){
	config = config || {};
	config.shieldTimeout = 0;
	config.noUpdate = false;
	
	en.Spaceship.apply(this, [config]);
};

client.Spaceship.prototype = {
	_init: function(){
		this.create_mesh();
	},
	
	_update: function(){
		  if(this.thrusting)
		  	this.thrustEffect.unPause();
		  else
		  	this.thrustEffect.pause();
			
		  var pos = this.body.GetPosition(),
			  mesh = this.mesh;
		  mesh.position.x = pos.x*en.scale;
		  mesh.position.y = pos.y*en.scale;
		  mesh.rotation.z = this.body.GetAngle();
		  
		  var vel = this.body.GetLinearVelocity();
		  
		  var angl = this.body.GetAngle() + (this.thrusting == 2 ? 0 : Math.PI);
		  this.thrustEffect.setInitVelocity(vel.x, vel.y);
		  this.thrustEffect.setAngle(angl);
		  var posX = Math.cos(angl)*en.scale*4;
		  var posY = Math.sin(angl)*en.scale*4;
		  this.thrustEffect.translate(pos.x*en.scale*2+posX, pos.y*en.scale*2+posY);
	},
	
	create_mesh: function(){
		this.thrustEffect = new client.PE(client.stage.ParticleSystem, {});
		
		var material = en.resources.get("material", this.material),
			geometry = new THREE.PlaneGeometry(this.size*en.scale*2, this.size*en.scale*2);
	   
		//	Multi material
		if (typeof(material) == 'object' && (material instanceof Array))
			this.mesh = THREE.SceneUtils.createMultiMaterialObject( geometry, material );
		else
			this.mesh = new THREE.Mesh(geometry, material);
		//mesh.rotation.x = Math.PI;
		this.mesh.rotation.z = this.body.GetAngle();
		//mesh.rotation.x=1;
		var pos = this.body.GetPosition();
		this.mesh.position.set(pos.x*en.scale, pos.y*en.scale, 0);
		//mesh.overdraw = true;
		//mesh.castShadow = true;
		//mesh.receiveShadow = true;
		
		client.stage.layers.actors.add(this.mesh);
	},
	
	_destroy: function(){
		client.stage.layers.actors.remove(this.mesh);
	},
	
};


en.extend(client.Spaceship, en.Spaceship);