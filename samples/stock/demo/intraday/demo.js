$(function() {
	$.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=intraday.json&callback=?', function(data) {

		// create the chart
		chart = new Highcharts.StockChart({
			chart : {
				renderTo : 'container'
			},

			title: {
				text: 'ORCL stock price by minute'
			},
			
			rangeSelector : {
				buttons : [{
					type : 'minute',
					count : 15,
					text : '15m'
				}, {
					type : 'hour',
					count : 1,
					text : '1h'
				}, {
					type : 'all',
					count : 1,
					text : 'All'
				}],
				selected : 1,
				inputEnabled : false
			},
			
			series : [{
				name : 'ORCL',
				type: 'candlestick',
				data : data
			}]
		});
	});
});
