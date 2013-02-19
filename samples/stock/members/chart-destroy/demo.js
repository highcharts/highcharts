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
		$('#container').highcharts().destroy();
	});
});