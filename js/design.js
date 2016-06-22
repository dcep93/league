var game;

$(document).ready(function(){
	game = 'league';
	initialize();
});

function initialize(){
	$('.picks').empty();

	var numPicks = games[game].order.length / 2;

	for(var i=0;i<numPicks;i++){
		$('<div class="pick">').appendTo('.picks');
	}

	$("#champ-pool").empty().append($('<img class="champ">').attr("src", "images/shared/undo.png").click(undo));
	$('.bans').empty();

	for(var i=0;i<games[game].champs.length;i++){
		var champ = games[game].champs[i];
		buildSquare(champ).addClass('champ').attr('data-champ', champ).click(pick).appendTo('#champ-pool');
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
		$(this).slider({
			'min': range[0],
			'max': range[1],
			'value': range[0]
		});
		for(var i=range[0]; i <= range[1]; i += range[2]){
			$('<label>').text(i).css('left', (i-range[0])/(range[1]-range[0])*100 + '%').appendTo($(this));
		}
	});

	$('#pruning label').text(function(){ return $(this).text() + '%'});
}

function buildSquare(champ){
	return $('<img>').attr("src", "images/" + game + "/square/" + champ + ".png");
}

function buildBan(champ, index){
	return $('<option>').text(' '+champ).attr('value', index);
}

function buildSplash(champ){
	return $('<img class="splash">').attr('src', "images/" + game + "/splash/" + champ + ".jpg").attr('data-champ', champ);
}

function getPick(index){
	var team = games[game].order[index];
	var n = games[game].order.slice(0,index).reduce(function(n, t) { return n + (t === team) }, 0);
	return $("#" + team + "-team .pick").eq(n);
}

function pick(){
	var splashes = $('.splash');
	if(games[game].order.length > splashes.length){
		var champ = $(this).attr('data-champ');
		if(splashes.filter('[data-champ="' + champ + '"]').length == 0){
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
	$("#stop").removeAttr("disabled");
	$("#start").attr("disabled",'');

	data = {
		'blueTeam': getTeam('#blue-team'),
		'redTeam': getTeam('#red-team'),
		'bans': $("#bans").multipleSelect("getSelects"),
		'selfBans': $("#self-bans").multipleSelect("getSelects"),
		'depth': $("#depth").slider( "option", "value" ),
		'memory': $("#memory").slider( "option", "value" ),
		'pruning': $("#pruning").slider( "option", "value" )
	}

	$('#division').val('bronze');
	var network = networks[game][$('#division').val()].network;

	process(data, network, showResult);

	stop();
}

function stop(){
	$("#start").removeAttr("disabled");
	$("#stop").attr("disabled",'');
}

function buildResult(result){
	var teams = $('<div class="result-teams">').append(buildResultTeam(result.blueTeam)).append(buildResultTeam(result.redTeam));
	var scores = $('<div class="result-scores">').append(buildResultPercentage(result.score)).append(buildResultPercentage(result.popularity));
	return $('<div class="result">').append(teams).append(scores);
}

function buildResultTeam(indices){
	var team = $('<div class="result-team">');
	for(var index of indices){
		buildSquare(games[game].champs[index]).appendTo(team);
	}
	return team;
}

function buildResultPercentage(f){
	var percentage = (f*100).toFixed(2) + '%';
	return $('<div class="result-percentage">').text(percentage);
}

function showResult(result, index, overflow){
	var results = $('#results');

	buildResult(result).insertAfter(results.eq(index));

	if(overflow){
		results.last().remove();
	}
}
