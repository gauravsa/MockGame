var async = require('async');
var ObjectID = require('mongodb').ObjectID; 
module.exports = function(system){
	var dbConn = system.common.mongodb;
	var redisClient = system.common.redisClient;
	return {
		creategame: function(username, callback) {
			var game = {}
			game['username'] = username;
			game['score'] = 0;
			dbConn.collection('games').insertOne(game, callback);
		},
		endgame: function(username, gameid, score, callback) {
			var redisArgs = ['leaderboard', score, username];
			redisClient.zincby(redisArgs, function(err, res){
						if(err) {
							console.log(err);
						}
					});
			dbConn.collection('users').update({'username': username},{$inc:{"score": score}});
			dbConn.collection('games').updateOne({'_id':new ObjectID(gameid)},{$set:{"score": score}}, callback);
		},
		getLeaderBoard: function(callback) {
			var rangeArgs = ['leaderboard', 0, 9];
			redisClient.zrevrange(rangeArgs, function(err, users){
				console.log(users);
				var leaderBoard = [];
				async.each(users,function(username, asynCallback) {
					var scoreArgs = ['leaderboard', username]
					redisClient.zscore(scoreArgs, function(err, score) {
						if(err) {
							console.log(err);
						} else {
							leaderBoard.push({"username": username, "score": parseInt(score)});
						}
						asynCallback();
					});
					
				}, function(err){
					if(err){
						callback(null);
					} else {
						callback(leaderBoard);
					}
				});
				
			});
		},
		getLeaderBoardByUsername: function(username, callback) {
			var rankArgs = ['leaderboard', username];
			redisClient.zrevrank(rankArgs, function(err, rank){
				console.log(rank);
				if(!rank){
					callback(null);
				}
				var start = rank - 5;
				var end = rank + 4
				console.log("start:" + start + "end: " + end);
				if(start<0) {
					end += Math.abs(start);
					start = 0;
				}
				console.log("start:" + start + "end: " + end);
				var rangeArgs = ['leaderboard', start, end];
				redisClient.zrevrange(rangeArgs, function(err, users){
					
					var leaderBoard = [];
					async.each(users, function(username, asynCallback){
						var scoreArgs = ['leaderboard', username]
						redisClient.zscore(scoreArgs, function(err, score) {
							if(err) {
								console.log(err);
							} else {
								leaderBoard.push({"username": username, "score": parseInt(score)});
							}
							asynCallback();
						});
					
					}, function(err){
						if(err){
							callback(null);
						} else {
							callback(leaderBoard);
						}
					});
					
				});
			});
		}
	}
}