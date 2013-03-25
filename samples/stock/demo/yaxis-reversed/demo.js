$(function() {
	$.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=aapl-c.json&callback=?', function(data) {
		
		// Create the chart
		$('#container').highcharts('StockChart', {
		    chart: {
		        type: 'area'
		    },

		    rangeSelector: {
		        selected: 1
		    },

		    title: {
		        text: 'AAPL Stock Price'
		    },

		    yAxis: {
		        reversed: true,
		        showFirstLabel: false,
		        showLastLabel: true
		    },

		    series: [{
		        name: 'AAPL Stock Price',
		        data: data,
		        threshold: null,
		        fillColor : {
					linearGradient : {
						x1: 0, 
						y1: 1, 
						x2: 0, 
						y2: 0
					},
					stops : [[0, Highcharts.getOptions().colors[0]], [1, 'rgba(0,0,0,0)']]
				},
				tooltip: {
					valueDecimals: 2
				}
		    }]
		});
	});
});