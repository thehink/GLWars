client.ParticleSystem = function(scene, opt){
	this.scene = scene;
	
	this.particles = [];
	this.numParticles = 256;
	this.realParticles = this.numParticles*this.numParticles;
	this.emitters = [];
	this.numEmitters = 0;
	
	this.allocated = [];
	this.not_allocated = [];
	
	this.texture = new THREE.Texture(en.resources.get("prerender", "particle"));
	this.texture = en.resources.get("texture", "particle.1");
	this.texture.needsUpdate = true;

	this.emitterTextureSize = 64; //power of 2 && > 16

	this.startPositions = new Float32Array(this.pxldata_array(this.numParticles*this.numParticles*4, 0)); 
	this.startVelocities = new Float32Array(this.pxldata_array(this.numParticles*this.numParticles*4, 0));
	
	this.textureStartPos = this.createTexture(this.numParticles, this.numParticles, this.startPositions);
	
	this.textureStartVel = new THREE.DataTexture(
	new Float32Array(this.startVelocities), this.numParticles, this.numParticles,
	THREE.RGBAFormat,
	THREE.FloatType,
	THREE.UVMapping,
	THREE.RepeatWrapping,
	THREE.RepeatWrapping,
	THREE.NearestFilter,
	THREE.NearestFilter);
	
	this.pEmitters = new Float32Array(this.pxldata_array(this.emitterTextureSize*this.emitterTextureSize*4, 0));
	this.pEmittersTexture = this.createTexture(this.emitterTextureSize, this.emitterTextureSize, this.pEmitters);

	this.pEmittersTexture.generateMipmaps = false;
	this.textureStartPos.generateMipmaps = false;
	this.textureStartVel.generateMipmaps = false;
	
	//this.textureStartPos.needsUpdate = true;
	//this.textureStartVel.needsUpdate = true;
	
	this.startTime = Date.now();
	this.time = {type: "f", value: 0};
	
	this.emittersNeedsUpdate = false;
	this.particlesNeedsUpdate = false;
	
	this.init();
};

