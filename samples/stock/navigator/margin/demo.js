$(function() {
	$('#container').highcharts('StockChart', {
	    
	    chart: {
	    },
	    
	    navigator: {
	    	margin: 2
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