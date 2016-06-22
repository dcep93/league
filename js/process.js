// Array data = {
//  'max': bool
// 	'blueTeam': Array[int],
// 	'redTeam': Array[int],
// 	'bans': Array[int],
// 	'selfBans': Array[int],
// 	'depth': int,
// 	'memory': int,
// 	'pruning': float
// }
//
// Array[Array[Array[float]]] network (array of matrices)
// function showResult({blueTeam: Array[int], redTeam: Array[int], score: float[0,1], popularity: float[0,1]} result, int index, bool overflow);

function process(data, network, showResult){
	showResult({
		'blueTeam': [7,14,93],
		'redTeam': [11,4,96],
		'score': 0.1337,
		'popularity': 0.69
	}, 0, false);


	showResult({
		'blueTeam': [25,6,4],
		'redTeam': [0,46,2],
		'score': 0.3,
		'popularity': 0.7
	}, 1, false);
}