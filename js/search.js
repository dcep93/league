var search;

//TODO 10 fuck it, show everything only at the end
//TODO 9 use strict everywhere

(function(){
search = function(){
	searchMask.apply(this, arguments);
}

//TODO 1 add killswitch
//TODO 2 enable functionality while processing
function searchMask(blueTeam, redTeam, picks, args){
	var currentTeam = blueTeam.concat(redTeam.map(function(i){ return i+args.numChamps }));
	searchHelper(currentTeam, picks, args, true, []);
	args.stop();
}

function searchHelper(currentTeam, picks, args, toHandle, shownResults){
	var userPick = (picks[0] === args.blueUser);
	var memory = userPick ? args.memory : 1;

	var teams = buildTeams(currentTeam, picks, args);

	if(picks.length === 0){
		var network = args.networks[currentTeam.length];
		results = multiScore(teams, network);

		for(var result of results){
			handle(result, shownResults, userPick, memory, toHandle, args);
		}

		return results;
	}
	else{
		var teamResults;
		// TODO 8 figure out wtf this is
		results = [];
		for(var team of teams){
			// TODO 7 handle 2nd tier if his turn then your turn
			teamResults = searchHelper(team, picks.slice(), args, false, shownResults);
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

//TODO 3 make it faster... (using binary search (starting from the end!!!))
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

function canPickChamp(i, team, pick, args) {
	if ((team.indexOf(i) === -1) && team.indexOf(i + args.numChamps) === -1) {
		if ((args.bans.indexOf(i) === -1) && (args.blueUser !== pick || args.selfBans.indexOf(i) === -1)) {
			return true;
		}
	}
	return false;
}

//TODO 4 dont build teams below the pruning cutoff
//TODO 5 if double, build double
//TODO 6 dont let same champ on both teams
function buildTeams(currentTeam, picks, args){
	var pick = picks.shift();

	var teams = [];

	if (pick === picks[0]) {
		picks.shift();
		var champ1;
		var champ2;
		for(var i=0;i<args.numChamps-1;i++){
			if (canPickChamp(i, currentTeam, pick, args)) {
				for(var j=i+1;j<args.numChamps;j++){
					if (canPickChamp(j, currentTeam, pick, args)) {
						champ1 = pick ? i : i + args.numChamps;
						champ2 = pick ? j : j + args.numChamps;
						teams.push(currentTeam.concat(champ1).concat(champ2));
					}
				}
			}
		}
	} else {
		var champ;
		for(var i=0;i<args.numChamps;i++){
			if (canPickChamp(i, currentTeam, pick, args)) {
				champ = pick ? i : i + args.numChamps;
				teams.push(currentTeam.concat(champ));
			}
		}
	}
	return teams;
}

// Array[Array[int]] teams array of sparce vectors
// Array[Array[Array[float]]] network (array of matrices)
// returns Array[Array[2 float[0,1]]] with same # of rows as teams array, 2 cols (score, popularity)
//TODO 0 make it work...
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
