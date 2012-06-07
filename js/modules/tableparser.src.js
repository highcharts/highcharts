/**
 * @license TableParser plugin for Highcharts v0.1
 *
 * (c) 2011 Torstein Hønsi
 *
 * License: www.highcharts.com/license
 */

/*
 * Demo: http://jsfiddle.net/highcharts/SnLFj/
 */

(function(Highcharts) {
    
    Highcharts.tableParser = function(options) {
        var columns = [],
        	each = Highcharts.each;
        
        if (options.str) {
        	var str = options.str,
        		lines = str.split(options.lineDelimiter || '\n');
        	
        	each(lines, function (line, rowNo) {
        		var items = line.split(options.itemDelimiter || ',');
        		each(items, function (item, colNo) {
        			
        			if (!columns[colNo]) {
        				columns[colNo] = [];
        			}
        			
        			columns[colNo][rowNo] = parseFloat(item);
        		});
        	});
        }
        
    	// If a user defined complete function exists, parse the columns 
    	// into a Highcharts options object.
    	if (options.complete) {
    		// Use the first column for categories
            var categories = columns.shift();
            categories.shift(); // remove the first cell
            
            // Use the next columns for series
            var series = [],
                data,
                name;
            for (i = 0; i < columns.length; i++) {
                name = columns[i].shift();
                data = [];
                for (var j = 0; j < columns[i].length; j++) {
                    data[j] = columns[i][j] !== undefined ?
                        parseInt(columns[i][j]) :
                        null
                }
                series[i] = {
                    name: name,
                    data: data
                };
            }
            
            options.complete({
                xAxis: {
                    categories: categories
                },
                series: series
            });
        }
   };
})(Highcharts);