'use strict';

module.exports = function(app) {

	app.controller('HomeController', [
		'HomeData',
		'GroupedFilter',
		'$scope',
		function(data, GroupedFilter, $scope) {

			var abastecimentoSelections = [
				{
					name: 'Rede geral',
					key: 'agua_rede_geral',
					text: 'abastecimento de água pela rede geral'
				},
				{
					name: 'Poço ou nascente',
					key: 'agua_poco_nascente',
					text: 'abastecimento de água por poço ou nascente'
				},
				{
					name: 'Chuva armazenada em cisterna',
					key: 'agua_cisterna',
					text: 'abastecimento de água por chuva armazenada em cisterna'
				},
				{
					name: 'Outras formas',
					key: 'agua_outras',
					text: 'abastecimento de água por outras formas'
				}
			];
			$scope.abastecimento = GroupedFilter(data.data, abastecimentoSelections);

			var esgotoSelections = [
				{
					name: 'Rede geral',
					key: 'esgoto_rede_geral',
					text: 'acesso a esgoto pela rede geral'
				},
				{
					name: 'Fossa séptica',
					key: 'esgoto_fossa_septica',
					text: 'acesso a esgoto via fossa séptica'
				},
				{
					name: 'Fossa rudimentar',
					key: 'esgoto_fossa_rudimentar',
					text: 'acesso a esgoto via fossa rudimentar'
				},
				{
					name: 'Vala',
					key: 'esgoto_vala',
					text: 'acesso a esgoto por vala'
				},
				{
					name: 'Rio, lago ou mar',
					key: 'esgoto_rio_lago_mar',
					text: 'acesso a esgoto via rio, lago ou mar'
				},
				{
					name: 'Outro',
					key: 'esgoto_outros',
					text: 'acesso a esgoto por outras formas'
				}
			];
			$scope.esgoto = GroupedFilter(data.data, esgotoSelections);

			var doencasSelections = [
				{
					name: 'Amebíase',
					key: 'amebiase'
				},
				{
					name: 'Cólera',
					key: 'colera'
				},
				{
					name: 'Dengue',
					key: 'dengue'
				},
				{
					name: 'Esquistossomose',
					key: 'esquistossomose'
				},
				{
					name: 'Filariose',
					key: 'filariose'
				},
				{
					name: 'Leptospirose',
					key: 'leptospirose'
				},
				{
					name: 'Febre tifóide',
					key: 'tifoide'
				}
			];
			$scope.doencas = GroupedFilter(data.data, doencasSelections, '_pcmh', 'populacao');

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
		'$scope',
		function(data, $scope) {

			console.log(data);

			$scope.title = data.data[0].estado;

		}
	]);

};