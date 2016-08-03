var loadTables;

(function(){

loadTables = function(){
	loadTablesMask.apply(this, arguments);
}

function loadTablesMask(games, tables, initialize){
	function doneLoadingGames(games){
		for(var game in games){
			if(games[game] === null){
				return false;
			}
		}
		return true;
	}
	for(var game in games){
		$.getJSON('tables/'+game+'/info.json', function(info){
			games[info.game] = info;

			if(doneLoadingGames(games)) {
				initialize();
			}

			tables[info.game] = {};
			for(var division in info.divisions){
				$.getJSON('tables/'+info.game+'/'+division+'.json', function(json){
					tables[json.game][json.division] = json;
				});
			}
		});
	}
}

})();