client.Projectile = function(config){
	config = config || {};
	config.shieldTimeout = 0;
	
	en.Projectile.apply(this, [config]);
};

client.Projectile.prototype = {
	_init: function(){
		this.create_mesh();
		client.soundFX.play("laser_fire_1", true);
	},
	
	_update: function(){
		var mesh = this.mesh;
		var pos = this.body.GetPosition();
		
		//transfer body physics position & rotation to graphic mesh position
		mesh.position.set(pos.x*en.scale, pos.y*en.scale, 0);
		mesh.rotation.z = this.body.GetAngle();
		
		if(this.range < 10)
			mesh.material.opacity = this.range/10;
	},
	
	create_mesh: function(){
		//create graphics mesh
		
		var material = en.resources.get("material", this.materials.projectile),
			geometry = new THREE.PlaneGeometry(this.material_size.x, this.material_size.y);
	   
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
		
		//add mesh to a THREE.object3d object
		client.stage.layers.projectiles.add(this.mesh);
		
	},
	
	_hit: function(body, contact){
		var man = new Box2D.Collision.b2WorldManifold();
		contact.GetWorldManifold(man);
		
		var collision_point = man.m_points[0],
			proj_vel = body.GetLinearVelocity(),
			proj_pos = body.GetPosition();
		
		
		
		client.effects.play("BulletHit", 10, {
			angle: 0,//Math.atan2(proj_pos.y-collision_point.y,proj_pos.x-collision_point.x),
			angle_rand: Math.PI*2,
			velocity: 7,
			radius: 1,
			velocity_rand: 5,
			position: {
				x: collision_point.x*64,
				y: collision_point.y*64,
			},
			initVelocity: {
				x: proj_vel.x/4,
				y: proj_vel.y/4,
			},
		});
		
		//console.log();
	},
	
	_destroy: function(){
		//remove mesh from display
		client.stage.layers.projectiles.remove(this.mesh);
	},
	
};


en.extend(client.Projectile, en.Projectile);


/*Kinetic.Projectile = function(config){
	
	config = config || {};
	
	config.offset = {
		x: 25,
		y: 25
	};
	
	config.shieldTimeout = 0;
	
	config.drawFunc = function() {
		var canvas = this.getCanvas(),
			context = this.getContext();
		context.beginPath();
		
		this.attrs.x = this.velocity.x > 1 ? en.math.rnd(this.position.x) : this.position.x;
		this.attrs.y = this.velocity.y > 1 ? en.math.rnd(this.position.y) : this.position.y;

		if(this.range < 10){
			context.globalAlpha = this.range/10;
		}

		context.drawImage(en.resources.get("image", this.images.projectile).image, 0, 0, 50, 50, 0, 0, 50, 50);
		
		this.attrs.rotation = this.rotation + Math.PI/2;
		
		context.closePath();
	};
	
	en.Projectile.apply(this, [config]);
	Kinetic.Shape.apply(this, [config]);
};

Kinetic.Projectile.prototype = {
};

Kinetic.Global.extend(Kinetic.Projectile, Kinetic.Shape);
en.extend(Kinetic.Projectile, en.Projectile);
*/