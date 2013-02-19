$(function() {
	var chart = $('#container').highcharts('StockChart', {

	    chart: {
	    },

	    rangeSelector: {
	    	selected: 1
	    },

	    series: [{
	        name: 'USD to EUR',
	        data: usdeur
	    }]
	}, null, true);

	$('#button').click(function() {
		chart.print();
	});
});