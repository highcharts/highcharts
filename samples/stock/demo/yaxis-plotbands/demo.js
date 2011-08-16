
$.get('/samples/stock/demo/yaxis-plotbands/data.csv', function(csv) {
	
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
					
				if (point.length > 1) {
	                x = Date.UTC(date[2], date[1] - 1, date[0]);
		            
		            data.push([
						x, // time 
						parseFloat(point[4]) // close
					]);
	            }
	        }
	    }
	});
	
	var start = + new Date();
	
	// Create the chart	
	window.chart = new Highcharts.StockChart({
	    chart: {
	        renderTo: 'container',
			events: {
				load: function() {
					if (window.console) console.log('Rendered chart in '+ (new Date() - start) +' ms');
				}
			}
	    },
	    
	    rangeSelector: {
	        selected: 1
	    },
	    
	    title: {
	        text: 'USD to EUR exchange rate'
	    },
	    
	    xAxis: {
	        maxZoom: 14 * 24 * 3600000 // fourteen days
	    },
	    yAxis: {
	        title: {
	            text: 'Exchange rate'
	        },
	        plotBands: [{
	        	from: 0.6738,
	        	to: 0.7419,
	        	color: 'rgba(68, 170, 213, 0.2)',
	        	label: {
	        		text: 'Last quarter\'s value range'
	        	}
	        }]
	    },
		
	    series: [{
	        name: 'USD to EUR',
	        data: data
	    }]
	});
});