var networks;

for(var game in games){
	networks[game] = {};
	for(var division in games[game].divisions){
		$.getJSON('../networks/'+game+'/'+division, function(json){
			networks[json.game][json.division] = json;
		});
	}
}