en.Entity = function(options){

	
	en.Object.apply(this, [options]);
};

en.Entity.prototype = {
	destroy: function(){
		this.call("destroy", this);
	},
};