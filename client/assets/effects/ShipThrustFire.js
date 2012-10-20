en.resources.add("effect", "ShipThrustFire", {
	emitters: [
		{
			emitter: "BasicFire",
			update: function(frame){

			},
		},
		{
			emitter: "Smoke",
			update: function(frame){
				if(frame == 1)this.pNum = this.emitter.particles.length-1;
				if(frame < 30){
					var num = Math.ceil(this.pNum/15);
					this.emitter.removeParticles(num);
					//this.emitter.pause();
				}
			},
		}
	]
});