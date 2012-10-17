en.resources = {
	types: {},
	types_init: {},
	types_onGet: {},
	res: {},
	count: 0,
	loaded: 0,
	queue: [],
};

en.resources.define = function(type, content, init, get){
	if(!this.types[type])this.types[type] = {};
	this.types_init[type] = init;
	if(get)this.types_onGet[type] = get;
	this.types[type] = content;
};

en.resources.template = function(template, object){
	for(var i in template){
		if(template.hasOwnProperty(i) && !object[i]){
			object[i] = template[i];
		}
	}
	return object;
};

en.resources.add = function(type, name, content){
	if(en.resources.types[type] && !en.resources.res[type+name]){
		content.name = name;
		content.data_type = type;
		en.resources.count++;
		this.queue.push([type, content]);
	};
};

en.resources.load = function(){
	for(var i in this.queue){
		en.resources.types_init[this.queue[i][0]](this.queue[i][1], function(type, data){
			en.resources.loaded++;
			en.resources.res[data.data_type+data.name] = en.resources.template(en.resources.types[data.data_type], data);
			en.call("resources/load", en.resources.count, en.resources.loaded);
		});
	}
	this.queue = [];
};

en.resources.get = function(type, name){
	if(en.resources.res[type+name])
	return this.types_onGet[type] ? this.types_onGet[type](en.resources.res[type+name]) : en.resources.res[type+name];
};