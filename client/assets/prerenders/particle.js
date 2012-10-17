en.resources.add("prerender", "particle", {
	name: "particle",
	width: 128,
	height: 128,
	draw: function(canvas){
		var context = canvas.getContext("2d");
		context.beginPath();
		context.arc(64, 64, 60, 0, Math.PI*2, false);
		context.closePath();

		context.lineWidth = 0.5; //0.05
		context.stroke();
		context.restore();
		var gradient = context.createRadialGradient( canvas.width /2, canvas.height /2, 0, canvas.width /2, canvas.height /2, canvas.width /2 );

		gradient.addColorStop( 0, 'rgba(255,255,255,1)' );
		gradient.addColorStop( 0.2, 'rgba(255,255,255,1)' );
		//gradient.addColorStop( 0.6, 'rgba(200,200,200,1)' );
		gradient.addColorStop( 0.4, 'rgba(128,128,128,1)' );
		gradient.addColorStop( 1, 'rgba(0,0,0,1)' );

		context.fillStyle = gradient;

		context.fill();
		return canvas;
	},
});