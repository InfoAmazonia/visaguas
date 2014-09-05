'use strict';

module.exports = function(app) {

	app.filter('hideEmpty', [
		function() {
			return function(input, key) {
				if(key) {
					return _.filter(input, function(item) { return item[key]; });
				}
				return input;
			}
		}
	]);

}