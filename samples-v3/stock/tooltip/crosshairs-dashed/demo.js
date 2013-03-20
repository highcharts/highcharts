$(function() {
	$('#container').highcharts('StockChart', {
	    
	    chart: {
	    },
	    
	    tooltip: {
	    	crosshairs: {
	    		dashStyle: 'dash'
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