en.resources.define("audio",{
	name: "default_sound",
	src: "audio/default.waw",
}, function(name, content, callback){
	content.sound = new Audio();
    //audio.onload = isAppLoaded; // It doesn't works!
    content.sound.addEventListener('canplaythrough', function(){
		callback("audio", content);
	}, false);
    content.sound.src = content.src;
});