$(function() {
	var chart = new Highcharts.StockChart({
	    
	    chart: {
	        renderTo: 'container',
	        backgroundColor: {
	            linearGradient: [0, 0, 500, 500],
	            stops: [
	                [0, 'rgb(255, 255, 255)'],
	                [1, 'rgb(200, 200, 255)']
	            ]
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