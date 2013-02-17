$(function() {
	$('#container').highcharts('StockChart', {
	    
	    chart: {
	        type: 'areaspline'
	    },
	    
	    rangeSelector: {
	    	selected: 1
	    },
	    
	    series: [{
	        name: 'USD to EUR',
	        data: usdeur,
	        threshold: null // default is 0
	    }]
	});
});