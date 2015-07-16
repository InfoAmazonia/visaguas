'use strict';

module.exports = function(app) {

	app.directive('animateCount', [
		function() {
			return {
				link: function(scope, element, attrs) {

					var topOffset;
					var windowHeight;

					var updateSizes = function() {
						topOffset = element.offset().top;
						windowHeight = $(window).height();
					};

					updateSizes();

					var parse = function(text) {
						if(attrs.prefix) text = attrs.prefix + text;
						if(attrs.suffix) text = text + attrs.suffix;
						return text;
					}

					var start = numberInterval({
						countTo: attrs.number
					}, function(num) {
						element.text(parse(num.toFixed(2)));
					}, function(countTo) {
						element.text(parse(countTo));
					});

					var triggered = false;

					var animate = function() {
						var scrollTop = $(window).scrollTop();
						if(scrollTop + windowHeight >= topOffset && !triggered) {
							triggered = true;
							start();
							attrs.$observe('number', function(val) {
								start(val);
							});
						}
					};
					animate();
					$(window).scroll(animate);

				}
			}
		}
	]);

	app.directive('barItem', [
		'$rootScope',
		function($rootScope) {
			return {
				restrict: 'E',
				scope: {
					data: '='
				},
				transclude: true,
				template:	'<div class="data-rep"></div>' +
							'<div class="data-info">' +
								'<p class="percentage"></p>' +
							'</div>',
				link: function(scope, element, attrs, controller, transclude) {

					transclude(scope, function(clone, scope) {
						element.find('.data-info').append(clone);
					});

					var topOffset;
					var windowHeight;


					var suffix = attrs.suffix || '%';

					var updateSizes = function() {
						topOffset = element.offset().top;
						windowHeight = $(window).height();
					};

					var parseBar = function(num) {
						if(attrs.max) num = parseFloat(num)/parseFloat(attrs.max)*100;
						return num + '%';
					}

					updateSizes();

					var start = numberInterval({
						countTo: attrs.percentage
					}, function(num, countTo) {
						element.find('.data-rep').css({width: parseBar(countTo)});
						element.find('.percentage').html(num.toFixed(2) + '<span class="suffix">' + suffix + '</span>');
					}, function(countTo) {
						element.find('.percentage').html(countTo + '<span class="suffix">' + suffix + '</span>');
					});

					$(window).resize(updateSizes);

					var triggered = false;

					var animate = function() {
						var scrollTop = $(window).scrollTop();
						if(scrollTop + windowHeight >= topOffset && !triggered) {
							triggered = true;
							start();
							$rootScope.$broadcast('barItemStartedAnimation');
						}
					};
					animate();
					$(window).scroll(animate);

				}
			}
		}
	]);

	app.directive('map', [
		'$rootScope',
		function($rootScope) {
			return {
				restrict: 'E',
				link: function(scope, element, attrs) {

					var map = L.map(element[0], {
						center: [0,0],
						zoom: 1,
						scrollWheelZoom: false,
						infowindow: true
					});

					var user = attrs.user || 'infoamazonia';
					var table = attrs.table || 'merge_fiocruz_amz';
					var column =  attrs.column || 'agua_rede_';
					var color = attrs.color || 'transparent';

					var city = attrs.city || '';

					var initOnce = _.once(function() {
						init();
					})

					attrs.$observe('column', function() {
						if(attrs.column) {
							initOnce();
						}
					});

					function init() {

						map.addLayer(L.tileLayer(attrs.baselayer));

						var sql = new cartodb.SQL({user: attrs.user});

						var select = 'SELECT ' + attrs.column + ' as value, * FROM ' + attrs.table;

						if(attrs.where) {
							select += ' WHERE ' + attrs.where;
						}

						var boundSelect = '';

						if(attrs.city) {
							boundSelect = select + " AND co_ibge3 = '" + attrs.city + "'";
						} else {
							boundSelect = select;
						}

						getCartoDBQuantiles(sql, attrs.table, attrs.column, function(quantiles) {

							sql.getBounds(boundSelect).done(function(bounds) {

								$rootScope.$broadcast('cartodbMapReady', {
									id: attrs.group,
									map: map,
									bounds: bounds
								});

								var cartocss = getCartoCSS(attrs.table, attrs.color, quantiles, attrs.city);

								cartodb.createLayer(map, {
									user_name: attrs.user,
									type: 'cartodb',
									sublayers: [{
										sql: select,
										cartocss: cartocss,
										interactivity: attrs.interactivity || 'value'
									}],
									options: {
										tooltip: true
									}
								})
								.addTo(map)
								.done(function(layer) {

									fixMap(map, bounds);

									var sublayer = layer.getSubLayer(0);

									var update = _.debounce(function() {

										//update quantiles
										getCartoDBQuantiles(sql, attrs.table, attrs.column, function(qts) {

											quantiles = qts;

											// set new cartocss
											sublayer.set({'cartocss': getCartoCSS(table, attrs.color, quantiles, attrs.city)});

											// update query
											var select = 'SELECT ' + attrs.column + ' as value, * FROM ' + table;
											if(attrs.where) {
												select += ' WHERE ' + attrs.where;
											}
											sublayer.set({'sql': select});

										});

									}, 100);

									attrs.$observe('group', update);
									attrs.$observe('column', update);
									attrs.$observe('color', update);

									sublayer.setInteraction(true);

									layer.on('featureOver', function(event, latlng, pos, data, layerIndex) {
										$rootScope.$broadcast('cartodbFeatureOver', _.extend({id: attrs.group}, data));
									});

									layer.on('featureOut', function(event) {
										$rootScope.$broadcast('cartodbFeatureOver', {id: attrs.group});
									});

								});

							});

						});

					}

				}
			}
		}
	]);

};

