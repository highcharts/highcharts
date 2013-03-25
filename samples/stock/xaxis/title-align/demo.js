$(function() {
	$('#container').highcharts('StockChart', {
	    
	    chart: {
	    },
	    
	    xAxis: {
	    	title: {
	    		text: 'Date/time',
	    		align: 'high'
	    	}
	    },
	    
	    yAxis: {
	    	title: {
	    		text: 'USD to EUR',
	    		align: 'high'
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