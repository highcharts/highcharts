$(function() {
	var chart = new Highcharts.StockChart({
	    
	    chart: {
	        renderTo: 'container'
	    },
	    
	    plotOptions: {
	    	ohlc: {
	    		lineWidth: 2
	    	}
	    },
	    
	    rangeSelector: {
	    	selected: 1
	    },
	    
	    series: [{
	    	type: 'ohlc',
	        name: 'USD to EUR',
	        data: ohlcdata
	    }]
	});
});