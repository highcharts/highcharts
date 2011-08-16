$(function() {
	var chart = new Highcharts.StockChart({
	    
	    chart: {
	        renderTo: 'container',
	        marginLeft: 50
	    },
	    
	    title: {
    	    text: 'My custom title',
        	align: 'left',
        	x: 40	
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