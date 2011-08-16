jQuery(function() {
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
	        data: usdeur
	    }]
	});
});