// Array data = {
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
}