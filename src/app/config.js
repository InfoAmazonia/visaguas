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
							'DataService',
							function(Data) {
								return Data.query({query: 'estados'});
							}
						]
					}
				})
				.state('home.filter', {
					url: 'dados/:group/:item/'
				})
				.state('estado', {
					url: '/uf/:id/',
					controller: 'SingleEstadoController',
					templateUrl: '/views/estado/single.html',
					resolve: {
						EstadoData: [
							'$q',
							'$stateParams',
							'DataService',
							function($q, $stateParams, Data) {
								var promises = [];
								var queries = [
									{query: 'estados', id: $stateParams.id},
									{estado_id: $stateParams.id, limit: -1}
								];
								angular.forEach(queries, function(query) {
									promises.push(Data.query(query));
								});
								return $q.all(promises);
							}
						]
					}
				})
				.state('estado.filter', {
					url: ':group/:item/'
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
		'$location',
		'$window',
		function($rootScope, $location, $window) {

			$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState) {

				setTimeout(function() {
					if(fromState.name && (fromState.name !== 'home.filter' && toState.name == 'home.filter') || (fromState.name !== 'estado.filter' &&toState.name == 'estado.filter')) {
						$('html,body').animate({
							scrollTop: $('#data').offset().top - 60
						}, 500);
					} else if(toState.name !== 'home.filter' && toState.name !== 'estado.filter' && (fromState.name || $(window).scrollTop() > $(window).height()-60)) {
						$('html,body').animate({
							scrollTop: $(window).height() - 60
						}, 500);
					}
				}, 200);

			});

			/*
			 * Analytics
			 */
			$rootScope.$on('$stateChangeSuccess', function() {
				if($window._gaq) {
					$window._gaq.push(['_trackPageview', $location.path()]);
				}
			});

		}
	]);

};