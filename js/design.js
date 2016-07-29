(function() {

var games = {
	'league': null,
}
var game;
var ALL_NETWORKS = {};

function initialize(){
	game = 'league';
	
	$('.picks').empty();

	var numPicks = games[game].order.length / 2;

	for(var i=0;i<numPicks;i++){
		$('<div class="pick">').appendTo('.picks');
	}

	$("#champ-pool").empty().append(buildSquare("../../shared/undo").click(undo));
	$('.bans').empty();

	for(var i=0;i<games[game].champs.length;i++){
		var champ = games[game].champs[i];
		buildSquare(champ).attr('data-champ', champ).click(pick).appendTo('#champ-pool');
		$('.bans').append(buildBan(champ, i));
	}

	$('#division').empty();
	for(var d in games[game].divisions){
		$("<option>").attr('value', d).text(games[game].divisions[d]).appendTo("#division");
	}
	

	$('.bans').multipleSelect({
		'placeholder': 'Select Champions',
		'selectAllDelimiter': [''],
		'minimumCountSelected': $(this).attr('data-minimum-count-selected'),
	}).multipleSelect('uncheckAll');

	$('.slider').each(function(){
		var range = $(this).attr('data-range').split(',').map(Number);
		var modifier = $(this).attr('modifier') || "";
		$(this).slider({
			'min': range[0],
			'max': range[1],
			'value': range[0],
			'change': stop
		});
		for(var i=range[0]; i <= range[1]; i += range[2]){
			$('<label>').text(i+modifier).css('left', (i-range[0])/(range[1]-range[0])*100 + '%').appendTo($(this));
		}
	});

	animateChampPool();

	$("#start").click(start);
	$("#stop").click(stop);
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
	return $('<img class="champ">').attr("src", "images/" + game + "/square/" + champ + ".png");
}

function buildBan(champ, index){
	return $('<option>').text(' '+champ).attr('value', index);
}

function buildSplash(champ){
	return $('<img class="splash">').attr('src', "images/" + game + "/splash/" + champ + ".jpg").attr('data-champ', champ);
}

function getPick(index){
	var blueTurn = games[game].order[index];
	var n = games[game].order.slice(0,index).reduce(function(n, t) { return n + (t === blueTurn) }, 0);
	var team = blueTurn ? "blue" : "red";
	return $("#" + team + "-team .pick").eq(n);
}

function pick(){
	var splashes = $('.splash');
	if(games[game].order.length > splashes.length){
		var champ = $(this).attr('data-champ');
		if(splashes.filter('[data-champ="' + champ + '"]').length === 0){
			getPick(splashes.length).html(buildSplash(champ));
		}
	}
}

function undo(){
	var splashes = $('.splash');
	if(splashes.length > 0){
		getPick(splashes.length-1).empty();
	}
}

function getTeam(team){
	return $(team).find('.splash').map(function(){ return games[game].champs.indexOf($(this).attr('data-champ')) }).toArray();
}

function start(){
	$('#results-container').empty();

	$("#stop").removeAttr("disabled");
	$("#start").attr("disabled",'');

	var blueTeam = getTeam('#blue-team');
	var redTeam = getTeam('#red-team');

	var numChosen = blueTeam.length + redTeam.length;

	var picks = games[game].order.slice(numChosen, numChosen + $("#depth").slider( "option", "value" ));

	var args = {
		'blueUser': ($('#team').val() === "blue"),
		'bans': $("#bans").multipleSelect("getSelects"),
		'selfBans': $("#self-bans").multipleSelect("getSelects"),
		'memory': $("#memory").slider( "option", "value" ),
		'pruning': $("#pruning").slider( "option", "value" ),
		'networks': ALL_NETWORKS[game][$('#division').val()].networks,
		'showResult': showResult,
		'numChamps': games[game].champs.length,
		'stop': stop,
		'resume': resume
	}

	search(blueTeam, redTeam, picks, args);
}

function stop(){
	$("#start").removeAttr("disabled");
	$("#stop").attr("disabled",'');
}

function resume(){
	return true;
}

function buildResult(result){
	var teams = $('<div class="result-teams">').append(buildResultTeam(result.blueTeam)).append(buildResultTeam(result.redTeam));
	var scores = $('<div class="result-scores">').append(buildResultPercentage(result.score, 'Odds of Winning')).append(buildResultPercentage(result.popularity, 'Popularity'));
	return $('<div class="result">').append(teams).append(scores);
}

function buildResultTeam(indices){
	var team = $('<div class="result-team">');
	for(var index of indices){
		buildSquare(games[game].champs[index]).appendTo(team);
	}
	return team;
}

function buildResultPercentage(f, text){
	var percentage = (f*100).toFixed(2) + '%';
	return $('<div class="result-percentage">').text(text + ': ' + percentage);
}

function showResult(result, index, overflow){
	var resultsContainer = $('#results-container');

	builtResult = buildResult(result);

	console.log(resultsContainer)

	if(overflow){
		resultsContainer.children().last().remove();
	}

	if(index === 0){
		builtResult.prependTo(resultsContainer);
	}
	else{
		builtResult.insertAfter(resultsContainer.children().eq(index-1));
	}
}

$(document).ready(function(){
	loadNetworks(games, ALL_NETWORKS, initialize);
});

})();
