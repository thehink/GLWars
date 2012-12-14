/*
*		Effects - test
*		
*
*/

client.effects = {
	effects: [],
	pool: {},
	playing: [],
	queue: [],
	frame: 0,
};

client.effects.play = function(effectName, time, options){
	var effect = this.getEffect(effectName);
	effect._playingTime = time;
	effect._effectName = effectName;
	effect.setOptions(options);
	
	effect.stopQueue = false;
	
	if(!effect.needsAllocation){
		effect.init();
		effect.restart();
		this.playing.push(effect);
	}else{
		this.queue.push(effect);
	}
	return effect;
};

client.effects.stop = function(effect){
	var i = this.playing.indexOf(effect);
	effect.stopQueue = true;
	
	if(i > -1){
		effect.pause();
		this.playing.splice(i, 1);					    //delete from playing
		if(!this.pool[effect._effectName])this.pool[effect._effectName] = [];
		this.pool[effect._effectName].push(effect);		//back to pool so it can be reused
	}
};

client.effects.getEffect = function(effect){
	if(this.pool[effect] && this.pool[effect].length > 0){
		return this.pool[effect].pop();
	}else{
		return en.resources.get("effect", effect);
	}
};

client.effects.runQueue = function(){
	
};

client.effects.update = function(){
	this.frame = (this.frame + 1) % 60;
	
	for(var i = 0; i < this.queue.length; ++i){
		var effect = this.queue.pop();
		effect.init();
		effect.restart();
		this.playing.push(effect);
	}

	for(var i = 0; i < this.playing.length; ++i){
		var effect = this.playing[i];
		if(--effect._playingTime == 0 || effect.stopQueue){
			client.effects.stop(effect);
		}
	}
};