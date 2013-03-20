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
				plotBands : [{
					from : 0.6738,
					to : 0.7419,
					color : 'rgba(68, 170, 213, 0.2)',
					label : {
						text : 'Last quarter\'s value range'
					}
				}]
			},

			series : [{
				name : 'USD to EUR',
				data : data,
				tooltip: {
					valueDecimals: 4
				}
			}]
		});
	});
});
