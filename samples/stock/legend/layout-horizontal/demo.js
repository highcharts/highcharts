$(function() {
	$('#container').highcharts('StockChart', {
	    
	    chart: {
	    },
	    
	    legend: {
	    	enabled: true
	    },
	    
	    rangeSelector: {
	    	selected: 1
	    },
	    
	    series: [{
	        name: 'ADBE',
	        data: ADBE
	    }, {
	        name: 'MSFT',
	        data: MSFT
	    }]
	});
});