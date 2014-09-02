'use strict';

angular.module('visaguas', [
	'ui.router'
])

.config([
	'$stateProvider',
	'$urlRouterProvider',
	'$locationProvider',
	function($stateProvider, $urlRouterProvider, $locationProvider) {

		$locationProvider.html5Mode(true);
		$locationProvider.hashPrefix('!');

		$stateProvider
			.state('home', {
				url: '/',
				controller: 'HomeController',
				templateUrl: '/views/pages/home.html',
				resolve: {
					HomeData: [
						'$q',
						'DataService',
						function($q, Data) {
							var promises = [];
							var queries = [
								{name: 'saneamento', order: 'DESC'},
								{name: 'sac'},
								{name: 'saa'}
							];
							angular.forEach(queries, function(query) {
								promises.push(Data.query(query));
							});
							return $q.all(promises);
						}
					]
				}
			})
			.state('city', {
				url: '/cidades/:ibgeCode/',
				controller: 'SingleCityController',
				templateUrl: '/views/city/index.html',
				resolve: {
					CityData: [
						'$stateParams',
						'DataService',
						function($stateParams, Data) {
							return Data.query({ibgeCode: $stateParams.ibgeCode});
						}
					]
				}
			});

		/*
		 * Trailing slash rule
		 */
		$urlRouterProvider.rule(function($injector, $location) {
			var path = $location.path(),
				search = $location.search(),
				params;

			// check to see if the path already ends in '/'
			if (path[path.length - 1] === '/') {
				return;
			}

			// If there was no search string / query params, return with a `/`
			if (Object.keys(search).length === 0) {
				return path + '/';
			}

			// Otherwise build the search string and return a `/?` prefix
			params = [];
			angular.forEach(search, function(v, k){
				params.push(k + '=' + v);
			});
			
			return path + '/?' + params.join('&');
		});

	}
])

.factory('DataService', [
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
])

.controller('HomeController', [
	'HomeData',
	'$scope',
	function(data, $scope) {
		$scope.items = data;
	}
])

.controller('CityController', [
	'$state',
	'$scope',
	function($state, $scope) {

		$scope.accessCity = function(data) {
			$state.go('city', {ibgeCode: data.ibgeCode});
		}

	}
])

.controller('SingleCityController', [
	'CityData',
	'$scope',
	function(data, $scope) {
		$scope.city = data.data[0].city;
		$scope.data = {};
		angular.forEach(data.data, function(item) {
			$scope.data[item.name] = item.value;
		});
	}
]);

angular.bootstrap(document, ['visaguas']);

$(document).ready(function() {

	$(window).scroll(function() {

		if($(window).scrollTop() >= $(window).height() - 60) {
			$('html').css({'padding-top': $(window).height()});
			$('#masthead').addClass('fixed');
		} else {
			$('html').css({'padding-top': '0'});
			$('#masthead').removeClass('fixed');
		}

	});

});