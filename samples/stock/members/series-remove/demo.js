$(function() {
	var chart = $('#container').highcharts('StockChart', {

	    rangeSelector: {
	    	selected: 1
	    },

	    series: [{
	        name: 'USD to EUR',
	        data: usdeur
	    }]
	}, null, true);

	$('#button').click(function() {
		chart.series[0].remove();
		this.disabled = true;

	});
});