'use strict';

module.exports = function(app) {

	app.factory('DataService', [
		'$http',
		'$q',
		function($http, $q) {

			var load = function(query, cb) {

				query = query || {};

				$http({
					method: 'GET',
					url: '/api',
					params: query
				}).success(function(data) {
					cb(data);
				});

			}

			return {
				query: function(query) {
					var deferred = $q.defer();
					load(query, function(data) {
						deferred.resolve(data);
					});
					return deferred.promise;
				}
			}

		}
	]);

};