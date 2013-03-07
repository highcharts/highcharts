$(function() {

	$.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=large-dataset.json&callback=?', function(data) {

		// Create a timer
		var start = + new Date();

		// Create the chart
		$('#container').highcharts('StockChart', {
		    chart: {
				events: {
					load: function(chart) {
						this.setTitle(null, {
							text: 'Built chart at '+ (new Date() - start) +'ms'
						});
					}
				},
				zoomType: 'x'
		    },

		    rangeSelector: {
		        buttons: [{
		            type: 'day',
		            count: 3,
		            text: '3d'
		        }, {
		            type: 'week',
		            count: 1,
		            text: '1w'
		        }, {
		            type: 'month',
		            count: 1,
		            text: '1m'
		        }, {
		            type: 'month',
		            count: 6,
		            text: '6m'
		        }, {
		            type: 'year',
		            count: 1,
		            text: '1y'
		        }, {
		            type: 'all',
		            text: 'All'
		        }],
		        selected: 3
		    },

			yAxis: {
				title: {
					text: 'Temperature (°C)'
				}
			},

		    title: {
				text: 'Hourly temperatures in Vik i Sogn, Norway, 2004-2010'
			},

			subtitle: {
				text: 'Built chart at...' // dummy text to reserve space for dynamic subtitle
			},

			series: [{
		        name: 'Temperature',
		        data: data,
		        pointStart: Date.UTC(2004, 3, 1),
		        pointInterval: 3600 * 1000,
		        tooltip: {
		        	valueDecimals: 1,
		        	valueSuffix: '°C'
		        }
		    }]

		});
	});
});