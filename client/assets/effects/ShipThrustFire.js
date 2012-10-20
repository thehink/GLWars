en.resources.add("effect", "ShipThrustFire", {
	emitters: [
		{
			emitter: "BasicFire",
			update: function(frame){
				if(frame < 50){
					this.emitter.setVelocity(125 - (1.5*frame), 100 - (60/50)*frame);
					this.emitter.setAngle(this.emitter.angle, 0.15 - (0.05/50)*frame);
				}
			},
		},
		{
			emitter: "Smoke",
			update: function(frame){
				if(frame < 50){
					this.emitter.setVelocity(125 - (1.5*frame), 100 - (60/50)*frame);
					this.emitter.setAngle(this.emitter.angle, 0.15 - (0.05/50)*frame);
				}
			},
		},
		{
			emitter: "Test",
			update: function(frame){
			},
		},
	]
});