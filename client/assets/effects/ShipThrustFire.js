en.resources.add("effect", "ShipThrustFire", {
	emitters: [
		{
			emitter: "BoostFire",
			boosting: false,
			update: function(frame){
				if(this.effect.boosting){
					this.emitter.unPause();
					this.boosting = true;
				}
				else if(!this.effect.boosting){
					this.emitter.pause();
					this.boosting = false;
				}
			},
		},
		
		{
			emitter: "BasicFire",
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
	]
});