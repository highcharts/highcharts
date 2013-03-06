$(function() {
	$('#container').highcharts('StockChart', {
	    
	    chart: {
	    },
	    
	    navigator: {
	    	outlineColor: 'blue',
	    	outlineWidth: 2
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