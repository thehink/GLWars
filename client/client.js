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
	
	running: false,
};

client.init = function(){
	client.eventsInit();
	client.stage.init();
	client.network.init();
	//client.hud.deployment.show();
	
	client.setLogin();
	

	var stage = this.Stage = new en.Stage({
		name: "Main",
	});

	/*
	for(var i = 0; i < 20; ++i){
		stage.insertObject(new (en.getClass("Spaceship"))({maskBits:en.utils.vars.COLLISION_MASKS.ENEMY}));
	}
	*/

	en.addStage(stage);
	
	
	
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
	
	/*
	client.gui.login.hide();
	client.player.init();
	client.start();
	*/
	
	return false;
};

client.GameLoop = function(){
	en.onFrame();
	
	client.player.update();
	client.stage.update();

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

client.keyDownListener = function(ev){
	client.keys[ev.keyCode] = true;
};

client.keyUpListener = function(ev){
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