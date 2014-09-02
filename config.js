module.exports = {
	dataDir: 'data/',
	data: [
		{
			type: 'condition',
			name: 'saneamento',
			file:'censo_proporcao_dpp_poco_nascente_2010.csv'
		},
		{
			type: 'impact',
			name: 'saa',
			file: 'percentual_saa_sem_tratamento_2010.csv'
		},
		{
			type: 'impact',
			name: 'sac',
			file: 'percentual_sac_2010.csv'
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