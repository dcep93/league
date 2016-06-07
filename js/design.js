$(document).ready(function(){
	for(var champ of champs){
		$('#champ-pool').append(buildSquare(champ));
		$('.bans').append(buildBan(champ));
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
});

function buildSquare(champ){
	return $('<img class="champ">').attr("src", "images/square/" + champ + ".png").attr('data-name', champ).click(pick);
}

function buildBan(champ){
	return $('<option>').text(' '+champ).attr('value', champ);
}

function buildSplash(champ){
	return $('<img class="splash">').attr('src', "images/splash/" + champ + ".jpg").attr('data-champ', champ);
}

function getPick(index){
	var team = order[index];
	var n = order.slice(0,index).reduce(function(n, t) { return n + (t === team) }, 1);
	return $("#" + team + "-team .pick:nth-child(" + n + ")");
}

function pick(){
	var splashes = $('.splash');
	if(order.length > splashes.length){
		var champ = $(this).attr('data-name');
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

function start(){
	$("#stop").removeAttr("disabled");
	$("#start").attr("disabled",'');

	data = {
		'blueTeam': $('#blue-team .splash').map(function(){ return $(this).attr('data-champ') }).toArray(),
		'redTeam': $('#red-team .splash').map(function(){ return $(this).attr('data-champ') }).toArray(),
		'division': $('#division').val(),
		'bans': $("#bans").multipleSelect("getSelects"),
		'selfBans': $("#self-bans").multipleSelect("getSelects"),
		'depth': $("#depth").slider( "option", "value" ),
		'memory': $("#memory").slider( "option", "value" )
	}

	process(data, showResults, stop);
}

function stop(){
	$("#start").removeAttr("disabled");
	$("#stop").attr("disabled",'');
}

// Array[{blueTeam: Array[String], redTeam: Array[String], score: int, popularity: int}] results
function showResults(results){

}
