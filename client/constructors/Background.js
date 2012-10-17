function cRand(seed){
	this.seed = seed || Math.random() * 1251254;
	this.prime = 37;
	this.max = 15124223;
	this.constant = 1512412;
}

cRand.prototype.next = function(){
	this.seed *= this.constant;
	this.seed += this.prime;
	this.seed %= this.max;
	return this.seed >> 0; 
}

cRand.prototype.setSeed = function(seed){
	this.seed = seed;
}



THREE.Background = function(width, height){
		var obj = new THREE.Object3D();
		
		var seed = 523516456;
		var rnd = new cRand(523516456);
		
		var wall_left = THREE.CreateMesh(
			en.resources.get("material", "wall"),
			-width/2,0,0,30,height,0
		),
			wall_right = THREE.CreateMesh(
			en.resources.get("material", "wall"),
			width/2,0,0,30,height,0
		),
			wall_top = THREE.CreateMesh(
			en.resources.get("material", "wall"),
			0,-height/2,0,width,30,0
		),
			wall_bottom = THREE.CreateMesh(
			en.resources.get("material", "wall"),
			0,height/2,0,width,30,0
		);
		
		obj.add(wall_left);
		obj.add(wall_right);
		obj.add(wall_top);
		obj.add(wall_bottom);
		
		var space_objects = [];
		
		space_objects.push(
			new THREE.MeshLambertMaterial({color: 0xffffff,map: en.resources.get("texture", "galaxy.1"),depthTest:false,blending: THREE.AdditiveBlending,transparent: true,opacity: 1.0,size:1.0,}),
			new THREE.MeshLambertMaterial({color: 0xffffff,map: en.resources.get("texture", "galaxy.2"),depthTest:false,blending: THREE.AdditiveBlending,transparent: true,opacity: 1.0,size:1.0,}),
			new THREE.MeshLambertMaterial({color: 0xffffff,map: en.resources.get("texture", "nebula.1"),depthTest:false,blending: THREE.AdditiveBlending,transparent: true,opacity: 1.0,size:1.0,}),
			new THREE.MeshLambertMaterial({color: 0xffffff,map: en.resources.get("texture", "nebula.2"),depthTest:false,blending: THREE.AdditiveBlending,transparent: true,opacity: 1.0,size:1.0,}),
			new THREE.MeshLambertMaterial({color: 0xffffff,map: en.resources.get("texture", "planet.earth"),depthTest:false,blending: THREE.AdditiveBlending,transparent: true,opacity: 1.0,size:1.0,})
			);
		
		var l = space_objects.length;
		
		for(var i = 0; i < width; i+= 50){
			for(var j = 0; j < height; j+= 50){
				//rnd.setSeed(((seed + i + j) / 5) * 2 >> 0);
				

				if(rnd.next() % 427 == 0){
					var mat = space_objects[rnd.next() % l];
					var mesh = THREE.CreateMesh(mat,
						 -3500 + rnd.next() % 7000, -3500 + rnd.next() % 7000, -(rnd.next() % 1500), mat.map.image.width, mat.map.image.height, 0);
					
					
						
					obj.add(mesh);
				}
				
			}
		}
		
		/*
		var background = THREE.CreateMesh(
			en.resources.get("material", "background.main"),
			0,0,-800,width+4000,height+4000,0
		);
		
		var foreground = THREE.CreateMesh(
			en.resources.get("material", "background"),
			0,0,-400,width+4000,height+4000,0
		);
		*/
		
		
		//obj.add(background);
		//obj.add(foreground);
		
		return obj;
};