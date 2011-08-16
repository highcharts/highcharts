
$.get('/samples/stock/demo/navigator-disabled/data.csv', function(csv) {
	
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
	        }
	    },
	    
	    navigator: {
	    	enabled: false
	    },
		
	    series: [{
	        name: 'USD to EUR',
	        data: data
	    }]
	});
});