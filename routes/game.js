var system = require('../lib/system');


exports.creategame = function(req, res) {
	var username = req.param('username');
	system.controllers.gameController.creategame(username, function(err, record){
		if(err) {
			res.status(200).json({"error": err["errmsg"]});
		} else {
			res.status(200).json(record["ops"][0]);
		}

	});
}


exports.endgame = function(req, res) {
	var username = req.param('username');
	var gameid = req.param('gameid');
	var score = req.param('score');
	system.controllers.gameController.endgame(username, gameid, score, function(err, record){
		if(err) {
			res.status(404).json({"error": err["errmsg"]});
		} else {
			res.status(200).json({"msg": "gamecompleted"});
		}
	});
}

exports.getLeaderBoard = function(req, res) {
	system.controllers.gameController.getLeaderBoard(function(leaderBoard) {
		if(leaderBoard) {
			res.status(200).json(leaderBoard);
		} else {
			res.status(404).json({"msg": "leaderBoard not available"});
		}
	});
}

exports.getLeaderBoardByUsername = function(req, res) {
	var username = req.param('username');
	system.controllers.gameController.getLeaderBoardByUsername(username, function(leaderBoard) {
		if(leaderBoard) {
			res.status(200).json(leaderBoard);
		} else {
			res.status(404).json({"msg": "leaderBoard not available"});
		}
	});
} 