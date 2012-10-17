client.ParticleEmitter = function(scene, opt){
	this.scene = scene;

	this.texture = opt.texture || new THREE.Texture(en.resources.get("prerender", "particle"));
	this.texture.needsUpdate = true;
	
	this.shaderMaterial = this.shader();
	
	this.particlesCount = opt.particlesCount || 1000;
	this.particleRate = 10;
	
	this.radius = opt.radius || 10;
	this.area = opt.area;
	
	this.angle = opt.angle || Math.PI;
	this.angle_rand = opt.angle_rand || Math.PI/2;
	
	this.position = opt.position || {
		x: 0,
		y: 0,
		z: 0,
	};
	
	this.gravity = opt.gravity || {
		x: 0,
		y: 0,
		z: 0,
	};
	
	this.size = opt.size || 128;
	this.size_rand = opt.size_rand || 16;
	
	this.velocity = opt.velocity || 0;
	this.velocity_rand = opt.velocity_rand || 0;
	
	this.lifespan = opt.life || 10;
	this.lifespan_rand = opt.life_rand || 2;
	
	this.color = 0xffffff;
	this.startTime = Date.now();
	this.newPos = false;
	
	
	this.init();
	
};


client.ParticleEmitter.prototype = {
	
	init: function(){
		var particles = new THREE.Geometry();
		this.system = new THREE.ParticleSystem( particles, this.shaderMaterial );
		
		//var vertices = this.system.geometry.vertices;
		var values_size = this.attributes.size.value;
		var values_color = this.attributes.ca.value;
		var values_velocity = this.attributes.velocity.value;
		var values_life = this.attributes.life.value;
		var values_start = this.attributes.start.value;

		for(var i = 0; i < this.particlesCount; ++i){
			var angle = en.math.random3(this.angle, this.angle_rand),
				x = 0,
				y = 0,
				z = 0;
			
			
			if(this.area){
				x = en.math.random3(0, this.area.x);
				y = en.math.random3(0, this.area.y);
				z = en.math.random3(0, this.area.z);
			}else{
				var angl = Math.random() * 2 * Math.PI;
				x = Math.cos(angl) * Math.random() * radius;
				y = Math.sin(angl) * Math.random() * radius;
				z = Math.sin(angl) * Math.random() * radius;
			}
			
			particles.vertices.push(new THREE.Vector3(x, y, z));
			values_size[ i ] = en.math.random3(this.size, this.size_rand);
			
			
			values_velocity[ i ] = new THREE.Vector3(
				Math.cos(angle)*en.math.random3(this.velocity, this.velocity_rand)*100/values_size[ i ],
				Math.sin(angle)*en.math.random3(this.velocity, this.velocity_rand)*100/values_size[ i ],
				this.gravity.z);
			
			values_life[ i ] = en.math.random3(this.lifespan, this.lifespan_rand);
			values_start[ i ] = i % values_life[ i ];
			values_color[ i ] = new THREE.Color( 0xffffff );
			values_color[ i ].setHSV(193/360, 70/100, 100/100);
			//Number.POSITIVE_INFINITY
			//particles.vertices[i].set(2,5, 0);
		}
		
		this.system.geometry.__dirtyVertices = true;
		this.system.geometry.__dirtyColors = true;

		
		this.scene.add(this.system);
	},
	
	update: function(){
		this.uniforms.time.value = (Date.now()-this.startTime) / 100;
		this.uniforms.time.needsUpdate = true;
		
	},
	
	start: function(){
		this.uniforms.active.value = true;
	},
	
	stop: function(){
		this.uniforms.active.value = false;
	},
	
	remove: function(){
		this.scene.remove(this.system);
	},
	
	setPosition: function(x, y){
		if(x){
			this.position.x = x;
			this.uniforms.emitPosition.value.x = x;
			this.uniforms.emitPosition.needsUpdate = true;
		}
		if(y){
			this.position.y = y;
			this.uniforms.emitPosition.value.y = y;
			this.uniforms.emitPosition.needsUpdate = true;
		}
	},
	
	setVelocity: function(x, y, rx, ry){
		
	},
	
	setAngle: function(r){
		
	},
	
	shader: function(){
		this.attributes  = {
			size: {	type: 'f', value: [] },
			life: { type: 'f', value: [] },
			start: { type: 'f', value: [] },
			ca: { type: 'c', value: [] },
			ce: { type: 'c', value: [] },
			velocity: { type: 'v3', value: [] },
		};
		
		this.uniforms = {
			amplitude: { type: "f", value: 1.0 },
			color:     { type: "c", value: new THREE.Color( 0xffffff ) },
			texture:   { type: "t", value: this.texture},
			time: { type: 'f', value: 1.0 },
			active: { type: 'i', value: true },
			gravity: {type: 'v3', value: new THREE.Vector3(0, 0, 0)},
			emitPosition: {type: 'v3', value: new THREE.Vector3(0, 0, 0)},
		};
		
		return new THREE.ShaderMaterial( {
					uniforms: 		this.uniforms,
					attributes:     this.attributes,
					vertexShader:   document.getElementById( 'vertexshader' ).textContent,
					fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
					blending: 		THREE.AdditiveBlending,
					depthTest: 		false,
					transparent:	true
	})},
	
};
