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

	app.factory('AvailableGroups', [
		function() {

			return [
				{
					name: 'abastecimento',
					abstraction: '_%',
					raw: 'dpp',
					selections: [
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
					]
				},
				{
					name: 'esgoto',
					abstraction: '_%',
					raw: 'dpp',
					selections: [
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
					]
				},
				{
					name: 'doencas',
					abstraction: '_pcmh',
					raw: 'populacao',
					selections: [
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
					]
				}
			];

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
							value = parseFloat(value.toFixed(2));
							if(item.municipio_id) {
								selectionData.push({
									id: item.municipio_id,
									municipio: item.municipio,
									value: value
								});
							} else {
								selectionData.push({
									id: item.id,
									estado: item.estado,
									municipios: item.total_municipios,
									value: value
								});
							}
						});
						this.total = rawTotal/raws[raw];
						if(abstraction == '_%')
							this.total = this.total*100;
						else if(abstraction == '_pcmh')
							this.total = this.total*100*1000;
						this.total = parseFloat(this.total.toFixed(2));
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