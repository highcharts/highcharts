$(function() {
	var chart = new Highcharts.StockChart({
	    
	    chart: {
	        renderTo: 'container'
	    },
	    
	    yAxis: [{}, {
	    	linkedTo: 0,
	    	opposite: true,
	    	labels: {
	    		align: 'right',
	    		x: 0
	    	}
	    }],
	    
	    rangeSelector: {
	    	selected: 1
	    },
	    
	    series: [{
	        name: 'USD to EUR',
	        data: usdeur
	    }]
	});
});