THREE.CreateMesh = function(material,x,y,z,size_x,size_y,angle){
		size_x = size_x || 1;
		size_y = size_y || 1;
		x = x || 0;	
		y = y || 0;	
		z = z || 0;	
		angle = angle || 0;

		var geometry = new THREE.PlaneGeometry(size_x, size_y),
			mesh = null;
	   
		//	Multi material
		if (typeof(material) == 'object' && (material instanceof Array)) mesh = THREE.SceneUtils.createMultiMaterialObject( geometry, material );
		else mesh = new THREE.Mesh(geometry, material);
		//mesh.rotation.x = Math.PI;
		mesh.rotation.z = angle;
		mesh.position.set(x, y, z);
		//mesh.overdraw = true;
		//mesh.castShadow = true;
		//mesh.receiveShadow = true;
		
		return mesh;
};