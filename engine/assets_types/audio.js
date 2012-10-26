en.resources.define("audio",{
	name: "Engine",
	src: "./audio/ship_engine.ogg",
}, function(content, callback){
	var sound = client.audio.createSound();
	sound.load(content.src, function(sound){
		content.sound = sound;
		callback(content.type, content);
	});
}, function(content){
	return content.sound;
});