client.stage = {
	scene: null,
	camera: null,
	renderer: null,
	layers: {
		actors: new THREE.Object3D(),
		projectiles: new THREE.Object3D(),
		objects: new THREE.Object3D(),
		background: new THREE.Object3D(),
	},
	background: null,
	starmap: null,
	ParticleSystem: null,
	ParticleEffects: [],
};


client.stage.init = function(){
	client.width = $("#stage").width();
	client.height = $("#stage").height();
	
	var camera = this.camera = new THREE.PerspectiveCamera( 45, client.width / client.height, 1, 5000 );
	camera.position.z = 1700;

	var scene = this.scene = new THREE.Scene();
	
	var ambient = new THREE.AmbientLight( 0x573311);
		scene.add( ambient );

	var directionalLight = new THREE.DirectionalLight( 0xffeedd );
		directionalLight.position.set( 0, 0, 100 ).normalize();
	scene.add( directionalLight );
	
	
	var renderer = this.renderer = new THREE.WebGLRenderer();
	renderer.setClearColorHex( 0x000000, 1 );
	renderer.setSize( client.width, client.height );
	renderer.autoClear = false;
	
	for(var i in this.layers){
		 this.scene.add(this.layers[i]);
	};
	
	this.background = THREE.Background(5000, 5000);
	this.starmap = THREE.StarMap(5000, 5000);
	this.layers.background.add(this.background);
	this.layers.background.add(this.starmap);


	this.ParticleSystem = new client.ParticleSystem(client.stage.scene, {});

	//ps = new client.PE(client.stage.ParticleSystem, {});
	//ps2 = new client.PE(client.stage.ParticleSystem, {position: {x:0,y:0}});
	
	/*
	client.stage.starFlow = new client.ParticleEmitter(client.stage.scene, {
		particlesCount: 4096,
		texture: en.resources.get("texture", "particle.1"),
		size: 64,
		size_rand: 16,
		position: {
			x: 0,
			y: 0,
			z: -1500,
		},
		life: 20,
		life_rand: 0.2,
		radius: 10,
		area: {
			x: 5000,
			y: 5000,
			z: 100,
		},
		gravity: {
			x: 0,
			y: 0,
			z: 100,
		},
		velocity: 0,
		velocity_rand: 0,
		
		angle: Math.PI,
		angle_rand: Math.PI,
	});
	*/
	
	var el = document.getElementById("stage");
	el.appendChild(renderer.domElement);
	
	
	/***********************************
		Stats
	************************************/
	var stats = this.stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	stats.domElement.style.zIndex = 100;
	el.appendChild( stats.domElement );
	
	
	window.addEventListener( 'resize', client.stage.onResize, false );
	
	
	
	this.ParticleSystem.particlesNeedsUpdate = true;
};

shit = function(a){
	for(var i in en.stages.stages[0].objects.items){
		var obj = en.stages.stages[0].objects.items[i];
		if(obj.startThrust){
			if(a)
				obj.startThrust();
			else
				obj.stopThrust();
		}
	}
};

explode = function(a){
	for(var i in en.stages.stages[0].objects.items){
		var obj = en.stages.stages[0].objects.items[i];
		if(obj.explode)
			obj.explode();
	}
};

client.stage.addEffect = function(effect){								//add particle effect to pool
	this.ParticleEffects.push(effect);
};

client.stage.removeEffect = function(effect){							//remove particle effect from pool
	var i = this.ParticleEffects.indexOf(effect);
	if(i > -1){
		this.ParticleEffects.splice(i, 1);
	}
};

client.stage.render = function(){
	this.ParticleSystem.update();
	for(var i = 0, l = this.ParticleEffects.length; i < l; ++i){
		this.ParticleEffects[i].update();
	}
	client.effects.update();
	//client.stage.starFlow.update();
	this.renderer.render(this.scene, this.camera);
	this.stats.update();
};

client.stage.onResize = function(){
		client.width = $("#stage").width();
		client.height = $("#stage").height();

		client.stage.camera.aspect = client.width / client.height;
		client.stage.camera.updateProjectionMatrix();

		client.stage.renderer.setSize( client.width, client.height );
};


/*
client.stage.removeObject = function(obj){
	switch(obj.type){
		case "Spaceship":
		client.stage.layers.actors.remove(obj);
		break;
		case "Projectile":
		client.stage.layers.projectiles.remove(obj);
		break;
	}
};

client.stage.addObject = function(obj){
	switch(obj.type){
		case "Spaceship":
		client.stage.layers.actors.add(obj);
		break;
		case "Projectile":
		client.stage.layers.projectiles.add(obj);
		break;
	}
};
*/
client.stage.update = function(){
	this.render();
	var pl = client.player.get(),
	    cam = client.stage.camera;
	
	if(pl){
		cam.rotation.z  = pl.body.GetAngle() - Math.PI/2;
		
		var dx = Math.cos(cam.rotation.z),
			dy = Math.sin(cam.rotation.z);
		
		cam.position.x = pl.body.GetPosition().x* en.scale - 250 * dy;
		cam.position.y = pl.body.GetPosition().y* en.scale + 250 * dx;
	}else{
		cam.position.x = 0;
		cam.position.y = 0;
	}

};
