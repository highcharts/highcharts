$(function() {
	var chart = new Highcharts.Chart({

		chart: {
			renderTo: 'container'
		},

	    rangeSelector: {
	    	selected: 1
	    },

	    series: [{
	        name: 'USD to EUR',
	        data: usdeur
	    }]
	});
});