var search;

(function(){
search = function(){
	searchMask.apply(this, arguments);
}

//TODO add killswitch
//TODO enable functionality while processing
function searchMask(blueTeam, redTeam, picks, args){
	var currentTeam = blueTeam.concat(redTeam.map(function(i){ return i+args.numChamps }));
	searchHelper(currentTeam, picks, args, true, []);
}

function searchHelper(currentTeam, picks, args, toHandle, shownResults){
	var userPick = (picks[0] == args.blueUser);
	var memory;
	if(userPick){
		memory = args.memory;
	}
	else{
		memory = 1;
	}

	var teams = buildTeams(currentTeam, picks, args);

	if(picks.length == 0){
		var network = args.networks[currentTeam.length];
		results = multiScore(teams, network);

		for(var result of results){
			handle(result, shownResults, userPick, memory, toHandle, args);
		}

		return results;
	}
	else{
		var rToHandle = userPick && toHandle;
		toHandle = toHandle && !rToHandle;
		var teamResults;
		results = [];
		for(var team of teams){
			teamResults = searchHelper(team, picks.slice(), args, rToHandle);
			for(var result of teamResults){
				handle(result, shownResults, userPick, memory, toHandle, args);
			}
		}
		return results;
	}
}

function includeScore(score, shownResultScore, blueUser){
	var m = blueUser ? 1 : -1;
	return (score * m) > (shownResultScore * m);
}

//TODO make it faster... (using binary search (starting from the end!!!))
function handle(result, shownResults, userPick, memory, toHandle, args){
	for(var i=0;i<shownResults.length;i++){
		if(includeScore(result.score, shownResults[i], args.blueUser)){
			shownResults.splice(i, 0, result.score);
			overflow = shownResults.length > memory;
			if(overflow){
				shownResults.pop();
			}
			if(toHandle){
				showResultHelper(result, args, i, overflow);
			}
			return;
		}
	}
	if(shownResults.length < memory){
		if(toHandle){
			showResultHelper(result, args, shownResults.length, false);
		}
		shownResults.push(result.score);
	}
}

function showResultHelper(result, args, index, overflow){
	var blueTeam = [];
	var redTeam = [];
	for(var champ of result.team){
		if(champ < args.numChamps){
			blueTeam.push(champ);
		}
		else{
			redTeam.push(champ-args.numChamps);
		}
	}
	args.showResult({
		'blueTeam': blueTeam,
		'redTeam': redTeam,
		'score': args.blueUser ? result.score : 1-result.score,
		'popularity': result.popularity
	}, index, overflow);
}

//TODO dont build teams below the pruning cutoff
//TODO if double, build double
function buildTeams(currentTeam, picks, args){
	var pick = picks.shift();
	var champ;

	var teams = [];
	for(var i=0;i<args.numChamps;i++){
		champ = pick ? i : i + args.numChamps;
		if (currentTeam.indexOf(champ) == -1){
			if (args.bans.indexOf(i) == -1 && (args.blueUser != pick || args.selfBans.indexOf(i) == -1)) {
				teams.push(currentTeam.concat(champ));
			}
		}
	}
	return teams;
}

// Array[Array[int]] teams array of sparce vectors
// Array[Array[Array[float]]] network (array of matrices)
// returns Array[Array[2 float[0,1]]] with same # of rows as teams array, 2 cols (score, popularity)
//TODO make it work...
function multiScore(teams, network){
	function random(compress) {
		var r = Math.random();
		if(compress){
			var n = 10;
			var x = (2 * r - 1) * Math.tanh(n);
			var t = Math.atanh(x) / n;
			return (t+1)/2;
		}
		else{
			return r;
		}
	}

	var results = [];
	for(var team of teams){
		results.push({
			'team': team,
			'score': random(true),
			'popularity': random(false)
		});
	}
	return results;
}
})();
