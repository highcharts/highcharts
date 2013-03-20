$(function() {
	$('#container').highcharts('StockChart', {
	    
	    chart: {
	    },
	    
	    scrollbar: {
	    	enabled: false
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