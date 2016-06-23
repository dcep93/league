var ALL_NETWORKS = {};

for(var game in games){
	ALL_NETWORKS[game] = {};
	for(var division in games[game].divisions){
		$.getJSON('networks/'+game+'/'+division+'.json', function(json){
			ALL_NETWORKS[json.game][json.division] = json;
		});
	}
}