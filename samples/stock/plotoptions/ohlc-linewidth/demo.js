$(function() {
	$('#container').highcharts('StockChart', {
	    
	    chart: {
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