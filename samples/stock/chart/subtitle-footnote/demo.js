$(function() {
	$('#container').highcharts('StockChart', {
	    
	    chart: {
	    },
	    
	    subtitle: {
        	text: '* Footnote',
        	align: 'right',
        	x: -10
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