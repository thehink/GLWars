en.resources.define("effect",{
	emitters: [
		{
			emitter: "BasicFire",
			update: function(frame){},
		},
		{
			emitter: "Smoke",
			update: function(frame){},
		}
	]
}, function(content, callback){
	callback(content.type, content);
}, function(content){
	return new client.particleEffect(content);
});