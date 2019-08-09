const mysql = require('mysql');
const cfg = require('../config/mysql.json');

var connection = mysql.createConnection({
  host: cfg.database_ip,
  port: cfg.database_port,
  user: cfg.database_user,
  password: cfg.database_pass,
  database: cfg.database,
});

module.exports = class MySQL {
	static async handle(msg, args) {
		var qs = "SELECT * FROM `master`";
		connection.query(qs, function(error, results, fields) {
			if (error)
				throw error;
			console.log(results);
		});
	}
};
