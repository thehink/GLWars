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
		
		
		
		client.effects.play("BulletHit", 8, {
			angle_rand: Math.PI*2,
			radius: 1,
			position: {
				x: collision_point.x*en.scale*2,
				y: collision_point.y*en.scale*2,
			},
			initVelocity: {
				x: proj_vel.x/4,
				y: proj_vel.y/4,
			},
		});
		
		var pos = client.player.pl.body.GetPosition();
		
		var px = (collision_point.x - pos.x) / 18,
			py = (collision_point.y - pos.y) / 18;
		
		//var asd = new b2Vec2(0, 0).getRotation(client.player.pl.body.GetAngle(), px, py);

		
		var sound = en.resources.get("audio", "laser_impact_1").play();
		sound.node.panner.setPosition(px, py, 0);
		sound.node.panner.setOrientation(0.7,0.7,0, 1000, 1000, 0);
		
		
		//console.log();
	},
	
	_destroy: function(){
		//remove mesh from display
		client.stage.layers.projectiles.remove(this.mesh);
	},
	
};


en.extend(client.Projectile, en.Projectile);