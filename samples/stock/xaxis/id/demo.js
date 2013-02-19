$(function() {
	var chart = $('#container').highcharts('StockChart', {
	    xAxis: {
	    	id: 'x-axis'
	    },
	    rangeSelector: {
	    	selected: 1
	    },
	    series: [{
	        name: 'USD to EUR',
	        data: usdeur
	    }]
	}, null, true);

	// the button action
	$('#button').click(function() {
    	alert('The axis object: '+ chart.get('x-axis'));
	});
});