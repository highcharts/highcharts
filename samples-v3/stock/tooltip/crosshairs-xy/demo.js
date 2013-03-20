$(function() {
	$('#container').highcharts('StockChart', {
	    
	    chart: {
	    },
	    
	    tooltip: {
	    	crosshairs: [true, true]
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