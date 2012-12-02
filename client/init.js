en.bind("resources/load", function(total, done){
	client.utils.resourceListener(total, done, client.init);
});
$(document).ready(function(e) {
	en.resources.load();
});

en.extend(client.Projectile, en.Projectile);
en.extend(client.Spaceship, en.Spaceship);
en.extend(client.Player, en.Player);
en.extend(client.Player, client.Spaceship);