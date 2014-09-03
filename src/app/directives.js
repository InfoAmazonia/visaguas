'use strict';

module.exports = function(app) {

	app.directive('d3Chart', function() {
		return {
			restrict: 'E',
			scope: {
				data: '=',
				color: '=',
				type: '='
			},
			link: function(scope, element, attrs) {

				console.log(element);

			}
		}
	})

};