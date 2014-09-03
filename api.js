'use strict';

var _ = require('underscore');

module.exports = function(app) {

	app.get('/api', function(req, res) {

		var data = app.get('data');

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
			if(req.query.name && results.data[0].valor != undefined) {
				results.data = _.sortBy(results.data, function(i) {
					if(req.query.order == 'DESC')
						return i.valor;
					else
						return -i.valor;
				});
			}
		}

		if(req.query.average) {

			var response = [];

			var key = req.query.average;

			var indexes = _.uniq(_.map(results.data, function(i) { return i[key]; }));

			_.each(indexes, function(index) {

				var items = _.filter(results.data, function(i) { return i[key] == index; });

				var sum = _.map(items, function(i) { return i.valor; }).reduce(function(a, b) { return a + b; });

				var indexData = {
					count: items.length,
					average: (sum / items.length).toFixed(2)
				};

				if(index != undefined) {
					indexData[key] = index;
				}

				response.push(indexData);


			});

			results.data = response;

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

};