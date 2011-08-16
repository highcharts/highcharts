
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
	    }, 
		// the event marker flags
		{
	        type: 'flags',
	        data: [{
				x: Date.UTC(2011, 3, 25),
				title: 'H',
				text: 'Euro Contained by Channel Resistance',
				url: 'http://biz.yahoo.com/fxcm/110425/428190176.html?.v=1'	
			}, {
				x: Date.UTC(2011, 3, 28),
				title: 'G',
				text: 'EURUSD: Bulls Clear Path to 1.50 Figure',
				url: 'http://biz.yahoo.com/fxcm/110428/805974068.html?.v=1'	
			}, {
				x: Date.UTC(2011, 4, 4),
				title: 'F',
				text: 'EURUSD: Rate Decision to End Standstill',
				url: 'http://biz.yahoo.com/fxcm/110504/1529297364.html?.v=1'	
			}, {
	            x: Date.UTC(2011, 4, 5),
	            title: 'E',
	            text: 'EURUSD: Enter Short on Channel Break',
				url: 'http://biz.yahoo.com/fxcm/110505/402098946.html?.v=1'
	        }, {
	            x: Date.UTC(2011, 4, 6),
	            title: 'D',
	            text: 'Forex: U.S. Non-Farm Payrolls Expand 244K, U.S. Dollar Rally Cut Short By Risk Appetite',
				url: 'http://biz.yahoo.com/fxcm/110506/1748508439.html?.v=1'
	        }, {
	            x: Date.UTC(2011, 4, 6),
	            title: 'C',
	            text: 'US Dollar: Is This the Long-Awaited Recovery or a Temporary Bounce?',
				url: 'http://biz.yahoo.com/fxcm/110506/1855972157.html?.v=1'
	        }, {
	            x: Date.UTC(2011, 4, 9),
	            title: 'B',
	            text: 'EURUSD: Bearish Trend Change on Tap?',
				url: 'http://biz.yahoo.com/fxcm/110509/292979871.html?.v=1'
	        }],
	        onSeries: 'dataseries',
	        shape: 'circlepin',
	        width: 16,
	        cursor: 'pointer'  
	    }]
	});
});