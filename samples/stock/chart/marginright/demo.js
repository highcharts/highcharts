$(function() {
	var chart = new Highcharts.StockChart({
	    
	    chart: {
	        renderTo: 'container',
	        borderWidth: 2,
	        marginRight: 100
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