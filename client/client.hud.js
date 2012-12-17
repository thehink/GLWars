client.hud = {};

client.hud.progbar = function(id, width){
	this.id = '#'+id;
	this.value = 0;
	$(this.id).width(width || 200);
	
};

client.hud.progbar.prototype = {
	set: function(percent){
		this.value = percent <= 100 ? (percent > 0 ? percent : 0) : 100;
		$(this.id + ' > .completed-bar').width(this.value+"%");
		$(this.id + ' > .status-bar-text > .bar-value').text(this.value);
	},
	
	reset: function(){
		this.set(0);
	},
};

client.hud.show = function(){
	$("#hud").show();
};

client.hud.hide = function(){
	$("#hud").hide();
};

client.hud.init = function(){
	client.hud.healthBar = new client.hud.progbar("health-bar", 300);
	client.hud.shieldBar = new client.hud.progbar("shield-bar");
	client.hud.energyBar = new client.hud.progbar("energy-bar");
	client.hud.levelBar = new client.hud.progbar("level-bar", 300);
	
	client.hud.deployment.init();
};

client.hud.blog = {
	
	show: function(){
		$("#battle-log").show();
	},
	
	hide: function(){
		$("#battle-log").hide();
	},
	
	append_kill: function(player1, player2, type){
		
		var color1 = new THREE.Color(player1.color).getHexString(),
			color2 = new THREE.Color(player2.color).getHexString();
		
		var html = '<li>';
			html += '<span class="player" style="color:#'+color1+'">' + player1.username + '</span> <span class="killed">destroyed</span> ';
			html += '<span class="player" style="color:#'+color2+'"> ' + player2.username + '</span>';
			html += '</li>';
			
		$("#battle-log > ul").append(html);
		$("#battle-log").animate({ scrollTop: $("#battle-log > ul").height() }, 200);
		
	},
}


client.hud.stats = {
	showing: false,
	
	show: function(){
		if(!this.showing){
			$("#pl-stats").show();
			this.showing = true;
			this.update();
		}
	},
	
	update: function(){
		$("#pl-stats tbody").empty();
		
		for(var i in client.players){
			var player = client.players[i];
			
			var html = '<tr>';
				html += '<td>' + i + '</td>';
				html += '<td>' + player.username + '</td>';
				html += '<td>' + player.points + '</td>';
				html += '<td>' + player.level + '</td>';
				html += '<td>' + player.kills + '</td>';
				html += '<td>' + player.deaths + '</td>';
				html += '</tr>';
			
			$("#pl-stats tbody").append(html);
			
		}
		
	},
	
	hide: function(){
		if(this.showing){
			$("#pl-stats").hide();
			this.showing = false;
		}
	},
};

