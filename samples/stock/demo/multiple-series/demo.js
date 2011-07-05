var seriesOptions = [],
	yAxisOptions = [],
	seriesCounter = 0,
	names = ['ADBE', 'GOOGL', 'MSFT'],
	colors = Highcharts.getOptions().colors;

$.each(names, function(i, name) {
	
	$.get('/samples/stock/demo/multiple-series/'+ name +'.csv', function(csv) {
		
		// parse the CSV data
		var data = [], header, comment = /^#/, x;
		
		$.each(csv.split('\n'), function(i, line){
		    if (!comment.test(line)) {
		        if (!header) {
		            header = line;
		        }
		        else {
		            var point = line.split(';'), date = point[0].split('-');
		            
		            x = Date.UTC(date[2], date[1] - 1, date[0]);
		            
					if (point.length > 1) {
						// use point[4], the close value
		            	data.push([
							x, 
							parseFloat(point[4])
						]);
		            }
		        }
		    }
		});
		
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
			lineColor: colors[i]
		};
		
		// As we're loading the data asynchronously, we don't know what order it will arrive. So
		// we keep a counter and create the chart when all the data is loaded. 
		seriesCounter++;
		
		if (seriesCounter == names.length) {
			createChart();
		}
	});
})


	
// create the chart when all data is loaded
function createChart() {

	chart = new Highcharts.StockChart({
	    chart: {
	        renderTo: 'container',
	        alignTicks: false
	    },
	    
	    rangeSelector: {
	        selected: 1
	    },
	    
	    title: {
	        text: null
	    },
	    
	    xAxis: {
	        type: 'datetime',
	        maxZoom: 14 * 24 * 3600000, // fourteen days
	        title: {
	            text: null
	        }
	    },
	    yAxis: yAxisOptions,
	    
	    series: seriesOptions
	});
}