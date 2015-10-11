var system = require('../lib/system');
exports.list = function(req, res){
  res.send('respond with a resource');
};

exports.adduser = function(req, res) {
	var username = req.param('username');
	var age = req.param('age');
	system.controllers.userController.adduser(username, age, function(err, record) {
		console.log("errror: " + err + " record: %j", record);
		if(err) {
			res.status(200).json({"error": err["errmsg"]});
		} else {
			res.status(200).json(record["ops"]);
		}
	});
	
};

exports.getuser = function(req, res) {
	var username = req.param('username');

	system.controllers.userController.getuser(username, function(err, doc) {
		console.log("error: " + err + " records: %j", doc);
		if(err) {
			res.status(200).json({"error": err["errmsg"]});
		} else {
			res.status(200).json(doc);
		}
	});
};