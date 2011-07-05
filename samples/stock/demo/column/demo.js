$(function() {
	$.get('/samples/stock/demo/column/data.csv', function(csv, state, xhr) {

		// inconsistency
		if (typeof csv != 'string') {
			csv = xhr.responseText;
		}

		// parse the CSV data
		var data = [], navigatorData = [], header, comment = /^#/, x;

		$.each(csv.split('\n'), function(i, line){
		    if (!comment.test(line)) {
		        if (!header) {
		            header = line;
		        }
		        else {
		            var point = line.split(';'), date = point[0].split('-');

		            x = Date.UTC(date[2], date[1] - 1, date[0]);

		            data.push([x, parseFloat(point[2])]); // volume
		        }
		    }
		});

		// create the chart
		chart = new Highcharts.StockChart({
		    chart: {
		        renderTo: 'container',
		        alignTicks: false
		    },

		    rangeSelector: {
		        selected: 0
		    },

		    title: {
		        text: 'USD to EUR exchange volume'
		    },

		    xAxis: {
		        type: 'datetime',
		        maxZoom: 14 * 24 * 3600000,
		        // fourteen days
		        title: {
		            text: null
		        }
		    },

		    series: [{
		        type: 'column',
		        name: 'Volume',
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
});