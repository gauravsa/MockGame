module.exports = function(system){
	var dbConn = system.common.mongodb;
	return {
		adduser: function(username, age, callback) {
			var user ={};
			user['username'] = username;
			user['age'] = age;
			user['score'] = 0;
			user['rank'] = 0;
			dbConn.collection('users').insertOne(user, callback);
		},
		getuser: function(username, callback) {
			var find = {};
			find["username"] = username;
			dbConn.collection('users').findOne(find,callback);
		}
	}
}