client.ParticleSystem.prototype = {
	
	allocate_emitter: function(emitter){
		//256*256 size texture can contain 16384 emitters data, each emitters consist of 16 data points
		if(!emitter.allocated || this.emitters.length < (this.emitterTextureSize*this.emitterTextureSize)/16){
			emitter.id = this.emitters.push(emitter);
			this.setEmitterData(emitter);
			emitter.allocated = 1.0;
		}else if(emitter.allocated){
			console.log("Emitter is already allocated with id", emitter.id);
		}
	},
	
	deAllocateEmitter: function(emitter){
		var index = this.emitters.indexOf(emitter);
		if(index > -1){
			this.emitters.splice(index,1);
			emitter.allocated = 0.0;
		}
	},
	
	setEmitterData: function(emitter){
		var e = 64*64*4 - 256 + (emitter.id-1) * 16;

		//block 1
		this.pEmitters[ e ]      = emitter.position.x;
		this.pEmitters[ e + 1 ]  = emitter.position.y;
		this.pEmitters[ e + 2 ]  = emitter.velocity;
		this.pEmitters[ e + 3 ]  = emitter.velocity_rand;
		
		//block 2
		this.pEmitters[ e + 4 ]  = emitter.area.x;
		this.pEmitters[ e + 5 ]  = emitter.area.y;
		this.pEmitters[ e + 6 ]  = emitter.radius;
		this.pEmitters[ e + 7 ]  = emitter.texture;
		
		//block 3
		this.pEmitters[ e + 8 ]  = emitter.initVelocity.x;
		this.pEmitters[ e + 9 ]  = emitter.initVelocity.y;
		this.pEmitters[ e + 10 ] = emitter.angle;
		this.pEmitters[ e + 11 ] = emitter.angle_rand;
		
		//block 4
		this.pEmitters[ e + 12 ]  = emitter.gravity.x;
		this.pEmitters[ e + 13 ]  = emitter.gravity.y;
		this.pEmitters[ e + 14 ]  = emitter.lifespan;
		this.pEmitters[ e + 15 ]  = emitter.lifespan_rand;
		
		this.emittersNeedsUpdate = true;
	},
	
	allocate: function(emitter, numParticles){
		if(!emitter.allocated){
			console.log("you must allocate the emitter before you can allocate particles!");
			return false;
		}
		for(var i = 0; i < numParticles; ++i){
			var pID =  this.allocateParticle(emitter);
			if(pID)
				emitter.particles.push(pID);
		}
		this.particlesNeedsUpdate = true;
	},
	
	allocate_old: function(emitter){
		for(var i = 0; i < emitter.numParticles; ++i){
			var particle = {emitter:emitter};
			
			if(emitter.radius){
				var angl = Math.random() * 2 * Math.PI;
				particle.posX = en.math.random3(emitter.position.x, Math.cos(angl) * Math.random() * emitter.radius);
				particle.posY = en.math.random3(emitter.position.y, Math.sin(angl) * Math.random() * emitter.radius);
			}else{
				particle.posX = en.math.random3(emitter.position.x, emitter.area.x);
				particle.posY = en.math.random3(emitter.position.y, emitter.area.y);
			}
			
			var angle = en.math.random3(emitter.angle, emitter.angle_rand);
			particle.velX = Math.cos(angle)*en.math.random3(emitter.velocity, emitter.velocity_rand);
			particle.velY = Math.sin(angle)*en.math.random3(emitter.velocity, emitter.velocity_rand)
			
			particle.color = new THREE.Color(0xffffff);
			particle.color.setHSV(200/360, 80/100, 100/100);
			
			
			particle.size = en.math.random3(emitter.size, emitter.size_rand);
			particle.lifespan = en.math.random3(emitter.lifespan, emitter.lifespan_random, true);
			particle.allocated = 1.0;
			
			particle.startTime = i % particle.lifespan;
			
			
			var pID =  this.allocateParticle(particle);
			if(pID)
				emitter.particles.push(pID);
		}

		/*
		for(var i = 0; i < this.numParticles*this.numParticles; ++i){
			this.attributes.lifespan.value[ i ] = 100;
			this.attributes.size.value[ i ] = 100;
		}
		*/
		this.attributes.size.needsUpdate = true;
		this.attributes.lifespan.needsUpdate = true;
		this.attributes.customColor.needsUpdate = true;
	},
	
	allocateParticle_old: function(particle){
		if(this.not_allocated.length > 0){
			var p = this.not_allocated.pop();

			this.setParticleData(p, particle);

			this.allocated.push(p);
			return p;
		}
	},
	
	allocateParticle: function(emitter){
		if(this.not_allocated.length > 0){
			var p = this.not_allocated.pop();
			this.setParticleData(p, emitter);
			this.allocated.push(p);
			return p;
		}
	},
	
	setParticleData: function(p, emitter){
		this.startPositions[ p*4 ] 	   = emitter.id;
		this.startPositions[ p*4 + 1 ] = emitter.allocated;
		this.startPositions[ p*4 + 2 ] = emitter.particles.length;
		this.startPositions[ p*4 + 3 ] = (Math.random()*emitter.lifespan + 0.5) >> 0;
		
		var i = this.realParticles-p-1;
		
		this.attributes.lifespan.value[ i ] 	= emitter.lifespan;
		this.attributes.size.value[ i ] 		= en.math.random3(emitter.size, emitter.size_rand);
		this.attributes.customColor.value[ i ]  = emitter.color;
		this.attributes.toColor.value[ i ] 		= emitter.to_color;
		
		this.attributes.customColor.needsUpdate = true;
		this.attributes.toColor.needsUpdate = true;
		this.attributes.lifespan.needsUpdate = true;
		this.attributes.size.needsUpdate = true;
		//this.attributes.customColor.value[ this.realParticles-p-1 ] = d.color;
		
	},
	
	setParticleData_old: function(p, d){
		//this data is uploaded to the graphics card as texture every every ??nth frame
		// 4 float values per pixel
		this.startPositions[ p*4 ] 	   = d.posX;     	 //red channel, particle start x position
		this.startPositions[ p*4 + 1 ] = d.posY; 	 //green channel, particle start y position
		this.startPositions[ p*4 + 2 ] = d.startTime;					 //blue channel, particle start z position
		this.startPositions[ p*4 + 3 ] = 0.0;	 //alpha channel, particle lifespan // not used
		
		this.startVelocities[ p*4 ]     = d.velX;      	 //red channel, particle start x velocity
		this.startVelocities[ p*4 + 1 ] = d.velY; 	 //green channel, particle start y velocity
		this.startVelocities[ p*4 + 2 ] = d.lifespan;				 //blue channel, particle start z velocity 
		this.startVelocities[ p*4 + 3 ] = d.allocated; //alpha channel, particle is emitting/allocated if zero particle will no spawn again after dissapearing

		this.attributes.lifespan.value[ this.realParticles-p-1 ] = d.lifespan;
		this.attributes.size.value[ this.realParticles-p-1 ] = d.size;
		this.attributes.customColor.value[ this.realParticles-p-1 ] = d.color;
		
		//end of data
	},
	
	setParticleEmitPosition: function(emitter, x, y){
		this.startPositions[ pID*4 ] 	   = x;
		this.startPositions[ pID*4 + 1 ] = y;
	},
	
	setParticleStartVelocity: function(emitter, x, y){
		this.startVelocities[ pID*4 ] 	   = x;
		this.startVelocities[ pID*4 + 1 ]  = y;
	},

	deAllocateParticle: function(pID){
		var index = this.allocated.indexOf(pID);
		if(index > -1){
			this.startPositions[ pID*4 + 1] = 0.0;
			this.allocated.splice(index, 1);
			this.not_allocated.push(pID); // for now: push it to the beginning and hope it doesn't get allocated before it drops out of view
			this.particlesNeedsUpdate = true;
			//todo: push particle id back to not_allocated when completly died
			// some sort of time queue so the particles doesn't just disepear because they get allocated elsewhere.
		}
	},
	
	release: function(id){
		var index = this.allocated.indexOf(id);
		if(index > -1){
			this.allocated.splice(index, 1);
			this.not_allocated.push(id);
		}
	},
	
	update: function(){
		/*
		if(this.allocated.length > 0){
			var stage = client.stage;
			
			for(var i = 0; i < this.emitters.length; ++i){
				this.emitters[i].update();
			}
			
			stage.renderer.render(this.sceneRTTNewVel, this.camera, this.rtTextureVel, false);
			stage.renderer.render(this.sceneRTTNewPos, this.camera, this.rtTexturePos, false);
		}
		
		*/
		var stage = client.stage;

		this.time.value = ((Date.now()-this.startTime) / 100) % 10000;
		this.time.needsUpdate == true;
		
		if(this.emittersNeedsUpdate){
			this.updateTexture(this.pEmittersTexture, this.emitterTextureSize, this.emitterTextureSize, this.pEmitters);
			this.emittersNeedsUpdate = false;
		}
		
		if(this.particlesNeedsUpdate){
			this.updateTexture(this.textureStartPos, this.numParticles, this.numParticles, this.startPositions);
			this.particlesNeedsUpdate = false;
		}
		
		/*
		if(this.textureStartPos.__webglTexture){
			this.updateTexture(this.textureStartPos, this.numParticles, this.numParticles, this.startPositions);
			this.updateTexture(this.textureStartVel, this.numParticles, this.numParticles, this.startVelocities);
		}
		*/
		//this.textureStartPos = this.createTextureFromData2(this.numParticles, this.numParticles, this.startPositions);
		//this.textureStartVel = this.createTextureFromData2(this.numParticles, this.numParticles, this.startVelocities);
		stage.renderer.render(this.sceneRTTNewVel, this.camera, this.rtTextureVel, false);
		stage.renderer.render(this.sceneRTTNewPos, this.camera, this.rtTexturePos, false);
	},
	
	init: function(){
		var camera = this.camera = new THREE.Camera();
		camera.projectionMatrix.makeOrthographic(client.width / - 2, client.width / 2, client.height / 2, client.height / - 2, -10000, 10000);
		camera.position.z = 0;
		
		var sceneRTTVel = this.sceneRTTVel = new THREE.Scene();
		var sceneRTTPos = this.sceneRTTPos = new THREE.Scene();
		var sceneRTTNewPos = this.sceneRTTNewPos = new THREE.Scene();
		var sceneRTTNewVel = this.sceneRTTNewVel = new THREE.Scene();	
		
		var numParticles = this.numParticles;
		
		var generatedTextureVel = this.generateTextureVel();
		var rtTextureVel = this.rtTextureVel = new THREE.WebGLRenderTarget(numParticles, numParticles, {wrapS:THREE.RepeatWrapping,wrapT:THREE.RepeatWrapping, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat,type:THREE.FloatType });
	
		var generatedTexturePos = this.generateTexturePos();
		var rtTexturePos = this.rtTexturePos = rtTextureVel.clone();

		var materialVel = new THREE.ShaderMaterial({
			uniforms: {
				tDiffuse: { type: "t", value: generatedTextureVel }
			},
			vertexShader: document.getElementById('vertexShader').textContent,
			fragmentShader: document.getElementById('fragment_shader_pass_1').textContent
		});
		
		var materialPos = new THREE.ShaderMaterial({
			uniforms: {
				tDiffuse: { type: "t", value: generatedTexturePos }
			},
			
			vertexShader: document.getElementById('vertexShader').textContent,
			fragmentShader: document.getElementById('fragment_shader_pass_1').textContent
	
		});
		
		this.materialNewVel = new THREE.ShaderMaterial({
			uniforms: {
						tVel: { type: "t", value: this.rtTextureVel },
						tPos: { type: "t", value: this.rtTexturePos },
						tSPos:{ type: "t", value: this.textureStartPos },
						emitters:{ type: "t", value: this.pEmittersTexture },
						time: this.time
			},

			vertexShader: document.getElementById('vertexShaderPosVel').textContent,
			fragmentShader: document.getElementById('fragment_vel').textContent
		});
	
		this.materialNewPos = new THREE.ShaderMaterial({
			uniforms: {
						tVel: { type: "t", value: this.rtTextureVel },
						tPos: { type: "t", value: this.rtTexturePos },
						tSPos:{ type: "t", value: this.textureStartPos },
						emitters:{ type: "t", value: this.pEmittersTexture },
						time: this.time
			},
			
			vertexShader: document.getElementById('vertexShaderPosVel').textContent,
			fragmentShader: document.getElementById('fragment_pos').textContent,
			
		});

		var plane = new THREE.PlaneGeometry(client.width, client.height);
		 
		var quad = new THREE.Mesh(plane, materialVel);
		sceneRTTVel.add(quad);
	
		quad = new THREE.Mesh(plane, materialPos);
		sceneRTTPos.add(quad);
	
		quad = new THREE.Mesh(plane, this.materialNewVel);
		sceneRTTNewVel.add(quad);

		quad = new THREE.Mesh(plane, this.materialNewPos);
		sceneRTTNewPos.add(quad);
		
		var attributes = this.attributes = {
			size: 		  { type: 'f', value: [] },
			customColor:  { type: 'c', value: [] },
			toColor:  { type: 'c', value: [] },
			aPoints: 	  { type: 'v2', value: [new THREE.Vector2()] },
			lifespan:     { type: "f", value: []},
		};
		
		var uniforms = this.uniforms = {
			amplitude: 		{ type: "f", value: 1.0 },
			color:     		{ type: "c", value: new THREE.Color(0xffffff) },
			container: 		{ type: "v3", value: new THREE.Vector3(5000.0, 5000.0, 1.0) },
			texture:        { type: "t", value: this.rtTexturePos},
			tVel: 			{ type: "t", value: this.rtTextureVel },
			texture_point:  { type: "t", value: this.texture }
			
		};
		
		var shaderMaterial = new THREE.ShaderMaterial({

			uniforms:         uniforms,
			attributes:     attributes,
			vertexShader:   document.getElementById('vertexshaderP').textContent,
			fragmentShader: document.getElementById('fragmentshaderP').textContent,
			blending:         THREE.AdditiveBlending,
			depthTest:         false,
			transparent:    true
	
		});
		
		var geometry = new THREE.Geometry();
		
		for (var i = 0; i < numParticles * numParticles; i++) {
        	geometry.vertices.push(new THREE.Vector3());
    	}
		
		this.system = new THREE.ParticleSystem(geometry, shaderMaterial);
		this.system.dynamic = true;
		
		var vertices = this.system.geometry.vertices;
		var values_size = this.attributes.size.value;
		var values_color = this.attributes.customColor.value;
		var values_toColor = this.attributes.toColor.value;
		var values_lifespans = this.attributes.lifespan.value;
		
		var square = numParticles;
		
		for (var v = 0; v < vertices.length; v++) {
			values_size[ v ] = 128;
			values_color[ v ] = new THREE.Color(0xffffff);
			values_color[ v ].setHSV(16/360, 80/100, 100/100);
			
			values_toColor[ v ] = new THREE.Color(0xffffff);
			values_toColor[ v ].setHSV(141/360, 100/100, 100/100);
			
			values_lifespans[ v ] = 1.0;
			
			this.not_allocated.push(v);
		}
		
		var particles = [], 
			d = 1 / square;
		for (var y = d / 2; y < 1; y += d) {
			for (var x = d / 2; x < 1; x += d) {
				particles.push(new THREE.Vector2(x, y));
			}
		}
		
		this.attributes.aPoints.value = particles;
		
		this.scene.add(this.system);
		
		client.stage.renderer.render(sceneRTTVel, this.camera, this.rtTextureVel, false);
    	client.stage.renderer.render(sceneRTTPos, this.camera, this.rtTexturePos, false);
	},
	
	pxldata_array: function(length, value){
		var arr = new Array();
		for(var i = 0; i < length; ++i){
			arr.push(value);
		}
		return arr;
	},
	
	generateTextureVel: function(){
		var n = this.numParticles * this.numParticles;

		var pix = [];
	
		for (var k = 0; k < n; k++) {
			pix.push(0.0,0.0,0.0,0.0);
		}
		
		return this.createTextureFromData(this.numParticles, this.numParticles, pix);
	},
	
	generateTexturePos: function(){
		var n = this.numParticles * this.numParticles,
			x = 0,
			y = 0;
			
		var pix = [];
	
		for (var k = 0; k < n; k++) {
			pix.push(0.0, 0.0,0.0,0.0);
		}
	
		return this.createTextureFromData(this.numParticles, this.numParticles, pix);//canvas;
	},
	
	createTexture: function(width, height, data){
		var gl = client.stage.renderer.getContext();

		if (!gl.getExtension("OES_texture_float")) {
			throw("Requires OES_texture_float extension");
		}
		texture = new THREE.Texture();
		texture.needsUpdate = false;
		texture.__webglTexture = gl.createTexture();
	
		gl.bindTexture(gl.TEXTURE_2D, texture.__webglTexture);
	
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.FLOAT, data);
	
		texture.__webglInit = false;
		texture.flipY  = true;

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.bindTexture(gl.TEXTURE_2D, null)
	
		return texture;
	},
	
	updateTexture: function(texture, width, height, data){
		var gl = client.stage.renderer.getContext();

		if (!gl.getExtension("OES_texture_float")) {
			throw("Requires OES_texture_float extension");
		}

		texture.needsUpdate = false;
		gl.bindTexture(gl.TEXTURE_2D, texture.__webglTexture);
	
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.FLOAT, data);
	
		texture.__webglInit = false;

		
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.bindTexture(gl.TEXTURE_2D, null)
	
		return texture;
	},
	
	createTextureFromData: function(width, height, data){
		var gl = client.stage.renderer.getContext();

		if (!gl.getExtension("OES_texture_float")) {
			throw("Requires OES_texture_float extension");
		}
		texture = new THREE.Texture();
		texture.needsUpdate = false;
		texture.__webglTexture = gl.createTexture();
	
		gl.bindTexture(gl.TEXTURE_2D, texture.__webglTexture);
	
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.FLOAT, new Float32Array(data));
	
		texture.__webglInit = false;

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, null)
	
		return texture;
	},
};