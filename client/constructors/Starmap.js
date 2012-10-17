THREE.StarMap = function(width, height){
	//	Stars
	
		var texture = en.resources.get("texture", "background.star"),
			RND = en.math.random2;
			
	// create the particle variables
		var particleCount = 5000;
		var particles = new THREE.Geometry();
		var pMaterial = new THREE.ParticleBasicMaterial({
			color: 0xFFFFFF,
			opacity:0.4,
			depthTest:false,
			blending: THREE.AdditiveBlending,
			transparent: true,
			map:texture,
			size: 25,
			});

	// now create the individual particles
		for(var p = 0; p < particleCount; p++) {
			var pX = RND(-width/2-1500,width/2+width),
				pY = RND(-height/2-1500,height/2+height),
				pZ = RND(-10,-1500),
				particle = new THREE.Vector3(pX, pY, pZ);
				
			particles.vertices.push(particle);
		}

	// create the particle system
		this.Star_system = new THREE.ParticleSystem(particles,pMaterial);

	// add it to the scene	
		return this.Star_system;
};

