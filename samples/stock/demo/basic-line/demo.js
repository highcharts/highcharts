$(function() {

	$.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=aapl-c.json&callback=?', function(data) {
		// Create the chart
		window.chart = new Highcharts.StockChart({
			chart : {
				renderTo : 'container'
			},

			rangeSelector : {
				selected : 1
			},

			title : {
				text : 'AAPL Stock Price'
			},

			xAxis : {
				maxZoom : 14 * 24 * 3600000 // fourteen days
			},
			
			series : [{
				name : 'AAPL',
				data : data,
				tooltip: {
					yDecimals: 2
				}
			}]
		});
	});

});
