var fs = require('fs'),
	async = require('async'),
	csv = require('csv'),
	express = require('express'),
	bodyParser = require('body-parser'),
	_ = require('underscore')
	config = require('./config');

var app = express();
app.use(require('compression')());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', express.static(__dirname + '/dist'));

app.get('/api', function(req, res) {

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
		if(req.query.name) {
			results.data = _.sortBy(results.data, function(i) {
				if(req.query.order == 'DESC')
					return i['value'];
				else
					return -i['value'];
				return 0;
			});
		}
	}

	results.total = results.data.length;

	if(page*limit > results.total && page !== 1)
		res.send([]);
	else
		results.data = results.data.slice(((page-1)*limit), ((page-1)*limit) + limit);
		res.send(results);
});

app.get('/*', function(req, res) {
	res.sendfile('dist/views/index.html');
});

function serve() {
	var port = process.env.PORT || 8000;
	app.listen(port);
	console.log('App started on port ' + port);
}

/*
 * Prepare data
 */

var data = [];

if(config.data.length) {
	console.log('Preparing data...');
	async.each(config.data, function(item, callback) {
		var path = config.dataDir + item.file;
		var d = { type: item.type, name: item.name };
		csv.parse(fs.readFileSync(path), {columns: true}, function(err, output) {
			var parsed = [];
			_.each(output, function(i) {
				parsed.push(_.extend({
					city: i['NOME_MUN2'],
					year: parseInt(i['NU_ANO7']),
					ibgeCode: parseInt(i['CO_IBGE3']),
					value: parseFloat(i['VALOR8'])
				}, d));
			});
			if(err) callback(err);
			else {
				console.log('Processed: ' + item.name);
				data = data.concat(parsed);
				callback();
			}
		});
	}, function(err) {
		if(err) {
			console.log(err);
		} else {
			console.log('Total items: ' + data.length);
			data = _.sortBy(data, function(i) { return i['city']; });
			serve();
		}
	});
}