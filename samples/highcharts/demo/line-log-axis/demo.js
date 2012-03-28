var chart;
$(document).ready(function() {
	chart = new Highcharts.Chart({
		
		chart: {
			renderTo: 'container'
		},
		
		title: {
			text: 'Logarithmic axis demo'
		},
		
		xAxis: {
			tickInterval: 1
		},
		
		yAxis: {
			type: 'logarithmic',
			minorTickInterval: 0.1
		},
		
		series: [{			
			data: [1, 2, 4, 8, 16, 32, 64, 128, 256, 512],
			pointStart: 1
		}]
	});
});
