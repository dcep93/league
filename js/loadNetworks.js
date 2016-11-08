'use strict';

var loadNetworks;

(function(){

loadNetworks = function(){
	loadNetworksMask.apply(this, arguments);
}

function loadNetworksMask(games, ALL_NETWORKS, initialize){
	function doneLoadingGames(games){
		for(var game in games){
			if(games[game] === null){
				return false;
			}
		}
		return true;
	}
	for(var game in games){
		$.getJSON((window.path_prefix || '') + 'networks/'+game+'/info.json', function(info){
			games[info.game] = info;

			if(doneLoadingGames(games)){
				initialize();
			}

			ALL_NETWORKS[info.game] = {};
			for(var division in info.divisions){
				$.getJSON((window.path_prefix || '') + 'networks/'+info.game+'/'+division+'.json', function(json){
					ALL_NETWORKS[json.game][json.division] = json;
				});
			}
		});
	}
}

})();
