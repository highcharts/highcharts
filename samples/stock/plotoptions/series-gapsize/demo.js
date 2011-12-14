$(function() {
	var chart = new Highcharts.StockChart({
	    
	    chart: {
	        renderTo: 'container'
	    },
	    
	    rangeSelector: {
	    	selected: 1
	    },
	    
	    plotOptions: {
	    	line: {
	    		gapSize: 2
	    	}
	    },
	    
	    series: [{
	        name: 'USD to EUR',
	        data: usdeur
	    }]
	});
});