function hexToRgb(hex) {
	hex = hex.replace('#', '');
	var bigint = parseInt(hex, 16);
	var r = (bigint >> 16) & 255;
	var g = (bigint >> 8) & 255;
	var b = bigint & 255;
	return [r,g,b].join(',');
}

function fixMap(map, bounds) {
	setTimeout(function() {
		map.invalidateSize(false);
		map.fitBounds(bounds);
	}, 100);
}

function getCartoCSS(table, color, quantiles, city) {

	var hex = hexToRgb(color);

	var cartocss = [
		'#' + table + ' { polygon-fill: transparent; polygon-opacity: 1; line-width: 1; line-opacity: 0.5; line-color: #000; }',
		'#' + table + '[ value <= 0 ] { polygon-fill: transparent; }'
	];

	_.each(quantiles, function(qt, i) {
		cartocss.push('#' + table + '[ value >= ' + qt + ' ] { polygon-fill: rgba(' + hex + ', ' + ((i+1)/10) + ');  }');
	});

	if(city) {
		cartocss.push('#' + table + '[ co_ibge3 = "' + city + '" ] { line-width: 2; line-color: #fff; line-opacity: 1; }');
	}

	return cartocss.join(' ');

}

function getCartoDBQuantiles(sql, table, column, cb) {
	sql.execute('SELECT CDB_HeadsTailsBins(array_agg(cast(' + column + ' as numeric)), 10) FROM ' + table).done(function(data) {
		var bins = data.rows[0].cdb_headstailsbins;
		cb(bins);
	});
}

function numberInterval(options, callback, endCallback) {

	var options = options || {};

	options = _.extend({
		countTo: 0,
		value: 0,
		duration: 1000
	}, options);

	var num, refreshInterval, steps, step, increment, timeoutId;

	var calculate = function () {
		refreshInterval = 30;
		step = 0;
		timeoutId = null;
		options.countTo = parseFloat(options.countTo) || 0;
		options.value = parseFloat(options.value) || 0;
		options.duration = parseInt(options.duration) || 500;

		steps = Math.ceil(options.duration / refreshInterval);
		increment = ((options.countTo - options.value) / steps);
		num = options.value;
	}

	var tick = function () {
		timeoutId = setTimeout(function () {
			num += increment;
			step++;
			if (step >= steps) {
				clearTimeout(timeoutId);
				num = options.countTo;
				if(typeof endCallback == 'function')
					endCallback(options.countTo);
			} else {
				if(typeof callback == 'function') {
					callback(num, options.countTo);
				}
				tick();
			}
		}, refreshInterval);

	}

	return function (newVal, oldVal) {
		options.countTo = newVal || options.countTo;
		options.value = oldVal || 0;
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
		calculate();
		tick();
	}
}
