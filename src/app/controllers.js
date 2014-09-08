'use strict';

module.exports = function(app) {

	app.controller('HomeController', [
		'HomeData',
		'AvailableGroups',
		'GroupedFilter',
		'$scope',
		function(data, AvailableGroups, GroupedFilter, $scope) {

			angular.forEach(AvailableGroups, function(group) {

				$scope[group.name] = _.extend(group, GroupedFilter(data.data, group.selections, group.abstraction, group.raw));

				$scope[group.name].title = group.title;
				$scope[group.name].name = group.name;
				$scope[group.name].color = group.color;

				$scope.$on('cartodbFeatureOver', function(event, data) {
					if(data.id == group.name && data.value) {
						if(group.abstraction == '_%') {
							data.value = (data.value*100).toFixed(2) + '%';
						}
						$scope.$apply(function() {
							$scope[group.name].map = data;
						});
					} else {
						$scope.$apply(function() {
							$scope[group.name].map = false;
						});
					}
				});

				$scope.$on('cartodbFeatureOut', function(event, data) {
					if(data.id == group.name) {
						$scope.$apply(function() {
							$scope[group.name].map = false;
						});
					}
				});

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

			$scope.map = {};

			$scope.$on('cartodbFeatureOver', function(event, data) {
				if(data.id == 'map') {
					data.value = (data.value*100).toFixed(2);
					$scope.$apply(function() {
						$scope.map = data;
					});
				}
			});

			$scope.$on('cartodbFeatureOut', function(event, data) {
				if(data.id == 'map') {
					$scope.$apply(function() {
						$scope.map = {};
					});
				}
			});

			$scope.estado = data[0].data[0];

			angular.forEach(AvailableGroups, function(group) {
				$scope[group.name] = GroupedFilter(data[1].data, group.selections, group.abstraction, group.raw);
			});

		}
	]);

};