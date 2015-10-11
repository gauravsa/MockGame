var config = require('../config');

module.exports = {
	common: {
		config: config,
		mongodb: null,
		redisClient: null
	},
	controllers: {
		gameController: null,
		userController: null
	}
}

var initSystem = function(callback) {
	require('../util/mongo')(config, function(db){
		module.exports.common.mongodb = db;
		callback(finishedInitialization);
	});
}

var initializeRedis = function(callback){
	require('../util/redis')(module.exports, function(redisClient){
		module.exports.common.redisClient = redisClient;
		callback();
	});
}

var finishedInitialization = function(){
	module.exports.controllers.gameController = require('../controllers/gamecontroller')(module.exports);
	module.exports.controllers.userController = require('../controllers/usercontroller')(module.exports);
}

initSystem(initializeRedis);


