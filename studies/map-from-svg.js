



var presets = [{
	name: '',
	url: ''
}, { 
	name: '----- Global ------'
}, {
	name: 'Africa',
	url: 'http://upload.wikimedia.org/wikipedia/commons/f/f9/BlankMap-Africa.svg'
}, {
	name: 'Europe',
	url: 'http://upload.wikimedia.org/wikipedia/commons/2/25/BlankMap-Europe.svg'
}, { 
	name: 'World',
	url: 'http://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg'
}, {
	name: '----- Countries ------'
}, {
	name: 'Australia',
	url: 'http://upload.wikimedia.org/wikipedia/commons/c/c2/Australia_states_blank.svg'
}, {
	name: 'Belgium',
	url: 'http://upload.wikimedia.org/wikipedia/commons/3/3d/Belgium_Provinces_map-blank.svg'
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
	name: 'France',
	url: 'http://upload.wikimedia.org/wikipedia/commons/3/3c/Carte_vierge_d%C3%A9partements_fran%C3%A7ais_avec_DOM.svg'
}, {
	name: 'Netherlands',
	url: 'http://upload.wikimedia.org/wikipedia/commons/b/bb/Carte_des_Pays-Bas_%28netherlands%29_without_names.svg'
}, {
	name: 'Norway',
	url: 'http://upload.wikimedia.org/wikipedia/commons/8/87/Norwegian_parliamentary_election_2009_map_KrF_reps.svg'
}, {
	name: 'Poland',
	url: 'http://www.highcharts.com/maps/maps/Poland.svg'
}, {
	name: 'South-America',
	url: 'http://upload.wikimedia.org/wikipedia/commons/b/b0/Southamerica_blank.svg'
}, {
	name: 'Spain',
	url: 'http://upload.wikimedia.org/wikipedia/commons/5/5a/Provinces_of_Spain.svg'
}, {
	name: 'Sweden',
	url: 'http://www.highcharts.com/maps/maps/Sweden.svg'
}, {
	name: 'USA-states',
	url: 'http://upload.wikimedia.org/wikipedia/commons/3/32/Blank_US_Map.svg'
}, {
	name: 'USA-counties',
	url: 'http://upload.wikimedia.org/wikipedia/commons/5/5f/USA_Counties_with_FIPS_and_names.svg'
}, {
	name: '----- Regions ------'
}, {
	name: 'Sogn-og-Fjordane-Norway',
	url: 'http://upload.wikimedia.org/wikipedia/commons/4/4f/NO_1417_Vik.svg'
}];

$(function() {
	$.getJSON('/maps/list.json.php', function (localFiles) {

		var $preset = $('#preset')
			.change(function () {
				runPreset($preset[0].selectedIndex);
			});

		function runPreset(index) {
			var preset = presets[index];

			$preset[0].selectedIndex = index;

			if (preset && preset.url) {
				$('#load')[0].value = preset.url;
				location.hash = '#' + preset.url;
				runChart();
			} else if (!preset) { // local files
				
				$('#load')[0].value = 'http://' + location.host + '/maps/' + $preset.children()[index].value;
				runChart('Local file');
			}
		}

		function runChart() {
			drawMap('Highcharts map from SVG', $('#load')[0].value);
		}
		
		// Build the links
		for (var i = 0; i < presets.length; i++) {
			$('<option>' + presets[i].name + '</option>')
				.appendTo($preset);
		}
		// Build the links
		for (var i = 0; i < localFiles.length; i++) {
			if (i === 0) {
				$('<option>----- Local files ----</option>')
					.appendTo($preset);
			}
			$('<option>' + localFiles[i] + '</option>')
				.appendTo($preset);
		}
		
		if (location.hash) {
			for (var i = 0; i < presets.length; i++) {
				if (location.hash === '#' + presets[i].url) {
					runPreset(i);
				}
			}
			if (i === presets.length) {
				$('#load')[0].value = location.hash.replace(/^#/, '');
				runChart('Online file');
			}
		}
		
		$('#load-submit').click(runChart);
	});
});