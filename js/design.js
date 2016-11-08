'use strict';

(function() {

var games = {
	'league': null,
}
var game = 'league';
var ALL_NETWORKS = {};
var pickOrder;
var searchWorker;

function initialize(){
	$('.picks').empty();
	pickOrder = [];

	var numPicks = games[game].order.length / 2;

	for(var i=0;i<numPicks;i++){
		$('<div class="pick blue-pick">').appendTo('#blue-team > .picks');
		$('<div class="pick red-pick">').appendTo('#red-team > .picks');
	}
	$('.pick').droppable({
		"drop": function(event, ui) {
			pickChamp(this, ui.draggable.attr('data-champ'));
		},
		"hoverClass": "pick-hover"
	});

	$("#champ-pool").empty()
		.append(buildSquare("../../shared/reset").click(reset))
		.append(buildSquare("../../shared/undo").click(undo));
	$("#splash-bank").empty();
	$('.bans').empty();

	for(var i=0;i<games[game].champs.length;i++){
		var champ = games[game].champs[i];
		buildSquare(champ).attr('data-champ', i).appendTo('#champ-pool').click(pick).draggable({ "revert": true, "revertDuration": 0, "helper": "clone" });
		buildSplash(champ).attr('data-champ', i).appendTo('#splash-bank');
		$('.bans').append(buildBan(champ, i));
	}

	$('#division').empty();
	for(var d in games[game].divisions){
		$("<option>").attr('value', d).text(games[game].divisions[d]).appendTo("#division");
	}
	

	$('.bans').multipleSelect({
		'placeholder': 'Select Champions',
		'selectAllDelimiter': [''],
		'minimumCountSelected': $(this).attr('data-minimum-count-selected')
	}).multipleSelect('uncheckAll');

	$('.single-multiple-select').multipleSelect({single: true});

	$('.slider').each(function(){
		var range = $(this).attr('data-range').split(',').map(Number);
		var modifier = $(this).attr('data-modifier') || "";
		$(this).slider({
			'min': range[0],
			'max': range[1],
			'value': range[0],
			'step': range[2]
		});
		if($(this).attr('data-start')){
			$(this).slider('value', $(this).attr('data-start'));
		}
		for(var i=range[0]; i <= range[1]; i += range[3]){
			$('<label class="slider-label">').text(i+modifier).css('left', (i-range[0])/(range[1]-range[0])*100 + '%').appendTo($(this));
		}
	});

	$('.game-time-benchmark').remove();

	for(var benchmarkKey in games[game].time_benchmarks){
		var benchmark = games[game].time_benchmarks[benchmarkKey];
		$('<tr>')
			.addClass('game-time-benchmark')
			.append($('<td>').text(benchmark["depth"]))
			.append($('<td>').text(benchmark["pruning_factor"]))
			.append($('<td>').text(benchmark["duration"]))
			.appendTo('#time-benchmarks-table');
	}

	$("#start").click(function() {start()});
	$("#stop").click(function() {stop()});
	$("#feedback").on('keyup', function (e) {
	    if (e.keyCode == 13) {
	        postFeedback($("#feedback").val())
	    }
	});

	animateChampPool();

	loadFromURL();
}

function animateChampPool(){
	$("#champ-pool-container").css("width", 0);
	setTimeout(function(){
		$("#champ-pool-container").css("width", "");
		var width = $("#champ-pool-container").css("width");
		$("#champ-pool").css({"width": width, "transform": "translateX(-50%)", "left": "50%", "position": "relative"});
		$("#champ-pool-container").css("width", 0).animate({"width": width}, 700, "swing", function(){
			$("#champ-pool").css({"width": "", "transform": "", "left": "", "position": ""});
		});
	}, 1000)
}

function buildSquare(champ){
	return $('<img class="champ">').attr("src", (window.path_prefix || '') + "images/" + game + "/square/" + champ + ".png");
}

function buildBan(champ, index){
	return $('<option>').text(' '+champ).attr('value', index);
}

function buildSplash(champ, i){
	return $('<img class="splash">').attr('src', (window.path_prefix || '') + "images/" + game + "/splash/" + champ + ".jpg");
}

function undo(){
	if(pickOrder.length > 0){
		pickOrder.pop().appendTo("#splash-bank");
		return true;
	}
	return false;
}

function reset(){
	while(undo()){}
	$("#bans").multipleSelect("uncheckAll");
	$("#self-bans").multipleSelect("uncheckAll");
}

function pick(){
	var champ = $(this).attr('data-champ');
	var indices = {
		true: 0,
		false: 0,
	}
	for(var index in games[game].order) {
		var teamBool = games[game].order[index];
		var pick = $(teamBool ? "#blue-team" : "#red-team").find('.picks > .pick').eq(indices[teamBool])
		if (pick.find('.splash').length == 0) {
			pickChamp(pick, champ);
			break;
		}
		indices[teamBool]++;
	}
}

function pickChamp(pick, champ){
	var splash = $('#splash-bank > .splash').filter('[data-champ="' + champ + '"]');
	if (splash.length === 1) {
		$(pick).append(splash);
		pickOrder.push(splash);
	}
}

function setMaxDepth(data) {
	data.args.depth = Math.min(data.args.depth, (data.args.order.length - data.blueTeam.length - data.redTeam.length));
	$("#depth").slider('value', data.args.depth);
}

function start(){

	var division = $('#division').val();
	var networks = ALL_NETWORKS[game][division].networks;

	var args = {
		'game': game,
		'blueUser': ($('#team').val() === "blue"),
		'bans': $("#bans").multipleSelect("getSelects").map(Number),
		'selfBans': $("#self-bans").multipleSelect("getSelects").map(Number),
		'depth': $("#depth").slider( "option", "value" ),
		'pruning': $("#pruning").slider( "option", "value" ),
		'division': division,
		'numChamps': games[game].champs.length,
		'order': games[game].order,
		'startTime': new Date()
	}

	var data = {
		"blueTeam": getTeam("#blue-team"),
		"redTeam": getTeam("#red-team"),
		"networks": networks,
		"args": args,
	}

	setMaxDepth(data);

	if(invalidGame(data)){
		return;
	}

	$("#results-container").empty();

	$("#stop").removeAttr("disabled");
	$("#start").attr("disabled",'');

	searchWorker = new Worker("js/search.js");
	searchWorker.onmessage = handleMessage;
	searchWorker.postMessage(data);
	updateURL(data);
	$("#results").show();
	console.log('start');
}

function stop(finished){
	$("#start").removeAttr("disabled");
	$("#stop").attr("disabled",'');
	if(!finished){
		searchWorker.terminate();
		$("#results").slideUp();
	}
	console.log('stop')
}

function invalidGame(data){
	var invalidMessages = [];
	for(var banKey in data.args.bans){
		var ban = data.args.bans[banKey];
		if(data.blueTeam.concat(data.redTeam).indexOf(parseInt(ban)) !== -1){
			invalidMessages.push(games[game].champs[ban] + ' is Banned!');
		}
	}
	for(var banKey in data.args.selfBans){
		var ban = data.args.bans[banKey];
		if((data.args.blueUser ? data.blueTeam : data.redTeam).indexOf(parseInt(ban)) !== -1){
			invalidMessages.push(games[game].champs[ban] + ' is Self-Banned!');
		}
	}
	if(data.args.numChamps - data.args.bans.length < games[game].order.length){
		invalidMessages.push('Too Many Bans!');
	}
	var unavailable = new Set((data.args.blueUser ? data.redTeam : data.blueTeam).concat(data.args.bans).concat(data.args.selfBans));
	if(data.args.numChamps - unavailable.size < games[game].order.length / 2){
		invalidMessages.push('Too Many Self-Bans!');
	}
	if(invalidMessages.length > 0){
		alert(invalidMessages.join('\n'));
		return invalidMessages;
	} else {
		return false;
	}
}

function showProgress(data){
	var remainingTime = (new Date() - data.startTime)*(data.progress[1] - data.progress[0])/data.progress[0]/1000;
	var progress = data.progress.join(' / ') + ' branches explored - ' + (remainingTime == Infinity ? 'unknown' : Math.round(remainingTime))+ ' seconds remaining'
	$('#progress').text(progress);
}

function handleMessage(message){
	var data = message.data;
	if(data.type === "progress"){
		showProgress(data);
	} else if(data.type === "results") {
		buildResults(data.results);
		updateURL(data.data, data.results);
		stop(true);
		// postToFirebase(data.data, data.results);
	} else if(data.type == "log") {
		console.log(data.message);
	} else{
		console.log("bad message:");
		console.log(message);
	}
}

function buildResults(results){
	$('#progress').empty();
	for(var resultKey in results){
		var result = results[resultKey];
		var teams = $('<div class="result-teams result-part">').append(buildResultTeam(result.blueTeam).addClass("blue-result")).append(buildResultTeam(result.redTeam).addClass("red-result"));
		var scores = $('<div class="result-scores result-part">').append(buildResultPercentage(result.score, 'Odds of Winning')).append(buildResultPercentage(result.popularity, 'Popularity'));
		$('<div class="result">').append(teams).append(scores).appendTo("#results-container");
	}
}

function buildResultTeam(indices){
	var team = $('<div class="result-team">');
	for(var indexKey in indices){
		buildSquare(games[game].champs[indices[indexKey]]).appendTo(team);
	}
	return team;
}

function buildResultPercentage(f, text){
	var percentage = (f*100).toFixed(2) + '%';
	return $('<div class="result-percentage">').text(text + ': ' + percentage);
}

function compress(o){
	var s = JSON.stringify(o);
	s = LZString.compressToEncodedURIComponent(s);
	return s;
}

function decompress(s){
	try{
		var s = LZString.decompressFromEncodedURIComponent(s);
		return JSON.parse(s);
	} catch(err){

	}
}

function loadFromURL(){
	var query_string = {};
	var query = window.location.search.substring(1).replace(/\/$/,'');
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
		query_string[pair[0]] = decodeURIComponent(pair[1]);
	}

	var params = decompress(query_string.params);
	var results = decompress(query_string.results);
	if(params){
		$('#team').val(params.args.blueUser ? "blue" : "red");
		$('#division').val(params.args.division);
		$("#pruning").slider('value', params.args.pruning);
		$("#depth").slider('value', params.args.depth);
		$("#bans").multipleSelect("setSelects", params.args.bans.map(String));
		$("#self-bans").multipleSelect("setSelects", params.args.selfBans.map(String));
		setTeam('#blue-team', params.blueTeam);
		setTeam('#red-team', params.redTeam);
	}
	if(results){
		$("#results").slideDown();
		buildResults(results);
	}
}

function getTeam(team){
	return $(team).find('.picks > .pick > .splash').toArray().map(function(e) {
		return Number($(e).attr('data-champ'));
	});
}

function setTeam(team, array){
	for(var i=0;i<array.length;i++){
		var champ = array[i];
		if (champ) {
			var pick = $(team).find('.picks > .pick').eq(i);
			pickChamp(pick, champ);
		}
	}
}

function updateURL(data, results){
	if (history.pushState) {
	    var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
	    var params = {"args": data.args, "blueTeam": data.blueTeam, "redTeam": data.redTeam};
	    newurl += "?params=" + encodeURIComponent(compress(params));
	    if(results){
	    	newurl += "&results=" + encodeURIComponent(compress(results));
	    }
	    window.history.pushState({path:newurl},'',newurl);
	}
}

function initializeFirebase(){
	var config = {
		databaseURL: "https://league-dcep93.firebaseio.com",
	};
	firebase.initializeApp(config);
}

function postFeedback(feedback){
	var path = '/feedback';
	firebase.database().ref(path).transaction(function(all_feedback){
		if(all_feedback === null) {
			all_feedback = [];
		}
		all_feedback.push(feedback);
		return all_feedback;
	}).then(function() {
		alert("Thank you, your feedback has been recorded");
	});
}

function postToFirebase(data, results){
	var path = [
		'/search-results',
		window.location.hostname.replace(/\./g,'-') ,
		data.args.game,
		data.args.division,
		data.args.blueUser,
		data.args.depth + '-' + data.args.pruning,
		data.args.bans + '-' + data.args.selfBans.filter(function(i) { return bans.indexOf(i) == -1 }),
		data.blueTeam + '-' + data.redTeam
	].join('/');
	var resultsJSON = JSON.stringify(results);
	firebase.database().ref(path).transaction(function(all_results){
		if(all_results === null){
			all_results = [];
		}
		for(var resultKey in all_results){
			var result = all_results[resultKey];
			if(_.isEqual(result.resultsJSON, resultsJSON)){
				result.score++;
				return all_results;
			}
		}
		all_results.push({"resultsJSON": resultsJSON, "score": 1});
		return all_results;
	}).then(function(promise){
		console.log(promise);
	});
}

$(document).ready(function(){
	initializeFirebase();
	loadNetworks(games, ALL_NETWORKS, initialize);
});

})();
