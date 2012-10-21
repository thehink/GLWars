/*
*		Effects - test
*		
*
*/

client.effects = {
	effects: [],
	pool: {},
	playing: [],
};

client.effects.play = function(effectName, time, options){
	var effect = this.getEffect(effectName, options);
	effect._playingTime = time;
	effect._effectName = effectName;
	effect.setOptions(options);
	effect.init();
	effect.restart();
	this.playing.push(effect);
};

client.effects.stop = function(effect){
	var i = this.playing.indexOf(effect);
	if(i > -1){
		effect.pause();
		this.playing.splice(i, 1);					    //delete from playing
		if(!this.pool[effect._effectName])this.pool[effect._effectName] = [];
		this.pool[effect._effectName].push(effect);		//back to pool so it can be reused
	}
};


client.effects.getEffect = function(effect, options){
	if(this.pool[effect] && this.pool[effect].length > 0){
		return this.pool[effect].pop();
	}else{
		return en.resources.get("effect", effect);
	}
};

client.effects.update = function(){
	for(var i = 0; i < this.playing.length; ++i){
		var effect = this.playing[i];
		if(--effect._playingTime == 0){
			client.effects.stop(effect);
		}
	}
};