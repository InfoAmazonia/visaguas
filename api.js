'use strict';

var fs = require('fs'),
	_ = require('underscore');

module.exports = function(app) {

	app.get('/api', function(req, res) {

		var data;

		if(req.query.query == 'estados') {
			data = app.get('estados');
		} else {
			data = app.get('municipios');
		}

		var limit = parseInt(req.query.limit) || 20;
		var page = parseInt(req.query.page) || 1;

		var results = {
			data: data.slice(0)
		};

		if(req.query) {
			for(var key in req.query) {
				results.data = _.filter(results.data, function(i) {
					if(!i[key])
						return true;
					return i[key] == req.query[key];
				});
			}
		}

		results.total = results.data.length;

		if(page*limit > results.total && page !== 1)
			res.send([]);
		else {
			if(limit !== -1)
				results.data = results.data.slice(((page-1)*limit), ((page-1)*limit) + limit);
			res.send(results);
		}

	});

	app.get('/api/municipios', function(req, res) {

		if(req.query.format == 'csv') {
			fs.readFile('data/municipios.csv', function(err, data) {
				res.send(data);
			});
		} else {
			res.send(app.get('municipios'));
		}

	});

	app.get('/api/estados', function(req, res) {

		if(req.query.format == 'csv') {
			fs.readFile('data/estados.csv', function(err, data) {
				res.send(data);
			});
		} else {
			res.send(app.get('estados'));
		}

	});

};