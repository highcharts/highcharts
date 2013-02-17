$(function() {
	$('#container').highcharts('StockChart', {
	    
	    chart: {
	    },
	    
	    xAxis: {
	    	title: {
	    		text: 'Date/time'
	    	}
	    },
	    
	    yAxis: {
	    	title: {
	    		text: 'USD to EUR'
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