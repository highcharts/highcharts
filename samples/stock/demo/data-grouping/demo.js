/*$.get('/stock/demo/demos/data-grouping/data.csv', function(csv) {
	var start = + new Date();
	
	// parse the CSV data
	var data = [], header, comment = /^#/;
	
	$.each(csv.split('\n'), function(i, line) {
	    if (!comment.test(line)) {
	        if (!header) {
	            header = line;
	        }
	        else {
	            var point = line.split(';'),
					date = $.browser.msie ? point[0].replace('-', '/') : point[0],
					x = Date.parse(date),
					temp = point[1] == '' ? null : parseFloat(point[1]);
	            
				if (point.length > 1) {
	            	// the temperature series
	            	data.push([
						x, // the date 
						temp // the temperature value
					]);
				}
	        }
	    }
	});
	
	
	if (window.console) console.log('Parsed data in '+ (new Date() - start) +' ms');*/
	start = + new Date();
	
	
	// Create the chart
	chart = new Highcharts.StockChart({
	    chart: {
	        renderTo: 'container',
	        alignTicks: false,
			events: {
				load: function() {
					if (window.console) console.log('Built chart in '+ (new Date() - start) +' ms');
				}
			}
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
	    
	    xAxis: {
	        maxZoom: 3 * 24 * 3600000 // three days
	    },
		
		yAxis: {
			title: {
				text: 'Temperature (°C)'
			}
		},
			    
	    series: [{
			name: 'Temperature',
			data: temperatures,
			pointStart: Date.UTC(2004, 3, 1),
			pointInterval: 3600 * 1000
		}]
	});
	
	jQuery('<button>Destroy</button>')
		.click(function() {
			chart.destroy();
		})
		.appendTo('.buttons');
//});
