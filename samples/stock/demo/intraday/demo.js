$(function() {
	$.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=new-intraday.json&callback=?', function(data) {

		// create the chart
		chart = new Highcharts.StockChart({
			chart : {
				renderTo : 'container',
				zoomType: 'x',
				events: {
					selection: function(e) {
						console.log(
							Highcharts.dateFormat(null, e.xAxis[0].min),
							Highcharts.dateFormat(null, e.xAxis[0].max)
						)
					}
				}
			},

			title: {
				text: 'AAPL stock price by minute'
			},
			
			xAxis: {
				ordinal: true
			},
			
			rangeSelector : {
				buttons : [{
					type : 'hour',
					count : 1,
					text : '1h'
				}, {
					type : 'day',
					count : 1,
					text : '1D'
				}, {
					type : 'all',
					count : 1,
					text : 'All'
				}],
				selected : 1,
				inputEnabled : false
			},
			
			navigator: {
				xAxis: {
					ordinal: true
				}
			},
			series : [{
				name : 'AAPL',
				type: 'area',
				data : data,
				tooltip: {
					yDecimals: 2
				},
				fillColor : {
					linearGradient : {
						x1: 0, 
						y1: 0, 
						x2: 0, 
						y2: 1
					},
					stops : [[0, Highcharts.getOptions().colors[0]], [1, 'rgba(0,0,0,0)']]
				},
				threshold: null
			}]
		});
	});
});
