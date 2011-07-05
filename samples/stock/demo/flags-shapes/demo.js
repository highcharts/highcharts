$(function() {
	$.get('/samples/stock/demo/flags-shapes/data.csv', function(csv, state, xhr) {

		// inconsistency
		if (typeof csv != 'string') {
			csv = xhr.responseText;
		}

		// parse the CSV data
		var data = [], header, comment = /^#/, x;

		$.each(csv.split('\n'), function(i, line){
		    if (!comment.test(line)) {
		        if (!header) {
		            header = line;
		        }
		        else {
		            var point = line.split(';'),
						date = point[0].split('-');

		            x = Date.UTC(date[2], date[1] - 1, date[0]);

					if (point.length > 1) {
			            data.push([
							x, // time
							parseFloat(point[4]) // close
						]);
		            }
		        }
		    }
		});

		
		// Create the chart
		window.chart = new Highcharts.StockChart({
		    chart: {
		        renderTo: 'container'
		    },

		    rangeSelector: {
		        selected: 1
		    },

		    title: {
		        text: 'USD to EUR exchange rate'
		    },

		    xAxis: {
		        type: 'datetime',
		        maxZoom: 14 * 24 * 3600000, // fourteen days
		        title: {
		            text: null
		        }
		    },
		    yAxis: {
		        title: {
		            text: 'Exchange rate'
		        }
		    },

			tooltip: {
				style: {
					width: 200
				}
			},

		    series: [{
		        name: 'USD to EUR',
		        data: data,
				id: 'dataseries'
		    }, {
		        type: 'flags',
		        data: [{
					x: Date.UTC(2011, 1, 14),
					title: 'A',
					text: 'Shape: "squarepin"'
				}, {
					x: Date.UTC(2011, 3, 28),
					title: 'A',
					text: 'Shape: "squarepin"'
				}],
		        onSeries: 'dataseries',
		        shape: 'squarepin',
		        width: 16
		    }, {
		        type: 'flags',
		        data: [{
					x: Date.UTC(2011, 2, 1),
					title: 'B',
					text: 'Shape: "circlepin"'
				}, {
					x: Date.UTC(2011, 3, 1),
					title: 'B',
					text: 'Shape: "circlepin"'
				}],
		        shape: 'circlepin',
		        width: 16
		    }, {
		        type: 'flags',
		        data: [{
					x: Date.UTC(2011, 2, 10),
					title: 'C',
					text: 'Shape: "flag"'
				}, {
					x: Date.UTC(2011, 3, 11),
					title: 'C',
					text: 'Shape: "flag"'
				}],
				color: '#5F86B3',
				fillColor: '#5F86B3',
				onSeries: 'dataseries',
		        width: 16,
		        style: { // text style
				color: 'white'
		        },
		        states: {
				hover: {
					fillColor: '#395C84' // darker
				}
		        }
		    }]
		});
	});
});