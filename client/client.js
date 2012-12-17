var requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || 
		   window.webkitRequestAnimationFrame || 
		   window.mozRequestAnimationFrame || 
		   window.oRequestAnimationFrame || 
		   window.msRequestAnimationFrame ||
    function(callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();

var client = {
	player: {},
	width: 0,
	height: 0,	
	utils: {},
	keys: [],
	players: [],
	running: false,
};

client.init = function(){
	client.hud.init();

	//client.hud.stats.show();


	client.eventsInit();
	client.stage.init();
	client.network.init();

	

	var stage = this.Stage = new en.Stage({
		name: "Main",
	});

	stage.bind("objectInsert", client.addPlayer);
	stage.bind("kill", client.player_killed);

	//client.hud.deployment.show();
	//return false;
	
	client.setLogin();

	/*
	for(var i = 0; i < 20; ++i){
		stage.insertObject(new (en.getClass("Spaceship"))({maskBits:en.utils.vars.COLLISION_MASKS.ENEMY}));
	}
	*/

	en.addStage(stage);

	client.start();

	/*
	client.stage.init();
	client.player.init();
	client.start();
	*/
};

client.setLogin = function(){
	client.gui.login.show();
};

client.handleLoginButton = function(){
	var username = $("#username").val(),
		password = $("#password").val();
		
	client.network.login(username, password);
	
	return false;
};

client.addPlayer = function(player){
	if(player.type == "Player"){
		var i = client.players.indexOf(player);
		if(i == -1){
			client.players.push(player);
		}
	}
};

client.player_killed = function(data){
	var player1 = client.Stage.objects.get(data.by);
	var player2 = client.Stage.objects.get(data.id);
	
	client.hud.blog.append_kill(player1, player2, data.type);
};

client.setPlayers = function(data){
	var players = data.Player;
	var reset = data.reset;
	
	if(reset) client.players = [];
	
	for(var i in players){
		client.players.push(players[i]);
	}
};

client.GameLoop = function(){
	en.onFrame();
	
	client.player.update();
	client.stage.update();

	client.network.onFrame();

	if(client.running){
		requestAnimFrame(client.GameLoop);
	}
};

client.start = function(){
	client.running = true;
	client.GameLoop();
};

client.stop = function(){
	client.running = false;
};

client.keyListeners = [
	en.utils.vars.KEY.ARROW_UP,
	en.utils.vars.KEY.ARROW_DOWN,
	en.utils.vars.KEY.ARROW_RIGHT,
	en.utils.vars.KEY.ARROW_LEFT,
	en.utils.vars.KEY.X,
	en.utils.vars.KEY.SHIFT,
	en.utils.vars.KEY.CAPS,
	en.utils.vars.KEY.NUM1,
	en.utils.vars.KEY.NUM2,
	en.utils.vars.KEY.NUM3,
];

client.keyAboveChange = function(){
	client.player.keyChange();
};

client.keyDownListener = function(ev){
	if(!client.keys[ev.keyCode] && client.keyListeners.indexOf(ev.keyCode) > -1){
		client.keys[ev.keyCode] = true;
		client.keyAboveChange();
		ev.preventDefault(); 
	}else
	client.keys[ev.keyCode] = true;
	
};

client.keyUpListener = function(ev){
	if(client.keys[ev.keyCode] && client.keyListeners.indexOf(ev.keyCode) > -1){
		client.keys[ev.keyCode] = false;
		client.keyAboveChange();
		ev.preventDefault(); 
	}else
		client.keys[ev.keyCode] = false;
	
	
};

client.eventsInit = function(){
	en.setClass("Projectile", client.Projectile);
	en.setClass("Spaceship", client.Spaceship);
	en.setClass("Player", client.Player);

	$("#login-form").submit(client.handleLoginButton);
	
	document.onkeydown = client.keyDownListener;
	document.onkeyup = client.keyUpListener;
};

client.initGame = function(playerID){
	client.player = en.getObject("", playerID);
};