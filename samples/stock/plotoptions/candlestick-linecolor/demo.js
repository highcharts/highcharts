$(function() {
	$('#container').highcharts('StockChart', {
	    
	    chart: {
	    },
	    
	    plotOptions: {
	    	candlestick: {
	    		lineColor: 'red'
	    	}
	    },
	    
	    rangeSelector: {
	    	selected: 1
	    },
	    
	    series: [{
	    	type: 'candlestick',
	        name: 'USD to EUR',
	        data: ohlcdata
	    }]
	});
});