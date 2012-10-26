client.audio = new WebAudio();

client.soundFX = {
};

client.soundFX.play = function(name, vary){
	var sound = en.resources.get("audio", name),
		playing = sound.play();
		
		if(vary){
			playing.node.playbackRate.value = 0.5+Math.random()*1.;
		}
};