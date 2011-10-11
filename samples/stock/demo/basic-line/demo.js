// The jsonp callback
window.callback = function(data) {
	
	// Create the chart	
	window.chart = new Highcharts.StockChart({
	    chart: {
	        renderTo: 'container'
	    },
	    
	    rangeSelector: {
	        selected: 1
	    },
	    
	    title: {
	        text: 'USD to EUR exchange rate'
	    },
	    
	    xAxis: {
	        maxZoom: 14 * 24 * 3600000 // fourteen days
	    },
	    yAxis: {
	        title: {
	            text: 'Exchange rate'
	        }
	    },
		
	    series: [{
	        name: 'USD to EUR',
	        data: data
	    }]
	});
};

jQuery(function($) {
	
	$.ajax({
		url: 'http://www.highcharts.com/samples/data/usdeur.jsonp',
		dataType: 'jsonp'
	});

});