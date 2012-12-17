en.resources.define("weapon", {
		name: "PlasmaGun",
		material: "weapon_plasmagun",
		type: "Weapon",
		class: "primary",
		price: 500,
		level: 0,
		firerate: 150,
		recoil: 3,
		spread_angle: 0,
		ammo: -1,
		clip: -1,
		projectile: "deafult",
}, function(content, callback){
	callback("weapon", content);
});