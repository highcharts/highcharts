$(function() {
	$('#container').highcharts('StockChart', {
	    
	    chart: {
	    },
	    
	    yAxis: [{}, {
	    	linkedTo: 0,
	    	opposite: true
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