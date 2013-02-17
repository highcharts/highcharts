$(function() {
	$('#container').highcharts('StockChart', {
	    
	    chart: {
	    },
	    
	    xAxis: {
	    	labels: {
	    		enabled: false
	    	}
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