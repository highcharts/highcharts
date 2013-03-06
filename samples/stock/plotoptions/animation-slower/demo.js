$(function() {
	$('#container').highcharts('StockChart', {
	    
	    chart: {
	    },
	    
	    plotOptions: {
	    	series: {
	    		animation: {
	    			duration: 2000
	    		}
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