function loadNetworks(games, ALL_NETWORKS, initialize){
	for(var game in games){
		$.getJSON('networks/'+game+'/info.json', function(info){
			games[info.game] = info;

			if(doneLoadingGames(games)) {
				initialize();
			}

			ALL_NETWORKS[info.game] = {};
			for(var division in info.divisions){
				$.getJSON('networks/'+info.game+'/'+division+'.json', function(json){
					ALL_NETWORKS[json.game][json.division] = json;
				});
			}
		});
	}
}

function doneLoadingGames(games){
	for(var game in games){
		if(games[game] === null){
			return false;
		}
	}
	return true;
}