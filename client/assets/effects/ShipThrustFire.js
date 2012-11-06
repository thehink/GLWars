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
			boosting: false,
			update: function(frame){
				if(frame < 50 && !this.effect.boosting){
					this.emitter.setVelocity(125 - (1.5*frame), 100 - (60/50)*frame);
					this.emitter.setAngle(this.emitter.angle, 0.15 - (0.05/50)*frame);
				}
				
				if(!this.boosting && this.effect.boosting){
					this.emitter.setAngle(this.emitter.angle, 0.3);
					this.boosting = true;
				}
				else if(!this.effect.boosting && this.boosting){
					this.emitter.setAngle(this.emitter.angle, 0.1);
					this.boosting = false;
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