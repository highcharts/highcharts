$(function() {
	var chart = new Highcharts.StockChart({
	    
	    chart: {
	        renderTo: 'container'
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