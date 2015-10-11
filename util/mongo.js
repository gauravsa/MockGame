var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

module.exports = function(config, callback){
	var url = config.mongo.url;
	var connect = function(url){
		MongoClient.connect(url, function (err, db) {
		  if (err) {
		    console.log('Unable to connect to the mongoDB server. Error:', err);
		  } else {
		    console.log('Connection established to', url);
			callback(db);
		  }
		});
	}
	connect(url);
}