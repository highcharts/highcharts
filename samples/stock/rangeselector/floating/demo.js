$.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=aapl-c.json&callback=?', function (data) {
    // Create the chart
    Highcharts.stockChart('container', {
    	
        rangeSelector: {
			floating: true,
			x: 0,
			y: 250
		},

	  	xAxis: {
	  		offset: -28
	  	},

	  	yAxis: {
	  		height: 150,
	  	},

        title: {
            text: 'AAPL Stock Price'
        },

        series: [{
            name: 'AAPL',
            data: data,
            tooltip: {
                valueDecimals: 2
            }
        }]
    });
});


