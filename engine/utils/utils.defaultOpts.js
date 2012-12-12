en.utils.defaultOpts = function(defaults, options){
	for(var i in options){
		if(typeof defaults[i] == "object"){
			defaults[i] = en.utils.defaultOpts(defaults[i], options[i]);
		}else
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