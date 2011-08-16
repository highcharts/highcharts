
$.get('/samples/stock/demo/flags-general/data.csv', function(csv) {
	
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
	        name: 'Flags on series',
	        data: [{
				x: Date.UTC(2011, 1, 14),
				title: 'On series'	
			}, {
				x: Date.UTC(2011, 3, 28),
				title: 'On series'	
			}],
	        onSeries: 'dataseries',
	        shape: 'squarepin'  
	    }, {
	        type: 'flags',
	        name: 'Flags on axis',
	        data: [{
				x: Date.UTC(2011, 2, 1),
				title: 'On axis'	
			}, {
				x: Date.UTC(2011, 3, 1),
				title: 'On axis'	
			}],
	        shape: 'squarepin'  
	    }]
	});
});