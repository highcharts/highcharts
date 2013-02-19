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
		chart.xAxis[0].setExtremes(
			Date.UTC(2007, 0, 1),
			Date.UTC(2007, 11, 31)
		);
	});
});