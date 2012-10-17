/***************
* Physics stuff
***************/
var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Body = Box2D.Dynamics.b2Body;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2World = Box2D.Dynamics.b2World;
var b2MassData = Box2D.Collision.Shapes.b2MassData;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;


/***************
* Engine
***************/
var en = {
	lastFrameTime: 0,
	multiplier: 1,
	utils: {},
	draw: typeof THREE == "object" ? true : false,
	scale: 32,
	
	options: {
		isServer: typeof module === 'undefined' ? false : true,
		fps: 60,
		spatialAreaSize: 64,
		debug: true,
	},
	
	
	log: function(name, msg2, msg3, msg4){
		if(en.options.debug){
			console.log(name+': ', msg2, msg3, msg4);
		}
	},

	stages: {
		num: 0,
		active: [],
		stages: {},
	},

	classes: {},
	getClass: function(name){
		if(en.classes[name]){
			return en.classes[name];
		}else if(en[name]){
			return en[name];
		}
	},
	
	setClass: function(name, constructor){
		en.classes[name] = constructor;
	},
	
	/* 
	*  Event Handlers
	*/
	
	extend: function(c1, c2) {
        for(var key in c2.prototype) {
            if(!( key in c1.prototype)) {
                c1.prototype[key] = c2.prototype[key];
            }
        }
    },
	
	events: [],
	bind: function(ev, func){
		en.events[ev] = func;
	},
	call: function(ev, arg1, arg2, arg3){
		if(typeof en.events[ev] === "function"){
			en.events[ev](arg1, arg2, arg3);
		}
	},
	
};

en.onFrame = function(){
	var timeNow = (new Date()).getTime(),
		timeDiff = timeNow-en.lastFrameTime,
		mult = 1000/timeDiff;
		en.lastFrameTime = timeNow;
		en.multiplier = en.options.fps / mult;

		for(var i = 0; i < en.stages.num; ++i){
			en.stages.stages[en.stages.active[i]].update(mult, timeDiff);
		}

		en.call("onFrame", mult);
};


/*
 * @ name: en.addStage
 * @ params: stage@en.Stage
 * @ description: Add a en.stage to the engine;
 */
en.addStage = function(stage){
	this.stages.stages[stage.id] = stage;
	this.stages.active.push(stage.id);
	this.stages.num++;
};
