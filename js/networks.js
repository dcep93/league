var networks = {};

for(var game in games){
	networks[game] = {};
	for(var division in games[game].divisions){
		$.getJSON('networks/'+game+'/'+division+'.json', function(json){
			networks[json.game][json.division] = json;
		});
	}
}