b2Vec2.prototype.getRotation = function(theta, x, y){
	var cs = Math.cos(theta),
		sn = Math.sin(theta);
		
		return {
			x:this.x + x * cs - y * sn,
			y:this.y + x * sn + y * cs,
		}
}
