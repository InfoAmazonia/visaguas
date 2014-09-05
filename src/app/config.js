'use strict';

module.exports = function(app) {

	app.config([
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
								return Data.query({query: 'estados'});
							}
						]
					}
				})
				.state('city', {
					url: '/cidades/:ibge/',
					controller: 'SingleCityController',
					templateUrl: '/views/city/index.html',
					resolve: {
						CityData: [
							'$stateParams',
							'DataService',
							function($stateParams, Data) {
								return Data.query({ibge: $stateParams.ibge});
							}
						]
					}
				})
				.state('estado', {
					url: '/uf/:id/',
					controller: 'SingleEstadoController',
					templateUrl: '/views/estado/single.html',
					resolve: {
						EstadoData: [
							'$stateParams',
							'DataService',
							function($stateParams, Data) {
								return Data.query({estado_id: $stateParams.id});
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
	]);

	app.run([
		'$rootScope',
		function($rootScope) {

			$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState) {

				setTimeout(function() {
					if($(window).scrollTop() > $(window).height()-60 || !(!fromState.name && toState.url == '/')) {
						$('html,body').animate({
							scrollTop: $(window).height() - 60
						}, 500);
					}
				}, 200);

			});

		}
	]);

};