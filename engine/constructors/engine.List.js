en.List = function(){
	this.items = {};
	this.index = [];
	this.groups = {};
};

en.List.prototype = {
	add: function(group, id, item){
		if(!this.groups[group]) this.addGroup(group);
		this.items[id] = item;
		this.index.push(id);
		this.groups[group].push(id);
	},
	
	get: function(id){
		return this.items[id];
	},
	
	remove: function(id){
		var index = this.index.indexOf(id);
		if(index > -1){
			this.index.splice(index, 1);
			delete this.items[id];
		}
	},
	
	addToGroup: function(group, id){
		if(!this.groups[group]) this.addGroup(group);
		if(this.groups[group].indexOf(id) == -1)
		this.groups[group].push(id);
	},
	
	removeFromGroup: function(group, id){
		if(this.groups[group]){
			var index;
			if(index = this.index.indexOf(id)){
				this.groups[group].splice(index, 1);
			};
		}
	},
	
	addGroup: function(group){
		if(!this.groups[group])this.groups[group] = [];
	},
	
	getGroup: function(group){
		if(this.groups[group]){
			return this.groups[group];
		}else
		return [];
	},
	
	removeGroup: function(group){
		if(this.groups[group]){
			for(var i = 0, l = this.groups[group].length; i < l; ++i){
				this.remove(this.groups[group][i]);
			}
			delete this.groups[group];
		}
	},
	
};
