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

	app.directive('map', [
		function() {
			return {
				restrict: 'E',
				link: function(scope, element, attrs) {
					var map = L.map(element[0], {center: [-2,-2], zoom: 4});

					var column = 'agua_rede_';

					var sql = new cartodb.SQL({user: 'infoamazonia'});

					var quantiles;
					var cartocss = [
						'#merge_fiocruz { polygon-fill: #ffcc00; polygon-opacity: 0; }',
						'#merge_fiocruz[ data <= 0 ] { polygon-opacity: 0; }'
					];

					sql
						.execute('SELECT CDB_QuantileBins(array_agg(cast(merge_fiocruz.' + column + ' as numeric)), 7) FROM merge_fiocruz WHERE ' + column + ' IS NOT null')
						.done(function(data) {

							quantiles = data.rows[0].cdb_quantilebins;

							_.each(quantiles, function(qt, i) {
								cartocss.push('#merge_fiocruz[ data <= ' + qt + ' ] { polygon-opacity: 0.' + (i+2) + '; }');
							});

							cartodb.createLayer(map, {
								user_name: 'infoamazonia',
								type: 'cartodb',
								sublayers: [{
									sql: 'SELECT ' + column + ' as data, * FROM merge_fiocruz WHERE estado_id IS NOT NULL',
									cartocss: cartocss.join(' ')
								}]
							})
							.addTo(map);

						});

					//cartodb.createVis(element[0], 'http://infoamazonia.cartodb.com/api/v2/viz/113859a0-3538-11e4-98be-0edbca4b5057/viz.json');
				}
			}
		}
	]);

	app.directive('barItem', [
		function() {
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
						element.append(clone);
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
						}
					};
					animate();
					$(window).scroll(animate);

				}
			}
		}
	]);

};

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