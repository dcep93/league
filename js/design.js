var game;

$(document).ready(function(){
	game = league;
	initialize();
});

function initialize(){
	$('.picks').empty();

	for(var i=0;i<game.teamSize;i++){
		$('<div class="pick">').appendTo('.picks');
	}

	$("#champ-pool").empty().append($('<img class="champ"').attr("src", "images/shared/undo.png").click(undo));
	$('.bans').empty();

	for(var champ of game.champs){
		$('#champ-pool').append(buildSquare(champ));
		$('.bans').append(buildBan(champ));
	}

	$('#division').empty();
	for(var d of game.division){
		$("<option>").attr('value', d).text(game.division[d]).appendTo("#division");
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
			'step': range[2],
			'value': range[0]
		});
		for(var i=range[0]; i <= range[1]; i += range[2]){
			$('<label>').text(i).css('left', (i-range[0])/(range[1]-range[0])*100 + '%').appendTo($(this));
		}
	});
}

function buildSquare(champ){
	return $('<img class="champ">').attr("src", "images/" + game.name + "/square/" + champ + ".png").attr('data-champ', champ).click(pick);
}

function buildBan(champ){
	return $('<option>').text(' '+champ).attr('value', champ);
}

function buildSplash(champ){
	return $('<img class="splash">').attr('src', "images/" + game.name + "/splash/" + champ + ".jpg").attr('data-champ', champ);
}

function getPick(index){
	var team = game.order[index];
	var n = game.order.slice(0,index).reduce(function(n, t) { return n + (t === team) }, 0);
	return $("#" + team + "-team .pick").eq(n);
}

function pick(){
	var splashes = $('.splash');
	if(game.order.length > splashes.length){
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
	return $(team).find('.splash').map(function(){ return game.champs.indexOf($(this).attr('data-champ')) }).toArray();
}

function start(){
	$("#stop").removeAttr("disabled");
	$("#start").attr("disabled",'');

	data = {
		'game': game.name,
		'blueTeam': getTeam('#blue-team'),
		'redTeam': getTeam('#red-team'),
		'division': $('#division').val(),
		'bans': $("#bans").multipleSelect("getSelects"),
		'selfBans': $("#self-bans").multipleSelect("getSelects"),
		'depth': $("#depth").slider( "option", "value" ),
		'memory': $("#memory").slider( "option", "value" ),
		'pruning': $("#pruning").slider( "option", "value" )
	}

	process(data, showResults, stop);
}

function stop(){
	$("#start").removeAttr("disabled");
	$("#stop").attr("disabled",'');
}

// {blueTeam: Array[int], redTeam: Array[int], score: int, popularity: int} result, int index
function showResult(results, index){

}
