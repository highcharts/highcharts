$(function() {
	$('#container').highcharts('StockChart', {
	    
	    chart: {
	        reflow: false
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