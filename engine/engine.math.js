en.math = {};

en.math.vector2 = function(x, y){
	this.x = x || 0;
	this.y = y || 0;
	
	this.length = 0;
	this.direction = 0;
	this.normal = {
		x: 0,
		y: 0,
	};
	this.update();
};

en.math.vector2.prototype = {
	update: function(){
		this.normalize();
	},
	
	set: function(x, y){
		this.x = x;
		this.y = y;
	},
	
	add: function(vector2){
		this.x += vector2.x;
		this.y += vector2.y;
	},
	
	sub: function(vector2){
		this.x -= vector2.x;
		this.y -= vector2.y;
	},
	
	divide: function(vector2){
		this.x /= vector2.x;
		this.y /= vector2.y;
	},
	
	mult: function(vector2){
		this.x *= vector2.x;
		this.y *= vector2.y;
	},
	
	dot: function(vector2){
		return (this.x*vector2.x + this.y*vector2.y);
	},
	
	setRotation: function(rad){
		this.x =  Math.sin(rad)*this.length;
		this.y =  Math.cos(rad)*this.length;
		this.direction = rad;
	},
	
	setLength: function(length){
		this.x = this.normal.x * length;
		this.y = this.normal.y * length;
		this.length = length;
	},
	
	getLength: function(){
		return this.length;
	},
	
	normalize: function(){
		this.length = Math.sqrt(this.x*this.x + this.y*this.y);
		this.normal.x = this.x/this.length;
		this.normal.y = this.y/this.length;
	},
	
};

en.math.rnd = function(rnd){
	return (0.5+rnd) >> 0;
};

en.math.random = function(value, rand){
	return value -rand + Math.random()*(rand*2+1) >> 0;
};

en.math.random2 = function(min, max) {
   var randVal = min+(Math.random()*(max-min));
   return randVal;
}

en.math.random3 = function(val, rnd, round) {
   var randVal = val - rnd + Math.random() * 2 * rnd;
   return round ? (0.5+randVal) >> 0 : randVal;
}
