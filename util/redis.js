var redis = require('redis');
var system = require('../lib/system');

module.exports = function(system, callback){ 
	var redisClient;

	var loadUserDb = function(){
		system.common.mongodb.collection("users").find({}, {username: 1, score: 1, _id:0}).each(function(err,doc){
			if(err) {
				console.log(err);
			} else {
				if(doc) {
					console.log(doc);
					
					var redisArgs = ['leaderboard', doc['score'] , doc['username']];
					console.log("redisArgs" + redisArgs);
					redisClient.zadd(redisArgs, function(err, res){
						if(err) {
							console.log(err);
						}else {
							console.log(res);
						}
					});
				}
			}
		});

	};

	var startRedis = function() {
		var host = system.common.config.redis.host;
		var port = system.common.config.redis.port;
		redisClient = redis.createClient(port, host);
		
		redisClient.on("error",function (err) {
	    	console.log(err);
		});
		redisClient.on("connect", function(msg){
			console.log("Redis Connection established at host: " + host + " port: " + port);
			callback(redisClient);
		});
		redisClient.on("ready", function(msg) {
			loadUserDb();
		});
	}

	startRedis();
}