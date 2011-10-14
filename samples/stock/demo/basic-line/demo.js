$(function() {

	$.ajax({
		url : 'http://www.highcharts.com/samples/data/jsonp.php?filename=AAPL.C.json',
		dataType : 'jsonp',
		success : function(data) {
			// Create the chart
			window.chart = new Highcharts.StockChart({
				chart : {
					renderTo : 'container'
				},

				rangeSelector : {
					selected : 1
				},

				title : {
					text : 'AAPL Historical'
				},

				xAxis : {
					maxZoom : 14 * 24 * 3600000 // fourteen days
				},
				
				series : [{
					name : 'AAPL',
					data : data,
					tooltip: {
						yDecimals: 4
					}
				}]
			});
		}
	});

});
