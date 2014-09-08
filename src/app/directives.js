'use strict';

module.exports = function(app) {

	app.directive('homeDataSection', [
		function() {
			return {
				restrict: 'E',
				templateUrl: '/views/partials/home-data-section.html',
				scope: {
					group: '='
				},
				link: function(scope, element, attrs) {
					if(scope.group.abstraction !== '_%') {
						scope.group.maxValue = scope.group.max.value;
					}
					if(scope.group.abstraction == '_pcmh') {
						scope.group.suffix = '/100 mil habitantes';
					}

					element.find('.section-content').height($(window).height());

				}
			}
		}
	]);

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
								'<ng-transclude></ng-transclude>' +
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
						element.find('.percentage').text(num.toFixed(2) + suffix);
					}, function(countTo) {
						element.find('.percentage').text(countTo + suffix);
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

					map.addLayer(L.tileLayer(attrs.baselayer));

					var user = attrs.user || 'infoamazonia';
					var table = attrs.table || 'merge_fiocruz';
					var column =  attrs.column || 'agua_rede_';
					var color = attrs.color || '#ffcc00';

					var sql = new cartodb.SQL({user: user});

					var select = 'SELECT ' + column + ' as value, * FROM ' + table;

					if(attrs.where) {
						select += ' WHERE ' + attrs.where;
					}

					getCartoDBQuantiles(sql, table, column, function(quantiles) {

						sql.getBounds(select).done(function(bounds) {

							map.fitBounds(bounds);

							cartodb.createLayer(map, {
								user_name: user,
								type: 'cartodb',
								sublayers: [{
									sql: select,
									cartocss: getCartoCSS(table, color, quantiles),
									interactivity: attrs.interactivity || 'value'
								}],
								options: {
									tooltip: true
								}
							})
							.addTo(map)
							.done(function(layer) {

								fixMap(map, bounds);

								$rootScope.$on('barItemStartedAnimation', function() {
									fixMap(map, bounds);
								});

								var sublayer = layer.getSubLayer(0);

								attrs.$observe('column', function(column) {

									//update quantiles
									getCartoDBQuantiles(sql, table, column, function(qts) {

										quantiles = qts;

										// set new cartocss
										sublayer.set({'cartocss': getCartoCSS(table, color, quantiles)});

										// update query
										var select = 'SELECT ' + column + ' as value, * FROM ' + table;
										if(attrs.where) {
											select += ' WHERE ' + attrs.where;
										}
										sublayer.set({'sql': select});

									});
								});

								attrs.$observe('color', function(column) {
									sublayer.set({'cartocss': getCartoCSS(table, color, quantiles)});
								});

								sublayer.setInteraction(true);

								layer.on('featureOver', function(event, latlng, pos, data, layerIndex) {
									$rootScope.$broadcast('cartodbFeatureOver', _.extend({id: attrs.id}, data));
								});

								layer.on('featureOut', function(event) {
									$rootScope.$broadcast('cartodbFeatureOver', {id: attrs.id});
								});

							});

						});

					});
				}
			}
		}
	]);

};

function fixMap(map, bounds) {
	map.invalidateSize(true);
	setTimeout(function() {
		map.fitBounds(bounds);
		map.invalidateSize(true);
	}, 100);
}

function getCartoCSS(table, color, quantiles) {

	var cartocss = [
		'#' + table + ' { polygon-fill: ' + color + '; polygon-opacity: 0; }',
		'#' + table + '[ value <= 0 ] { polygon-opacity: 0; }'
	];

	_.each(quantiles, function(qt, i) {
		cartocss.push('#' + table + '[ value >= ' + qt + ' ] { polygon-opacity: 0.' + (i+2) + '; }');
	});

	return cartocss.join(' ');

}

function getCartoDBQuantiles(sql, table, column, cb) {
	sql.execute('SELECT CDB_QuantileBins(array_agg(cast(' + table + '.' + column + ' as numeric)), 7) FROM ' + table + ' WHERE ' + column + ' IS NOT null').done(function(data) {
		cb(data.rows[0].cdb_quantilebins);
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