"use strict";

var port = 12037;
var fs = require('fs');
var http = require('http');
var sqlite3 = require('sqlite3').verbose();
var migrate = require('./lib/migrate');
var stylesheet = fs.readFileSync('public/dnd.css');

var db = new sqlite3.Database('dndApp.sqlite3', function(err) {
	if(err) console.error(err);
});

db.run(
	"CREATE TABLE IF NOT EXISTS characters " +
	"(id INTEGER PRIMARY KEY, name TEXT NOT NULL, strength INTEGER NOT NULL, dexterity INTEGER NOT NULL, constitution INTEGER NOT NULL, intelligence INTEGER NOT NULL, wisdom INTEGER NOT NULL, charisma INTEGER NOT NULL, ac INTEGER NOT NULL, speed INTEGER NOT NULL, hpMax INTEGER NOT NULL);"
);

migrate(db, 'migrations', function(err) {
	if(err) console.error(err);
	else console.log("Migrations complete");
});

var router = new (require('./lib/route')).Router(db);

router.get('/', function(req, res) {
	fs.readFile('public/index.html', function(err, body) {
		res.end(body);
	});
});

router.get('/app.js', function(req, res) {
	fs.readFile('public/app.js', function(err, body) {
		res.end(body);
	});
});

router.get('/dnd.css', function(req, res) {
	fs.readFile('public/catlog.css', function(err, body) {
		res.setHeader('Content-Type', 'text/css');
		res.end(stylesheet);
	});
});

router.get('/character-form.html', function(req, res) {
	fs.readFile('public/character-form.html', function(err, body) {
		res.end(body);
	});
});

router.get('/edit-form.html', function(req, res) {
	fs.readFile('public/edit-form.html', function(err, body) {
		res.end(body);
	});
});

var character = require('./src/resources/character');
router.resource('/characters', character);

var server = new http.Server(function(req, res) {
	router.route(req, res);
});
server.listen(port, function() {
	console.log("Server running on port " + port);
});