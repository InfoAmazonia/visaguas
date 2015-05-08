'use strict';

module.exports = function(app) {

	app.controller('MainCtrl', [
		'$scope',
		'$location',
		function($scope, $location) {
			$scope.iframe = window.self !== window.top;
			$scope.theme = $location.search().theme;

			console.log($scope.theme);
		}
	]);

	app.controller('FiltersController', [
		'ngDialog',
		'$scope',
		function(ngDialog, $scope) {

			$scope.itemDetails = function(group) {

				$scope.detailGroup = group;

				ngDialog.open({
					template: '/views/details.html',
					scope: $scope
				});

			}

		}
	]);

	app.controller('HomeController', [
		'HomeData',
		'AvailableGroups',
		'GroupedFilter',
		'$timeout',
		'$state',
		'$stateParams',
		'$scope',
		function(data, AvailableGroups, GroupedFilter, $timeout, $state, $stateParams, $scope) {

			$scope.iframe = window.self !== window.top;

			$scope.selectGroup = function(group) {

				var useMax = true;
				var suffix = null;

				if(group.abstraction == '_%') {
					useMax = false;
				}

				if(group.abstraction == '_pcmh') {
					suffix = '/100 mil hab.';
				}

				$scope.group = _.extend(group, {
					useMax: useMax,
					suffix: suffix
				});

			}

			$scope.groups = {};

			angular.forEach(AvailableGroups, function(group) {

				$scope.groups[group.name] = _.extend(group, GroupedFilter(data.data, group.selections, group.abstraction, group.raw));

			});

			// Initialize
			$scope.selectGroup({});

			if($state.params.item) {
				var group = _.find($scope.groups, function(group) { return group.name == $state.params.group; });
				group.changeSelection(_.find(group.selections, function(selection) { return selection.key == $state.params.item; }));
				$scope.selectGroup(group);
			} else {
				$timeout(function() {
					$scope.selectGroup($scope.groups.abastecimento);
				}, 50);
			}

			$scope.$watch('group', function(group, prevGroup) {
				if(prevGroup.selection) {
					$state.go('home.filter', { group: group.name, item: group.selection.key });
				}
			}, true);

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

			$scope.accessUF = function(id) {
				$state.go('estado', {id: id});
			}

			$scope.accessUFGroup = function(id, group) {
				$state.go('estado.filter', {id: id, group: group.name, item: group.selection.key });
			}

		}
	]);

	app.controller('SingleEstadoController', [
		'EstadoData',
		'AvailableGroups',
		'GroupedFilter',
		'$timeout',
		'$state',
		'$stateParams',
		'$scope',
		function(data, AvailableGroups, GroupedFilter, $timeout, $state, $stateParams, $scope) {

			$scope.estado = data[0].data[0];

			$scope.order = 'value';

			$scope.changeOrder = function(order) {
				$scope.order = order;
			};

			$scope.selectGroup = function(group) {

				var useMax = true;
				var suffix = null;

				if(group.abstraction == '_%') {
					useMax = false;
				}

				if(group.abstraction == '_pcmh') {
					suffix = '/100 mil hab.';
				}

				$scope.group = _.extend(group, {
					useMax: useMax,
					suffix: suffix
				});

			}

			$scope.groups = {};

			angular.forEach(AvailableGroups, function(group) {

				$scope.groups[group.name] = _.extend(group, GroupedFilter(data[1].data, group.selections, group.abstraction, group.raw));

			});

			// Initialize
			$scope.selectGroup({});

			if($state.params.item) {
				var group = _.find($scope.groups, function(group) { return group.name == $state.params.group; });
				group.changeSelection(_.find(group.selections, function(selection) { return selection.key == $state.params.item; }));
				$scope.selectGroup(group);
			} else {
				$timeout(function() {
					$scope.selectGroup($scope.groups.abastecimento);
				}, 100);
			}

			$scope.goHome = function(group) {
				$state.go('home.filter', { group: group.name, item: group.selection.key });
			};

			$scope.$watch('group', function(group, prevGroup) {
				if(prevGroup.selection) {
					$state.go('estado.filter', { id: $scope.estado.id, group: group.name, item: group.selection.key });
				}
			}, true);

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