
$.get('/samples/stock/demo/candlestick-and-volume/data.csv', function(csv) {
	
	// parse the CSV data
	var data = [], navigatorData = [], header, comment = /^#/, x;
	
	        $(document.body).append('<div style="margin-top: 1000px"></div>')
	$.each(csv.split('\n'), function(i, line){
	    if (!comment.test(line)) {
	        if (!header) {
	            header = line;
	        }
	        else {
	            var point = line.split(';'), date = point[0].split('-');
	            
	            x = Date.UTC(date[2], date[1] - 1, date[0]);
	            
	            data.push([
					x, // time 
					parseFloat(point[3]), // open
	 				parseFloat(point[6]), // high
	 				parseFloat(point[5]), // low
	 				parseFloat(point[4]) // close
				]);
	            
	            navigatorData.push([x, parseFloat(point[4])]); // close
	        	$(document.body).append('<div>['+ x +','+ parseFloat(point[3]) +','+ parseFloat(point[6]) +
	        		','+ parseFloat(point[5]) +','+ parseFloat(point[4]) +'],</div>')
	        }
	    }
	});
	
	
	
	// create the chart
	chart = new Highcharts.StockChart({
	    chart: {
	        renderTo: 'container',
	        alignTicks: false
	    },
	    
	    navigator: {
	        series: {
	            data: navigatorData
	        }
	    },
	    
	    rangeSelector: {
	        selected: 2
	    },
	    
	    title: {
	        text: 'USD to EUR exchange rate'
	    },
	    
	    xAxis: {
	        type: 'datetime',
	        maxZoom: 14 * 24 * 3600000,
	        // fourteen days
	        title: {
	            text: null
	        }
	    },
	    yAxis: [{
	        title: {
	            text: 'Exchange rate'
	        }
	    }],
	    
	    series: [{
	        type: 'ohlc',
	        name: 'USD to EUR',
	        data: data,
	        dataGrouping: {
	        	units: [[
					'week',                         // unit name
					[1]                             // allowed multiples
				], [
					'month',
					[1, 2, 3, 4, 6]
				]]
	        }
	    }]
	});
});