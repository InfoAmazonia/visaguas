var fs = require('fs');

if(fs.existsSync('./.env')) {
	require('dotenv').load();
}

var async = require('async'),
	csv = require('csv'),
	express = require('express'),
	bodyParser = require('body-parser'),
	_ = require('underscore');

var app = express();

app.use(require('compression')());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', express.static(__dirname + '/dist'));

require('./api')(app);

app.get('/*', function(req, res) {
	res.sendFile('dist/views/index.html', { root: __dirname });
});

function serve() {
	app.set('municipios', municipios);
	app.set('estados', estados);
	var port = process.env.PORT || 8000;
	app.listen(port);
	console.log('App started on port ' + port);
}

/*
 * Prepare data
 */

var municipios;
var estados;

csv.parse(fs.readFileSync('data/municipios.csv'), {columns: true}, function(err, output) {
	municipios = output;
	csv.parse(fs.readFileSync('data/estados.csv'), {columns: true}, function(err, output) {
		_.each(output, function(estado) {
			estado.total_municipios = _.filter(municipios, function(municipio) { return municipio.estado_id == estado.id }).length;
		});
		estados = output;
		serve();
	});
});
