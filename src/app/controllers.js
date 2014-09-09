'use strict';

module.exports = function(app) {

	app.controller('HomeController', [
		'HomeData',
		'AvailableGroups',
		'GroupedFilter',
		'$state',
		'$stateParams',
		'$scope',
		function(data, AvailableGroups, GroupedFilter, $state, $stateParams, $scope) {

			$scope.groups = {};

			angular.forEach(AvailableGroups, function(group) {

				$scope.groups[group.name] = _.extend(group, GroupedFilter(data.data, group.selections, group.abstraction, group.raw));

			});

			$scope.selectGroup = function(group) {

				$scope.group = group;

				if(group.abstraction !== '_%') {
					group.useMax = true;
				} else {
					group.useMax = false;
				}
				if(group.abstraction == '_pcmh') {
					group.suffix = '/100 mil hab.';
				}

			}

			$scope.$watch('group.name', function(groupName, prevGroup) {
				if(prevGroup) {
					//$state.go('home.filter', { group: groupName });
				}
			});

			$scope.$watch('group.selection.key', function(selectionKey, prevSelection) {
				if(prevSelection) {
					//$state.go('home.filter', { group: $scope.group.name, item: selectionKey });
				}
			});

			$scope.selectGroup($scope.groups.abastecimento);

			$scope.map = false;

			$scope.$on('cartodbFeatureOver', function(event, data) {
				var group = _.find($scope.groups, function(g) { return g.name == data.id; });
				if(group) {
					if(data.value) {
						if(group.abstraction == '_%') {
							data.value = (data.value*100).toFixed(2) + '%';
						}
						$scope.$apply(function() {
							$scope.map = data;
						});
					} else {
						$scope.$apply(function() {
							$scope.map = false;
						});
					}
				}
			});

			$scope.$on('cartodbFeatureOut', function(event, data) {
				$scope.$apply(function() {
					$scope.map = false;
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

			$scope.estado = data[0].data[0];

			$scope.groups = {};

			angular.forEach(AvailableGroups, function(group) {

				$scope.groups[group.name] = _.extend(group, GroupedFilter(data[1].data, group.selections, group.abstraction, group.raw));

			});

			$scope.selectGroup = function(group) {

				$scope.group = group;

				if(group.abstraction !== '_%') {
					group.useMax = true;
				} else {
					group.useMax = false;
				}
				if(group.abstraction == '_pcmh') {
					group.suffix = '/100 mil hab.';
				}

			}

			$scope.selectGroup($scope.groups.abastecimento);

			$scope.map = false;

			$scope.$on('cartodbFeatureOver', function(event, data) {
				var group = _.find($scope.groups, function(g) { return g.name == data.id; });
				if(group) {
					if(data.value) {
						if(group.abstraction == '_%') {
							data.value = (data.value*100).toFixed(2) + '%';
						}
						$scope.$apply(function() {
							$scope.map = data;
						});
					} else {
						$scope.$apply(function() {
							$scope.map = false;
						});
					}
				}
			});

			$scope.$on('cartodbFeatureOut', function(event, data) {
				$scope.$apply(function() {
					$scope.map = false;
				});
			});

		}
	]);

};