"use strict";

module.exports = {
	list: list,
	create: create,
	read: read,
	update: update,
	destroy: destroy
}

function list(req, res, db) {
	db.all("SELECT * FROM characters", [], function(err, characters) {
		if(err) {
			console.error(err);
			res.statusCode = 500;
			res.end("Server Error");
		}
		res.setHeader("Content-Type", "text/json");
		res.end(JSON.stringify(characters));
	});
}

function create(req, res, db) {
	var body = "";

	req.on("error", function(err) {
		console.error(err);
		res.statusCode = 500;
		res.end("Server Error");
	});

	req.on("data", function(data) {
		body += data;
	});

	req.on("end", function() {
		var character = JSON.parse(body);
		db.run("INSERT INTO characters (name, strength, dexterity, constitution, intelligence, wisdom, charisma, ac, speed, hpMax) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
			[character.name, character.str, character.dex, character.con, character.int, character.wis, character.char, character.ac, character.speed, character.hpMax],
			function(err) {
				if(err) {
					console.error(err); 
					res.statusCode = 500;
					res.end("Failed to insert character into databse");
					return;
				}
				res.statusCode = 200;
				res.end();
			}
		);
	});
}

function read(req, res, db) {
	var id = req.params.id;
	db.get("SELECT * FROM characters WHERE id=?", [id], function(err, character) {
		if(err) {
			console.error(err);
			res.statusCode = 500;
			res.end("Server Error");
			return;
		}
		if(!character) {
			res.statusCode = 404;
			res.end("Character Not Found");
			return;
		}
		res.setHeader("Content-Type", "text/json");
		res.end(JSON.stringify(character));
	});
}

function update(req, res, db) {
	var id = req.params.id;
	var body = "";
	
	req.on("error", function(err) {
		console.error(err);
		res.statusCode = 500;
		res.end("Server Error");
	});

	req.on("data", function(data) {
		body += data;
	});

	req.on("end", function() {
		var character = JSON.parse(body);
		db.run("UPDATE characters SET name=?, strength=?, dexterity=?, constitution=?, intelligence=?, wisdom=?, charisma=?, ac=?, speed=?, hpMax=? WHERE id=?",
			[character.name, character.strength, character.dexterity, character.constitution, character.intelligence, character.wisdom, character.charisma, character.ac, character.speed, character.hpMax, id],
			function(err) {
				if(err) {
					console.error(err);
					res.statusCode = 500;
					res.end("Could not update character in database");
					return;
				}
				res.statusCode = 200;
				res.end();
			}
		);
	});
}

function destroy(req, res, db) {
	var id = req.params.id;
	db.run("DELETE FROM characters WHERE id=?", [id], function(err) {
		if(err) {
			console.error(err);
			res.statusCode = 500;
			res.end("Server Error");
		}
		res.statusCode = 200;
		res.end();
	});
}