client.hud = {};

client.hud.progbar = function(id){
	this.id = '#'+id;
	this.value = 0;
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

client.hud.healthBar = new client.hud.progbar("health-bar");
client.hud.shieldBar = new client.hud.progbar("shield-bar");
client.hud.energyBar = new client.hud.progbar("energy-bar");


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
		
		var material = this.tempMaterials[cdata.material];
		
		var geometry = new THREE.PlaneGeometry(cdata.size*en.scale*2, cdata.size*en.scale*2);
		
		this.mesh_hull = new THREE.Mesh(geometry, material);
		
		this.spaceship.add(this.mesh_hull);
	},

	show: function(){
		$("#deployment").show();
		this.setTab(0);
		this.render();
	},
	
	setTab: function(tab){
		$("#deploy-menu > ul > li.active").removeClass("active");
		$("#deploy-menu > ul > li").eq(tab).addClass("active");
		
		return false; //return, not done below yet!
		
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
		
		var c = -1;
		
		for(var i in itemList){
			c++;
			var res = en.getRes(itemList[i]);
			
			if(clss && res.class != clss)
				continue;
			
			var material = en.resources.get("material", res.material);
			var imgsrc = material.map.image.src;
	
			var status = "";
	
			if(clss == "primary" || clss == "secondary" || clss == "special"){
				if(cdata[clss] == c){
					status = "selected";
				}else if(cdata.weapons_unlocked.indexOf(c) > -1){
					status = "available";
				}else if(cdata.level >= res.level){
					status = "buyable";
				}else{
					status = "locked";
				}
			}else{
				if(cdata.hull == c){
					status = "selected";
				}else if(cdata.hulls_unlocked.indexOf(c) > -1){
					status = "available";
				}else if(cdata.level >= res.level){
					status = "buyable";
				}else{
					status = "locked";
				}
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
		this.render();
	},
	
	render: function(){
		var cdata = client.player.data;
		this.mesh_hull.material = this.tempMaterials[cdata.material];
		this.mesh_hull.material.color.setHex(cdata.color);
		
		this.renderer.render(this.scene, this.camera);
	},
};