'use strict';

module.exports = function(app) {

	app.controller('HomeController', [
		'HomeData',
		'$scope',
		function(data, $scope) {

			$scope.items = data;

			$scope.redeGeral = data[0];
			$scope.outros = data[2];

			$scope.estados = {
				redeGeral: data[1],
				outros: data[3]
			};
		}
	]);

	app.controller('CityController', [
		'$state',
		'$scope',
		function($state, $scope) {

			$scope.accessCity = function(data) {
				$state.go('city', {ibge: data.ibge});
			}

		}
	]);

	app.controller('SingleCityController', [
		'CityData',
		'$scope',
		function(data, $scope) {
			$scope.cidade = data.data[0].cidade;
			$scope.data = {};
			angular.forEach(data.data, function(item) {
				if(item.valor != undefined) {
					$scope.data[item.name] = item.valor;
				}
			});
		}
	]);

};