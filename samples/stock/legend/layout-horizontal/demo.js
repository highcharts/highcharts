$(function() {
	var chart = new Highcharts.StockChart({
	    
	    chart: {
	        renderTo: 'container'
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