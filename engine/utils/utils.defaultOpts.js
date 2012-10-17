en.utils.defaultOpts = function(defaults, options){
	for(var i in options){
		defaults[i] = options[i];
	};
	return defaults;
};

en.utils.options = function(that, defaults, options){
	for(var i in defaults){
		if(options[i])
			that[i] = options[i];
		else
			that[i] = defaults[i];
	};
	return defaults;
};