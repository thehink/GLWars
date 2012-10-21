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
	camera.position.z = 1500;

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
	
	var stage = new en.Stage({
		name: "Main",
	});
	
	//stage.bind("object/insert", client.stage.addObject);
	//stage.bind("object/remove", client.stage.removeObject);
	
	client.player.set(new (en.getClass("Spaceship"))());
	stage.insertObject(client.player.get());
	en.addStage(stage);
	client.start();
	window.addEventListener( 'resize', client.stage.onResize, false );
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
	client.effects.update();
	this.ParticleSystem.update();
	for(var i = 0, l = this.ParticleEffects.length; i < l; ++i){
		this.ParticleEffects[i].update();
	}
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
	
	
	cam.position.x = pl.body.GetPosition().x*en.scale;
	cam.position.y = pl.body.GetPosition().y*en.scale;
	cam.rotation.z  = pl.body.GetAngle() - Math.PI/2;
	//pl.mesh.rotation.z = pl.body.GetAngle();
	
	
	
	/*
	var finalX = -client.player.get().position.x + client.width/2,
		finalY = -client.player.get().position.y + client.height/2;
		nowX = client.stage.stage.getX(),
		nowY = client.stage.stage.getY();
		
	var diffX = (finalX-nowX)/28,
	    diffY = (finalY-nowY)/28,
		panX = en.math.rnd(nowX+diffX),
		panY = en.math.rnd(nowY+diffY);
		
	//client.stage.stage.setX(panX);
	//client.stage.stage.setY(panY);
	if(panX !== nowX || panY !== nowY)
	client.stage.layers.actors.drawScene();
	
	if(client.stage.layers.projectiles.children.length > 0){
		client.stage.layers.projectiles.drawScene();
	}
	*/
};
