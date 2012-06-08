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
	
	function trim(str) {
		return str.replace(/^\s+|\s+$/g, '');
	}
    
    Highcharts.tableParser = function(options) {
        var columns = [],
        	each = Highcharts.each;
        	
        if (options.str) {
        	var str = options.str,
        		lines = str.split(options.lineDelimiter || '\n');
        	
        	each(lines, function (line, rowNo) {
        		var items = line.split(options.itemDelimiter || ','),
        			pItem;
        		each(items, function (item, colNo) {
        			
        			if (!columns[colNo]) {
        				columns[colNo] = [];
        			}
        			
        			// Category or X column
        			if (colNo === 0) {
        				if (options.xAxisType === 'datetime') {
        					pItem = parseInt(item);
        					if (trim(item) == pItem) { // JavaScript time integer
        						columns[0][rowNo] = pItem;
        					} else {
        						columns[0][rowNo] = Date.parse(item);
        					}
        				} else if (options.xAxisType === 'linear') {
        					columns[0][rowNo] = parseFloat(item);
        				} else {
        					columns[0][rowNo] = item;
        				}
        				
        			// Data columns
        			} else {        				
        				columns[colNo][rowNo] = parseFloat(item);
        			}
        		});
        	});
        }
        
    	// If a user defined complete function exists, parse the columns 
    	// into a Highcharts options object.
    	if (options.complete) {
    		var categories,
    			firstCol,
    			type = options.xAxisType;
            
            
        	firstCol = columns.shift();
        	firstCol.shift(); // remove the first cell
            
            // Use the first column for categories or X values
            if (!type) { // means type is neither datetime nor linear
            	categories = firstCol;
            }
            
            // Use the next columns for series
            var series = [],
                data,
                name;
            for (i = 0; i < columns.length; i++) {
                name = columns[i].shift();
                data = [];
                for (var j = 0; j < columns[i].length; j++) {
                    data[j] = columns[i][j] !== undefined ?
                        (type ?
                        	[firstCol[j], columns[i][j]] :
                        	columns[i][j]
                        ) :
                        null
                }
                series[i] = {
                    name: name,
                    data: data
                };
            }
            
            options.complete({
                xAxis: {
                    categories: categories,
                    type: type
                },
                series: series
            });
        }
   };
})(Highcharts);