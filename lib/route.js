"use strict";

module.exports = {
	Router: Router
};

var url = require('url');

function Router(db) {
	this.db = db;
	this.routeMap = {
		get: [],
		post: []
	}
}

Router.prototype.route = function(req, res) {
	var routeMap = this.routeMap[req.method.toLowerCase()];
	var resource = url.parse(req.url).pathname;
	for(var i = 0; i < routeMap.length; i++) {
		var match = routeMap[i].regexp.exec(resource);
		if(match) {
			req.params = {};
			routeMap[i].tokens.forEach(function(token, j) {
				req.params[token] = match[j+1];
			});
			return routeMap[i].handler(req, res);
		}
	}
	res.statusCode = 404;
	res.statusMessage = "Resource Not Found";
	res.end("Resource Not Found");
}

Router.prototype.get = function(route, handler) {
	addRoute(this.routeMap.get, route, handler);
}

Router.prototype.post = function(route, handler) {
	addRoute(this.routeMap.post, route, handler);
}

Router.prototype.resource = function(route, resource) {
	var db = this.db;
	if(resource.list) this.get(route, function(req, res) {resource.list(req, res, db)});
  	if(resource.create) this.post(route, function(req, res) {resource.create(req, res, db)});
  	if(resource.read) this.get(route + '/:id', function(req, res) {resource.read(req, res, db)});
  	if(resource.edit) this.get(route + '/:id/edit', function(req, res) {resource.read(req, res, db)});
  	if(resource.update) this.post(route + '/:id', function(req, res) {resource.update(req, res, db)});
  	if(resource.destroy) this.get(route + '/:id/destroy', function(req, res) {resource.destroy(req, res, db)});
}

function addRoute(routeMap, route, handler) {
	var tokens = [];
	var parts = route.split('/').map(function(part) {
		if(part.charAt(0) == ':') {
			tokens.push(part.slice(1));
			return '([^\/]+)'; //Capture everything except forward slashes
			//return '(\w+)'; Words
		} else {
			return part;
		}
	});
	var regexp = new RegExp('^' + parts.join('/') + '/?$');
	routeMap.push({
		regexp: regexp,
		tokens: tokens,
		handler: handler
	});
}