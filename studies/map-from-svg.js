var presets = [{
	name: '',
	url: ''
}, { 
	name: 'World1',
	url: 'http://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg'
}, {
	name: 'World2',
	url: 'http://upload.wikimedia.org/wikipedia/commons/7/76/World_V2.0.svg'
}, {
	name: 'Brazil',
	url: 'http://www.clker.com/cliparts/O/m/Y/9/h/X/mapa-brasil-rio-de-janeiro.svg'
}, {
	name: 'Canada',
	url: 'http://upload.wikimedia.org/wikipedia/commons/3/38/Canada_blank_map.svg'
}, {
	name: 'Germany',
	url: 'http://upload.wikimedia.org/wikipedia/commons/2/2c/Karte_Bundesrepublik_Deutschland.svg'
}, {
	name: 'Netherlands',
	url: 'http://upload.wikimedia.org/wikipedia/commons/b/bb/Carte_des_Pays-Bas_%28netherlands%29_without_names.svg'
}, {
	name: 'Norway',
	url: 'http://upload.wikimedia.org/wikipedia/commons/8/87/Norwegian_parliamentary_election_2009_map_KrF_reps.svg'
}, {
	name: 'Australia',
	url: 'http://upload.wikimedia.org/wikipedia/commons/c/c2/Australia_states_blank.svg'
}, {
	name: 'Europe',
	url: 'http://upload.wikimedia.org/wikipedia/commons/2/25/BlankMap-Europe.svg'
}, {
	name: 'Africa',
	url: 'http://upload.wikimedia.org/wikipedia/commons/f/f9/BlankMap-Africa.svg'
}, {
	name: 'South-America',
	url: 'http://upload.wikimedia.org/wikipedia/commons/b/b0/Southamerica_blank.svg'
}, {
	name: 'USA',
	url: 'http://upload.wikimedia.org/wikipedia/commons/3/32/Blank_US_Map.svg'
}, {
	name: 'France',
	url: 'http://upload.wikimedia.org/wikipedia/commons/3/3c/Carte_vierge_d%C3%A9partements_fran%C3%A7ais_avec_DOM.svg'
}, {
	name: 'Spain',
	url: 'http://upload.wikimedia.org/wikipedia/commons/5/5a/Provinces_of_Spain.svg'
}, {
	name: 'Sogn-og-Fjordane-Norway',
	url: 'http://upload.wikimedia.org/wikipedia/commons/4/4f/NO_1417_Vik.svg'
}, {
	name: 'Poland',
	url: 'http://www.highcharts.com/maps/maps/Poland.svg'
}, {
	name: 'Sweden',
	url: 'http://www.highcharts.com/maps/maps/Sweden.svg'
}];

var defaultSeriesSetup = [{
	name: 'Areas',
	type: 'map',
	enableMouseTracking: true,
	showInLegend: true,
	rules: [{
		key: 'fill',
		operator: 'is-not',
		value: 'none'
	}]
}]
			


$(function() {
	var $preset = $('#preset')
		.change(function () {
			runPreset($preset[0].selectedIndex);
		});

	function runPreset(index) {
		var preset = presets[index];

		$preset[0].selectedIndex = index;
		$('#load')[0].value = preset.url;
		location.hash = '#' + preset.name;
		runChart();
	}

	function runChart() {
		drawMap('Online SVG', $('#load')[0].value);
	}
	
	// Build the links
	for (var i = 0; i < presets.length; i++) {
		$a = $('<option>' + presets[i].name + '</option>')
			.appendTo($preset);
	}
	
	if (location.hash) {
		for (var i = 0; i < presets.length; i++) {
			if (location.hash === '#' + presets[i].name) {
				runPreset(i);
			}
		}
	}
	$(location.hash ? location.hash + '_' : '#_World2_').click();
	
	$('#load-submit').click(runChart);
});