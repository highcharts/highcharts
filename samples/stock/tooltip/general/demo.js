$(function() {
	var chart = new Highcharts.StockChart({
	    
	    chart: {
	        renderTo: 'container'
	    },
	    
	    tooltip: {
	    	backgroundColor: {
	    		linearGradient: [0, 0, 0, 100],
	    		stops: [
	    			[0, 'white'],
	    			[1, 'silver']
	    		]
	    	},
	    	borderColor: 'gray',
	    	borderWidth: 1
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