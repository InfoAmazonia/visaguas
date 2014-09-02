module.exports = {
	dataDir: 'data/',
	data: [
		{
			type: 'condition',
			name: 'abastecimento_rede_geral',
			file:'censo_proporcao_dpp_rede_geral_2010.csv'
		},
		{
			type: 'impact',
			name: 'abastecimento_outras_formas',
			file:'censo_proporcao_dpp_outras_formas_2010.csv'
		},
		{
			type: 'result',
			name: 'amebiase',
			file: 'internacao_amebiase_2012.csv'
		},
		{
			type: 'result',
			name: 'colera',
			file: 'internacao_colera_2012.csv'
		},
		{
			type: 'result',
			name: 'dengue',
			file: 'internacao_dengue_2012.csv'
		},
		{
			type: 'result',
			name: 'esquistossomose',
			file: 'internacao_esquistossomose_2012.csv'
		},
		{
			type: 'result',
			name: 'filariose',
			file: 'internacao_filariose_2012.csv'
		},
		{
			type: 'result',
			name: 'leptospirose',
			file: 'internacao_leptospirose_2012.csv'
		},
		{
			type: 'result',
			name: 'tifoide',
			file: 'internacao_tifoide_2012.csv'
		},
		{
			type: 'result',
			name: 'diarreia',
			file: 'mortalidade_diarreia_5_anos_2011.csv'
		}
	]
};