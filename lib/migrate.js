"use strict";

module.exports = migrate;

var fs = require('fs');

function migrate(db, dir, callback) {
	var migrations = fs.readdirSync(dir);
	var toDo = migrations.length;

	db.serialize(function() {
		db.run(
			"CREATE TABLE IF NOT EXISTS migrations " + 
			"(id INTEGER PRIMARY KEY, filename TEXT NOT NULL);"
		);

		migrations.forEach(function(migration) {
			db.get("SELECT id FROM migrations WHERE filename=?;", [migration], function(err, row) {
				if(err) {return callback(err);}
				if(!row) {
					var sql = fs.readFileSync(dir + "/" + migration, {encoding: 'utf8'});
					db.run(sql, [], function(err, result) {
						if(err) {return callback(err);}
						db.run("INSERT INTO migrations (filename) VALUES (?);", [migration], function(err) {
							if(err) {return callback(err);}
							toDo--;
							if(toDo == 0) callback(false);
						});
					});
				} else {
					toDo--;
					if(toDo == 0) callback(false);
				}
			});
		});
	});
}