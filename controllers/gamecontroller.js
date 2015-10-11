var async = require('async');
var ObjectID = require('mongodb').ObjectID; 
module.exports = function(system){
	var dbConn = system.common.mongodb;
	var redisClient = system.common.redisClient;
	return {
		creategame: function(username, callback) {
			var game = {}
			game['username'] = username;
			game['score'] = null;
			dbConn.collection('games').insertOne(game, callback);
		},
		endgame: function(username, gameid, score, callback) {
			var redisArgs = ['leaderboard', score, username];
			dbConn.collection("games").findOne({'_id':new ObjectID(gameid)}, function(err, doc) {
				console.log("doc: " + doc);
				if(err) {
					callback({"errmsg":"game:" + gameid + " not found"},null);
					return;
				} else if(doc === null) {
					callback({"errmsg":"game:" + gameid + " does not exist"}, null);
				} else if(doc['score'] != null) {
					callback({"errmsg":"game: " + gameid + " already ended"}, null);
				}else {
					redisClient.zincrby(redisArgs, function(err, res){
								if(err) {
									console.log(err);
								}
							});
					dbConn.collection('users').update({'username': username},{$inc:{"score": parseInt(score)}});
					dbConn.collection('games').updateOne({'_id':new ObjectID(gameid)},{$set:{"score": parseInt(score)}}, callback);
				}
			});
			
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
				if(rank === null){
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