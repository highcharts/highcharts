$(function() {
	var chart = new Highcharts.StockChart({
	    
	    chart: {
	        renderTo: 'container',
	        plotBorderWidth: 1
	    },
	    
	    rangeSelector: {
	    	selected: 1
	    },
	    
	    yAxis: {
	    	startOnTick: false,
	    	endOnTick: false
	    },
	    
	    series: [{
	        name: 'USD to EUR',
	        data: usdeur
	    }]
	});
});