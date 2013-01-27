$(function() {
	var chart = new Highcharts.StockChart({
	    
	    chart: {
	        renderTo: 'container',
	        ignoreHiddenSeries: false 
	    },
	    
	    rangeSelector: {
	    	selected: 1
	    },
	    
	    legend: {
	    	enabled: true
	    },
	    
	    series: [{
	        name: 'GOOGL',
	        data: GOOGL
	    }, {
	        name: 'MSFT',
	        data: MSFT
	    }]
	});
});