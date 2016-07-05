//TODO
//add killswitch
//enable functionality while processing

function process(blueTeam, redTeam, picks, args){
	var currentTeam = blueTeam.concat(redTeam.map(function(i){ return i+args.numChamps }));

	var shownResults = [];

	processHelper(currentTeam, picks, shownResults, args);
}

function processHelper(currentTeam, picks, shownResults, args){
	var teams = buildTeams(currentTeam, picks[0], args);
	if(picks.length == 1){
		var network = args.networks[currentTeam.length];
		var results = multiScore(teams, network);
		for(var result of results){
			handle(result, shownResults, args);
		}
	}
	else{
		for(var team of teams){
			processHelper(team, picks.slice(1), shownResults, args);
		}
	}
}

function includeScore(score, shownResultScore, blueUser){
	var m = blueUser ? 1 : -1;
	return (score * m) > (shownResultScore * m);
}

//TODO
//make it faster...
function handle(result, shownResults, args){
	for(var i=0;i<shownResults.length;i++){
		if(includeScore(result.score, shownResults[i], args.blueUser)){
			shownResults.splice(i, 0, result.score);
			overflow = shownResults.length > args.memory;
			if(overflow){
				shownResults.pop();
			}
			showResultHelper(result, args, i, overflow);
			return;
		}
	}
	if(shownResults.length < args.memory){
		showResultHelper(result, args, shownResults.length, false);
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
	showResult({
		'blueTeam': blueTeam,
		'redTeam': redTeam,
		'score': result.score,
		'popularity': result.popularity
	}, index, overflow);
}

//TODO
//dont build teams below the pruning cutoff
//if double, build double
function buildTeams(currentTeam, pick, args){
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
//TODO
//make it work...
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
