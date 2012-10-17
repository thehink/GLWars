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
	client.player.init();
	client.stage.init();
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
	
	document.onkeydown = client.keyDownListener;
	document.onkeyup = client.keyUpListener;
};

client.initGame = function(playerID){
	client.player = en.getObject("", playerID);
};