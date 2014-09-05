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

	app.factory('GroupedFilter', [
		function() {

			return function(data, selections, abstraction, raw) {

				abstraction = abstraction || '_%';
				raw = raw || 'dpp';

				var raws = {
					dpp: 0,
					populacao: 0
				};

				angular.forEach(data, function(item) {
					raws.dpp += parseInt(item['domicilios_particulares_permanentes']);
					raws.populacao += parseInt(item['população']);
				});

				var f = {
					data: [],
					total: 0,
					selections: selections,
					selection: selections[0],
					changeSelection: function(selection) {
						this.selection = selection;
						var selectionData = [];
						var rawTotal = 0;
						angular.forEach(data, function(item) {
							rawTotal += parseInt(item[selection.key]);
							var value = parseFloat(item[selection.key + abstraction]);
							if(abstraction == '_%') {
								value = value*100;
							}
							value = value.toFixed(2);
							selectionData.push({
								id: item.id,
								estado: item.estado,
								municipios: item.total_municipios,
								value: value
							});
						});
						this.total = rawTotal/raws[raw];
						if(abstraction == '_%')
							this.total = this.total*100;
						else if(abstraction == '_pcmh')
							this.total = this.total*100*1000;
						this.total = this.total.toFixed(2);
						this.data = selectionData;
						this.max = _.max(this.data, function(item) { return parseFloat(item.value); });
					}
				};

				f.changeSelection(selections[0]);

				return f;

			};

		}
	]);

};