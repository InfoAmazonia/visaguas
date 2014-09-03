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

require('./api')(app);

app.get('/*', function(req, res) {
	res.sendfile('dist/views/index.html');
});

function serve() {
	app.set('data', data);
	app.set('cities', data);
	var port = process.env.PORT || 8000;
	app.listen(port);
	console.log('App started on port ' + port);
}

/*
 * Prepare data
 */

var cities = [];
var data = [];

if(config.data.length) {
	console.log('Preparing data...');
	async.each(config.data, function(item, callback) {
		var path = config.dataDir + item.file;
		var d = { type: item.type, name: item.name };
		csv.parse(fs.readFileSync(path), {columns: true}, function(err, output) {
			if(err) callback(err);
			else {
				var parsed = [];
				if(item.name == 'municipios_amazonia_legal') {
					_.each(output, function(i) {
						parsed.push(_.extend({
							cidade: i['Nome do Município'],
							uf: i['Nome da Unidade da Federação'],
							ibge: parseInt(i['Código do Município'].slice(0, i['Código do Município'].length-1))
						}, d));
					});
					cities = cities.concat(parsed);
				} else {
					_.each(output, function(i) {
						var city = _.find(cities, function(c) { return c.name == 'municipios_amazonia_legal' && c.ibge == parseInt(i['CO_IBGE3']); });
						if(city) {
							parsed.push(_.extend({
								cidade: i['NOME_MUN2'],
								uf: city.uf,
								ano: parseInt(i['NU_ANO7']),
								ibge: parseInt(i['CO_IBGE3']),
								valor: parseFloat(i['VALOR8'])
							}, d));
						}
					});
					data = data.concat(parsed);
				}
				console.log('Processed: ' + item.name);
				callback();
			}
		});
	}, function(err) {
		if(err) {
			console.log(err);
		} else {
			console.log('Total items: ' + data.length);
			data = _.sortBy(data, function(i) { return i['cidade']; });
			serve();
		}
	});
}