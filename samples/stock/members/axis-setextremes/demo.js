$(function() {
	$('#container').highcharts('StockChart', {
	    
	    chart: {
	    },
	    
	    rangeSelector: {
	    	selected: 1
	    },
	    
	    series: [{
	        name: 'USD to EUR',
	        data: usdeur
	    }]
	});
	
	$('#button').click(function() {
		chart.xAxis[0].setExtremes(
			Date.UTC(2007, 0, 1),
			Date.UTC(2007, 11, 31)
		);
	});
});