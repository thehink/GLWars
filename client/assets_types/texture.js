en.resources.define("texture",{
	name: "default_projectile",
	src: "projectiles/default.png",
}, function(content, callback){
	content.image = THREE.ImageUtils.loadTexture(content.src,null,function(){
		callback("image", content);
	});
}, function(content){
	return content.image;
});