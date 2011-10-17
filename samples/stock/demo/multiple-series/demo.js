$(function() {
	var seriesOptions = [],
		yAxisOptions = [],
		seriesCounter = 0,
		names = ['ADBE', 'GOOG', 'MSFT'],
		colors = Highcharts.getOptions().colors;

	$.each(names, function(i, name) {

		$.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename='+ name.toLowerCase() +'-c.json&callback=?',	function(data) {

			seriesOptions[i] = {
				name: name,
				data: data,
				yAxis: i
			};

			// create one y axis for each series in order to be able to compare them
			yAxisOptions[i] = {
				alternateGridColor: null,
				gridLineWidth: i ? 0 : 1, // only grid lines for the first series
				opposite: i ? true : false,
				minorGridLineWidth: 0,
				title: {
					text: name,
					style: {
						color: colors[i]
					}
				},
				lineWidth: 2,
				lineColor: colors[i],
				offset: [0, 0, 70][i]
			};

			// As we're loading the data asynchronously, we don't know what order it will arrive. So
			// we keep a counter and create the chart when all the data is loaded.
			seriesCounter++;

			if (seriesCounter == names.length) {
				createChart();
			}
		});
	});



	// create the chart when all data is loaded
	function createChart() {

		chart = new Highcharts.StockChart({
		    chart: {
		        renderTo: 'container',
		        alignTicks: false,
		        marginLeft: 20,
		        marginRight: 130
		    },

		    rangeSelector: {
		        selected: 1
		    },

		    title: {
		        text: null
		    },
		    
		    tooltip: {
		    	yDecimals: 2
		    },
		    
		    yAxis: yAxisOptions,

		    series: seriesOptions
		});
	}

});