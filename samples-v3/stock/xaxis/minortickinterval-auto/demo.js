$(function() {
	$('#container').highcharts('StockChart', {
	    
	    chart: {
	    },
	    
	    yAxis: {
	    	minorTickInterval: 'auto'
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