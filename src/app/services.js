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
				}).then(function(data) {
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
					title: 'Abastecimento de água',
					name: 'abastecimento',
					abstraction: '_%',
					raw: 'dpp',
					color: '#0000ff',
					measureDesc: 'Medição por porcentagem de domicílios particulares permanentes',
					selections: [
						{
							name: 'Rede geral',
							key: 'agua_rede_geral',
							mapKey: 'agua_rede_',
							text: 'das residências com abastecimento de água pela rede geral',
							desc: 'Quando o domicílio ou o terreno, ou a propriedade onde estava localizado, estava ligado a uma rede geral de distribuição de água.'
						},
						{
							name: 'Poço ou nascente',
							key: 'agua_poco_nascente',
							mapKey: 'agua_poco_',
							text: 'das residências com abastecimento de água por poço ou nascente',
							desc: 'Quando o domicílio era servido por água proveniente de poço ou nascente localizado no terreno ou na propriedade onde estava construído.'
						},
						{
							name: 'Chuva armazenada em cisterna',
							key: 'agua_cisterna',
							mapKey: 'agua_ciste',
							text: 'das residências com abastecimento de água por chuva armazenada em cisterna',
							desc: 'Quando o domicílio era servido por água de chuva armazenada em cisterna, caixa de cimento etc.'
						},
						{
							name: 'Outras formas',
							key: 'agua_outras',
							mapKey: 'agua_outra',
							text: 'das residências com abastecimento de água por outras formas',
							desc: 'Quando a forma de abastecimento de água do domicílio era proveniente de poço ou nascente fora da propriedade, carro-pipa, água da chuva armazenada de outra forma, rio, açude, lago ou igarapé ou outra forma de abastecimento de água, diferente das descritas anteriormente.'
						}
					]
				},
				{
					title: 'Acesso a esgoto',
					name: 'esgoto',
					abstraction: '_%',
					raw: 'dpp',
					color: '#ff0000',
					measureDesc: 'Medição por porcentagem de domicílios particulares permanentes',
					selections: [
						{
							name: 'Rede geral',
							key: 'esgoto_rede_geral',
							mapKey: 'esgoto_red',
							text: 'das residências com acesso a esgoto pela rede geral',
							desc: 'Quando a canalização das águas servidas e dos dejetos, proveniente do banheiro ou sanitário, estava ligada a um sistema de coleta que os conduzia a um desaguadouro geral da área, região ou município, mesmo que o sistema não dispusesse de estação de tratamento da matéria esgotada.'

						},
						{
							name: 'Fossa séptica',
							key: 'esgoto_fossa_septica',
							mapKey: 'esgoto_fos',
							text: 'das residências com acesso a esgoto via fossa séptica',
							desc: 'Quando a canalização do banheiro ou sanitário estava ligada a uma fossa séptica, ou seja, a matéria era esgotada para uma fossa próxima, onde passava por um processo de tratamento ou decantação, sendo, ou não, a parte líquida conduzida em seguida para um desaguadouro geral da área, região ou município.'
						},
						{
							name: 'Fossa rudimentar',
							key: 'esgoto_fossa_rudimentar',
							mapKey: 'esgoto_f_1',
							text: 'das residências com acesso a esgoto via fossa rudimentar',
							desc: 'Quando o banheiro ou sanitário estava ligado a uma fossa rústica (fossa negra, poço, buraco, etc.).'
						},
						{
							name: 'Vala',
							key: 'esgoto_vala',
							mapKey: 'esgoto_val',
							text: 'das residências com acesso a esgoto por vala',
							desc: 'Quando o banheiro ou sanitário estava ligado diretamente a uma vala a céu aberto.'
						},
						{
							name: 'Rio, lago ou mar',
							key: 'esgoto_rio_lago_mar',
							mapKey: 'esgoto_rio',
							text: 'das residências com acesso a esgoto via rio, lago ou mar',
							desc: 'Quando o banheiro ou sanitário estava ligado diretamente a rio, lago ou mar.'
						},
						{
							name: 'Outro',
							key: 'esgoto_outros',
							mapKey: 'esgoto_out',
							text: 'das residências com acesso a esgoto por outras formas',
							desc: 'Quando o esgotamento dos dejetos, proveniente do banheiro ou sanitário, não se enquadrasse em quaisquer dos tipos descritos anteriormente.'
						}
					]
				},
				{
					title: 'Doenças',
					name: 'doencas',
					abstraction: '_pcmh',
					raw: 'populacao',
					color: '#ffcc00',
					measureDesc: 'Medição por internações por 100 mil habitantes',
					selections: [
						{
							name: 'Amebíase',
							key: 'amebiase',
							mapKey: 'amebiase_p',
							text: 'internações por 100 mil habitantes'
						},
						{
							name: 'Cólera',
							key: 'colera',
							mapKey: 'colera_pcm',
							text: 'internações por 100 mil habitantes'
						},
						{
							name: 'Dengue',
							key: 'dengue',
							mapKey: 'dengue_pcm',
							text: 'internações por 100 mil habitantes'
						},
						{
							name: 'Esquistossomose',
							key: 'esquistossomose',
							mapKey: 'esquistoss',
							text: 'internações por 100 mil habitantes'
						},
						{
							name: 'Filariose',
							key: 'filariose',
							mapKey: 'filariose',
							text: 'internações por 100 mil habitantes'
						},
						{
							name: 'Leptospirose',
							key: 'leptospirose',
							mapKey: 'leptospiro',
							text: 'internações por 100 mil habitantes'
						},
						{
							name: 'Febre tifóide',
							key: 'tifoide',
							mapKey: 'tifoide',
							text: 'internações por 100 mil habitantes'
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
