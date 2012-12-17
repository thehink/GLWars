client.player = {
	pl: null,
	lastWeapon: -1,
	data: {
		points: 421,
		level: 24,
		xp: 24,
		
		material: "spaceship_hull",
		
		color: 0x00A5FF,


		hull: 0,
		primary: 1,
		secondary: -1,
		special: -1,
		
		size: 2,
		
		unlocked_items: [
			0,1
		],
		
		weapon_spots: {
			primary: {
				weapon: en.res.weapon.PlasmaGun,
				spots: [
					{
						angle: 0.1,
						x: 2,
						y: 0.5,
					},
					{
						angle: -0.1,
						x: -2,
						y: 0.5,
					}
				],
			},
			
			secondary:{
				weapon: -1,
				spots: [
					{
						angle: 0,
						x: 0,
						y: 2,
					}
				],
			},
			
			special: {
				weapon: -1,
				spots: [],
			},
			
			bonus: {
				weapon: -1,
				spots: [],
			},
			
		},
		
	},
};

client.player.setData = function(playerData){
	this.data = {
		points: playerData.points,
		level: playerData.level,
		xp: playerData.xp,
		material: playerData.material,
		color: playerData.color,
		size: playerData.size,
		unlocked_items: [],
		primary: playerData.weapon_spots.primary.weapon,
		secondary: playerData.weapon_spots.secondary.weapon,
		special: playerData.weapon_spots.special.weapon,
		weapon_spots: playerData.weapon_spots,
	};
	
	for(var i in playerData.unlocked_items)
		this.data.unlocked_items.push(playerData.unlocked_items[i].id);
		
};

client.player.init = function(player){
	client.player.set(new (en.getClass("Player"))(player || {}));
};

client.player.deployMenu = function(){
	client.gui.login.hide();
	client.hud.deployment.show();
};

client.player.deploy = function(){
	var deployData = {
		color: client.player.data.color,
		hull: 1,
		weapons: [
			{
				weaponID: 1,
			}
		]
	}
	
	client.network.deploy(deployData);
};


client.player.onDeath = function(){
};

client.player.onDeploy = function(id){
	var player = client.Stage.objects.get(id);
	if(player){
		client.hud.deployment.hide();
		this.set(player);
		client.hud.show();
	}
};

client.player.set = function(Player){
	Player.bind("_explode", function(){
		client.hud.hide();
		setTimeout(client.hud.deployment.show, 2000);
	});
	
	this.pl = Player;
};

client.player.get = function(){
	return client.player.pl;
};

client.player.keyChange = function(){
	if(client.player.pl){
		this.pl.thrusting = client.keys[en.utils.vars.KEY.ARROW_UP] ? 1 : (client.keys[en.utils.vars.KEY.ARROW_DOWN] ?  2 : 0);	
		this.pl.turning_right = client.keys[en.utils.vars.KEY.ARROW_RIGHT] || false;
		this.pl.turning_left = client.keys[en.utils.vars.KEY.ARROW_LEFT] || false;
		this.pl.firing = client.keys[en.utils.vars.KEY.X] || false;
		this.pl.boosting = client.keys[en.utils.vars.KEY.SHIFT] || false;
		
		if(client.keys[en.utils.vars.KEY.NUM1])
			this.pl.setActiveWeapons(0);
		else if(client.keys[en.utils.vars.KEY.NUM2])
			this.pl.setActiveWeapons(1);
		else if(client.keys[en.utils.vars.KEY.NUM3])
			this.pl.setActiveWeapons(2);
				
		
		if(client.keys[en.utils.vars.KEY.CAPS])
			client.hud.stats.show();
		else
			client.hud.stats.hide();
		
		this.pl.setAwake();

		client.network.sendClientData(this.pl.getRT_data());
		
	};
};

client.player.update = function(){
	if(this.pl){
		client.hud.energyBar.set((0.5+ 100*this.pl.boostTimeleft/this.pl.boostTime | 0));
		client.hud.healthBar.set((0.5+ 100*this.pl.health/this.pl.maxHealth | 0));
		client.hud.shieldBar.set((0.5+ 100*this.pl.shields/this.pl.maxShields | 0));
		
		if(this.pl.weapon != this.lastWeapon){
			$("#weapons > .weapon-box.active").removeClass("active");
			$("#weapons > .weapon-box").eq(this.pl.weapon).addClass("active");
			this.lastWeapon = this.pl.weapon;
		}
		
	}
};