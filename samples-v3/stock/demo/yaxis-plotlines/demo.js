$(function() {
	$.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=usdeur.json&callback=?', function(data) {

		// Create the chart
		$('#container').highcharts('StockChart', {
			

			rangeSelector : {
				selected : 1
			},

			title : {
				text : 'USD to EUR exchange rate'
			},

			yAxis : {
				title : {
					text : 'Exchange rate'
				},
				plotLines : [{
					value : 0.6738,
					color : 'green',
					dashStyle : 'shortdash',
					width : 2,
					label : {
						text : 'Last quarter minimum'
					}
				}, {
					value : 0.7419,
					color : 'red',
					dashStyle : 'shortdash',
					width : 2,
					label : {
						text : 'Last quarter maximum'
					}
				}]
			},

			series : [{
				name : 'USD to EUR',
				data : data,
				tooltip : {
					valueDecimals : 4
				}
			}]
		});
	});
});
