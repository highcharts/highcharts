$(function() {
	var chart = new Highcharts.StockChart({
	    
	    chart: {
	        renderTo: 'container'
	    },
	    
	    rangeSelector: {
	    	selected: 1
	    },
	    
	    series: [{
			name: 'Temperature',
			data: temperatures,
			pointStart: Date.UTC(2004, 3, 1), // first of April
			pointInterval: 3600 * 1000, // hourly data
			tooltip: {
				yDecimals: 1,
				ySuffix: '°C'
			}
		}]
	});
});