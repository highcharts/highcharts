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
		var series = chart.series[0];
		if (series.visible) {
			series.hide();
		} else {
			series.show();
		}
	});
});