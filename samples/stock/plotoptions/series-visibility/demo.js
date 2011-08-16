$(function() {
	var chart = new Highcharts.StockChart({
	    
	    chart: {
	        renderTo: 'container'
	    },
	    
	    rangeSelector: {
	    	selected: 1
	    },
	    
	    legend: {
	    	enabled: true,
	    	layout: 'vertical',
	    	align: 'right',
	    	verticalAlign: 'top',
	    	y: 100
	    },
	    
	    series: [{
	        name: 'ADBE',
	        data: ADBE
	    }, {
	        name: 'MSFT',
	        data: MSFT,
	        visible: false 
	    }]
	});
});