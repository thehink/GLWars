en.Base = function(options){
	this.id = 0;
	this.events = {};
	
	for(var i in options){
		this[i] = options[i];
	}
};

en.Base.prototype = {
	bind: function(ev, func){
		if(typeof func === "function")
			this.events[ev] = func;
	},
	call: function(ev, arg1, arg2, arg3){
		if(typeof this.events[ev] === "function"){
			return this.events[ev](arg1, arg2, arg3);
		}else if(typeof this['_'+ev] === "function"){
			return this['_'+ev](arg1, arg2, arg3);
		}
	},
};