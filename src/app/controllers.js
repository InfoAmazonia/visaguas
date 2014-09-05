'use strict';

module.exports = function(app) {

	app.controller('HomeController', [
		'HomeData',
		'AvailableGroups',
		'GroupedFilter',
		'$scope',
		function(data, AvailableGroups, GroupedFilter, $scope) {

			angular.forEach(AvailableGroups, function(group) {
				$scope[group.name] = GroupedFilter(data.data, group.selections, group.abstraction, group.raw);
			});

		}
	]);

	app.controller('EstadoController', [
		'$state',
		'$scope',
		function($state, $scope) {

			$scope.accessState = function(id) {
				$state.go('estado', {id: id});
			}

		}
	]);

	app.controller('SingleEstadoController', [
		'EstadoData',
		'AvailableGroups',
		'GroupedFilter',
		'$scope',
		function(data, AvailableGroups, GroupedFilter, $scope) {

			$scope.estado = data[0].data[0];

			angular.forEach(AvailableGroups, function(group) {
				$scope[group.name] = GroupedFilter(data[1].data, group.selections, group.abstraction, group.raw);
			});

		}
	]);

};