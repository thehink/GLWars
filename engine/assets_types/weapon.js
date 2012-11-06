en.resources.define("weapon", {
		name: "default",
		type: "Weapon",
		class: "medium",
		firerate: 1000,
		recoil: 3,
		ammo: -1,
		clip: -1,
		projectile: "deafult",
}, function(content, callback){
	callback("weapon", content);
});