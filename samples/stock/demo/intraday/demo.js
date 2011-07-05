
$.get('/samples/stock/demo/intraday/data.csv', function(csv) {
	
	// parse the CSV data
	var data = [], volume = [], header, comment = /^#/, x;
	
	$.each(csv.split('\n'), function(i, line){
	    if (!comment.test(line)) {
	        if (!header) {
	            header = line;
	        
	        } else if (line.length) {
	            var point = line.split(';'), 
	            	date = point[0].split('-'),
	            	time = point[1].split(':');
	            
	            x = Date.UTC(date[2], date[1] - 1, date[0], time[0], time[1]);
	            
	            data.push([
					x, // time 
					parseFloat(point[4]) // close
				]);
	            
	            volume.push([x, parseFloat(point[2])]); // volume
	        }
	    }
	});
	
	// create the chart
	chart = new Highcharts.StockChart({
	    chart: {
	        renderTo: 'container'
	    },
	    
	    rangeSelector: {
	        selected: 0
	    },
	    
	    xAxis: {
	        type: 'datetime',
	        maxZoom: 3600000 // one hour
	    },
	    yAxis: [{
	        title: {
	            text: 'Closing'
	        },
	        height: 200,
	        lineWidth: 2
	    }, {
	        title: {
	            text: 'Volume'
	        },
	        top: 300,
	        height: 100,
	        offset: 0,
	        lineWidth: 2
	    }],
	    
	    rangeSelector: {
	    	buttons: [{
				type: 'minute',
				count: 15,
				text: '15m'
			}, {
				type: 'hour',
				count: 1,
				text: '1h'
			}, {
				type: 'all',
				count: 1,
				text: 'All'
			}],
			selected: 1,
			inputEnabled: false
	   },
	    
	    series: [{
	        name: 'ORCL',
	        data: data
	    }, {
	        type: 'column',
	        name: 'Volume',
	        data: volume,
	        yAxis: 1
	    }]
	});
});