client.hud.deployment = {
	init: function(){
		$("#deploy-button").click(client.player.deploy);
		$("#deploy-menu > ul > li").click(function(){
			client.hud.deployment.setTab($(this).index());
		});
		
		this.loadImages();
		this.init_renderer();
		this.init_spaceship();
	},
	
	loadImages: function(){
		
		this.tempMaterials = {};
		
		var itemsLists = [
			en.res.spaceship,
			en.res.weapon
		];
		
		for(var i in itemsLists){
			for(var j in itemsLists[i]){
				var src = en.resources.get("material", en.getRes(itemsLists[i][j]).material).map.sourceFile;
				this.tempMaterials[en.getRes(itemsLists[i][j]).material] = new THREE.MeshLambertMaterial({
            		map: THREE.ImageUtils.loadTexture(src)
       		 	});
			}
		}

	},
	
	init_renderer: function(){
		var height = $("#main-display").height(),
			width  = $("#main-display").width();
		
		var camera = this.camera = new THREE.PerspectiveCamera( 45, width / height, 1, 5000 );
		camera.position.z = 400;
	
		var scene = this.scene = new THREE.Scene();
		
		var ambient = new THREE.AmbientLight( 0x573311);
			scene.add( ambient );
	
		var directionalLight = new THREE.DirectionalLight( 0xffeedd );
			directionalLight.position.set( 0, 0, 100 ).normalize();
		scene.add( directionalLight );
		
		this.spaceship = new THREE.Object3D();
		this.spaceship.rotation.z = Math.PI/2;
		scene.add(this.spaceship);
		
		var renderer = this.renderer = new THREE.WebGLRenderer();
		renderer.setClearColorHex( 0x000000, 1 );
		renderer.setSize(width, height);
		renderer.autoClear = false;
		
		var el = document.getElementById("main-display");
		el.appendChild(renderer.domElement);
	},
	
	init_spaceship: function(){
		var cdata = client.player.data;
		
		//var material = en.resources.get("material", cdata.material);
		
		var ship_material = this.tempMaterials[cdata.material],
			ship_geometry = new THREE.PlaneGeometry(cdata.size*en.scale*2, cdata.size*en.scale*2);
			
		this.mesh_hull = new THREE.Mesh(ship_geometry, ship_material);
		this.spaceship.add(this.mesh_hull);
		//this.render_weapons();
	},
	
	render_weapons: function(){
		var cdata = client.player.data;
		for(var i in cdata.weapon_spots){
			var spots = cdata.weapon_spots[i].spots;
			var weapon = en.getRes(cdata[i]);
			
			if(weapon){
				if(this['mesh_weapon_'+i])
					this.spaceship.remove(this['mesh_weapon_'+i]);
					
				this['mesh_weapon_'+i] = new THREE.Object3D();
				for(var j in spots){
					var weapon_material = this.tempMaterials[weapon.material],
						weapon_geometry = new THREE.PlaneGeometry(cdata.size*en.scale, cdata.size*en.scale),
						weapon_mesh = new THREE.Mesh(weapon_geometry, weapon_material),
						spot = spots[j];
						
					weapon_mesh.rotation.z = -spot.angle;
					weapon_mesh.position.x = spot.y * 40;
					weapon_mesh.position.y = spot.x * 40;
						
					this['mesh_weapon_'+i].add(weapon_mesh);
				}
				this.spaceship.add(this['mesh_weapon_'+i]);
			}
		}
	},

	show: function(){
		$("#deployment").show();
		this.setTab(0);
		this.render();
	},
	
	setTab: function(tab){
		$("#deploy-menu > ul > li.active").removeClass("active");
		$("#deploy-menu > ul > li").eq(tab).addClass("active");
		
		switch(tab){
			case 0:
				this.fillTab(en.res.spaceship);
			break;
			case 1:
				this.fillTab(en.res.weapon, "primary");
			break;
			case 2:
				this.fillTab(en.res.weapon, "secondary");
			break;
			case 3:
				this.fillTab(en.res.weapon, "special");
			break;
		}
	},
	
	fillTab: function(itemList, clss){
		$("#ship-items > ul").empty();
		
		var selected = 0;
		var cdata = client.player.data;
		
		for(var i in itemList){
			var c = itemList[i];
			var res = en.getRes(c);
			
			if(clss && res.class != clss)
				continue;
			
			var material = en.resources.get("material", res.material);
			var imgsrc = material.map.image.src;
	
			var status = "";

			if(cdata[clss] == c){
				status = "selected";
			}else if(cdata.hull == c){
				status = "selected";
			}else if(cdata.unlocked_items.indexOf(c) > -1){
				status = "available";
			}else if(cdata.level >= res.level){
				status = "buyable";
			}else{
				status = "locked";
			}

			var htmlc = '<li class="' + status + '">';
			
			htmlc += '<img src="'+imgsrc+'" />';
			htmlc += '<div>';
			
			switch(status){
				case "selected":
					htmlc += 'Selected';
				break;
				case "available":
					htmlc += 'Available';
				break;
				case "buyable":
					htmlc += '<span class="price">' + res.price + '</span> points';
				break;
				case "locked":
					htmlc += 'Level <span class="required_level">' + res.level + '</span> required';
				break;
			}
			
            htmlc += '</div>';
			
			htmlc += "</li>";
			
			$("#ship-items > ul").append(htmlc);
			
			$("#ship-items > ul > li").click(function(){
				client.hud.deployment.selectItem($(this).index());
			});
			
		}
	},
	
	selectItem: function(){
		this.render();
	},
	
	hide: function(){
		$("#deployment").hide();
	},
	
	color_changed: function(){
		this.mesh_hull.material.color.setHex(client.player.data.color);
		this.renderer.render(this.scene, this.camera);
		//this.render();
	},
	
	render: function(){
		var cdata = client.player.data;
		this.mesh_hull.material = this.tempMaterials[cdata.material];
		this.mesh_hull.material.color.setHex(cdata.color);
		this.render_weapons();
		
		this.renderer.render(this.scene, this.camera);
	},
};