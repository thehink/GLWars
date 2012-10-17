en.resources.define("material",{
	name: "default",
	color: 0xffffff,
	ambient: null,
	emissive: null,
	opacity: 1,
	size: 1,
	transparent: true,
	blending: THREE.AdditiveBlending,
	texture: "material/default",
	
}, function(content, callback){
	callback(content.type, content);
}, function(content){
	var options = {
			color: content.color,
			map: en.resources.get("texture", content.texture),
			//lightMap :texture,
			/*alphaTest:true,*/
			depthTest:false,
			//depthWrite :true,
			blending: content.blending,
			transparent: content.transparent,
			opacity: content.opacity,
			//refractionRatio:0.98,
			//reflectivity:0.9,
			//wireframe:true,
			//wireframeLinewidth:20,
			//vertex_colors: true, 
			//shading: THREE.FlatShading,
			size:content.size,
		};
		
		if(content.emissive)
			options.emissive = new THREE.Color(content.emissive);
		
		if(content.ambient)
			options.ambient = new THREE.Color(content.ambient);
	
	return new THREE.MeshLambertMaterial(options);
});