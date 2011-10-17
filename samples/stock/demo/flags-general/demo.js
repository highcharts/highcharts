$(function() {
	$.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=usdeur.json&callback=?', function(data) {

		// Create the chart
		window.chart = new Highcharts.StockChart({
			chart : {
				renderTo : 'container'
			},

			rangeSelector : {
				selected : 1
			},

			title : {
				text : 'USD to EUR exchange rate'
			},

			xAxis : {
				maxZoom : 14 * 24 * 3600000 // fourteen days
			},
			yAxis : {
				title : {
					text : 'Exchange rate'
				}
			},

			series : [{
				name : 'USD to EUR',
				data : data,
				id : 'dataseries',
				tooltip: {
					yDecimals: 4
				}
			},
			// the event marker flags
			{
				type : 'flags',
				data : [{
					x : Date.UTC(2011, 3, 25),
					title : 'H',
					text : 'Euro Contained by Channel Resistance'
				}, {
					x : Date.UTC(2011, 3, 28),
					title : 'G',
					text : 'EURUSD: Bulls Clear Path to 1.50 Figure'
				}, {
					x : Date.UTC(2011, 4, 4),
					title : 'F',
					text : 'EURUSD: Rate Decision to End Standstill'
				}, {
					x : Date.UTC(2011, 4, 5),
					title : 'E',
					text : 'EURUSD: Enter Short on Channel Break'
				}, {
					x : Date.UTC(2011, 4, 6),
					title : 'D',
					text : 'Forex: U.S. Non-Farm Payrolls Expand 244K, U.S. Dollar Rally Cut Short By Risk Appetite'
				}, {
					x : Date.UTC(2011, 4, 6),
					title : 'C',
					text : 'US Dollar: Is This the Long-Awaited Recovery or a Temporary Bounce?'
				}, {
					x : Date.UTC(2011, 4, 9),
					title : 'B',
					text : 'EURUSD: Bearish Trend Change on Tap?'
				}],
				onSeries : 'dataseries',
				shape : 'circlepin',
				width : 16
			}]
		});
	});
});
