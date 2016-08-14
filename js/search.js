'use strict';

onmessage = search;

var memo;
var postFreq = 5;
var start_time = new Date();

function elapsed(){
	var end_time = new Date();
	return (end_time - start_time) / 1000;
}

function postMessageWrapper(data){
	data["memo"] = memo;
	data["elapsed"] = elapsed();
	postMessage(data);
}

function search(message){
	var data = message.data;
	var blueTeam = data.blueTeam;
	var redTeam = data.redTeam;
	var picks = data.picks;
	var args = data.args;
	var numChamps = args.numChamps;
	memo = data.memo;

	var currentTeam = blueTeam.concat(redTeam.map(function(i){ return i+numChamps }));

	var rawResults = searchHelper(currentTeam, picks, args, true);

	postMessageWrapper({"type": "results", "results": postResults(rawResults, numChamps), "data": data});
}

function postResults(rawResults, numChamps){
	var results = [];
	for(var result of rawResults){
		var blueTeam = [];
		var redTeam = [];
		for(var champ of result.team){
			if(champ < numChamps){
				blueTeam.push(champ);
			} else {
				redTeam.push(champ - numChamps);
			}
		}
		var result = {
			"blueTeam": blueTeam,
			"redTeam": redTeam,
			"score": result.score,
			"popularity": result.popularity
		}
		results.push(result);
	}
	return results;
}

function searchHelper(currentTeam, picks, args, original){
	var getMemo = memo[currentTeam];
	if(getMemo){
		return getMemo;
	}
	var userPick = (picks[0] === args.blueUser);
	var memory = userPick ? args.memory : 1;

	var teams = buildTeams(currentTeam, picks, args);

	var network = args.networks[currentTeam.length];
	var teamResults = multiScore(teams, network);

	teamResults.sort(function(a,b){ return (b.score - a.score) * (args.blueUser ? 1 : -1) });
	teamResults = teamResults.slice(0, Math.floor((1 - args.pruning/100) * teamResults.length));

	var results = [];

	var teamResult;
	for(var i=0;i<teamResults.length;i++){
		if(true){
		// if(original && (i % postFreq === 0)){
			postMessage({"type": "progress", "progress": [i, teamResults.length]});
		}
		teamResult = teamResults[i];
		if(picks.length === 0){
			handle(teamResult, results, userPick, memory, args);
		} else {
			var recursiveTeamResults = searchHelper(teamResult.team, picks.slice(), args, false);
			for(var result of recursiveTeamResults){
				handle(result, results, userPick, memory, args);
			}
		}
	}
	memo[currentTeam] = results;
	return results;
}

function betterScore(score, shownResultScore, blueUser){
	var m = blueUser ? 1 : -1;
	return (score * m) > (shownResultScore * m);
}

function handle(result, results, userPick, memory, args){
	if(results.length > 0){
		if(betterScore(result.score, results[results.length-1].score, args.blueUser)){
			var lower = 0;
			var upper = results.length-1;
			while(upper > lower){
				var mid = Math.floor((lower + upper) / 2);
				if(betterScore(result.score, results[mid].score, args.blueUser)){
					lower = mid+1;
				} else{
					upper = mid;
				}
			}
			results.splice(lower, 0, result);
			if(results.length > memory){
				results.pop();
			}
			return;
		}
	}
	if(results.length < memory){
		results.push(result)
	}
}

function canPickChamp(i, team, pick, args){
	if((team.indexOf(i) === -1) && team.indexOf(i + args.numChamps) === -1){
		if((args.bans.indexOf(i) === -1) && (args.blueUser !== pick || args.selfBans.indexOf(i) === -1)){
			return true;
		}
	}
	return false;
}

function buildTeams(currentTeam, picks, args){
	var pick = picks.shift();

	var teams = [];

	if(pick === picks[0]){
		picks.shift();
		var champ1;
		var champ2;
		for(var i=0;i<args.numChamps-1;i++){
			if(canPickChamp(i, currentTeam, pick, args)){
				for(var j=i+1;j<args.numChamps;j++){
					if(canPickChamp(j, currentTeam, pick, args)){
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
			if(canPickChamp(i, currentTeam, pick, args)){
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
// TODO 0 make it work...
function multiScore(teams, network){
	function random(compress){
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
