/**
 * @license Data plugin for Highcharts v0.1
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
	
	/**
	 * Parse numeric cells in to number types and date types in to true dates.
	 * @param {Object} columns
	 */
	function parseTypes(columns) {
		var col = columns.length, 
			row,
			val,
			floatVal,
			trimVal,
			dateVal;
			
		while (col--) {
			row = columns[col].length;
			while (row--) {
				val = columns[col][row];
				floatVal = parseFloat(val);
				trimVal = trim(val);
				if (trimVal == floatVal) { // is numeric
					columns[col][row] = floatVal;
					columns[col].isNumeric = true;					
				
				} else { // string, continue to determine if it is a date string or really a string
					dateVal = Date.parse(val);
					
					if (typeof dateVal === 'number' && !isNaN(dateVal)) { // is date
						columns[col][row] = dateVal;
						columns[col].isDatetime = true;
					
					} else { // string
						columns[col][row] = trimVal;
					}
				}
				
			}
		}
		
	}
	
	
    
    Highcharts.data = function(options) {
        var columns = [],
        	each = Highcharts.each,
        	hasXData,
        	firstRowIsHeader = true;
        	
        if (options.csv) {
        	var lines = options.csv.split(options.lineDelimiter || '\n');
        	
        	each(lines, function (line, rowNo) {
        		var items = line.split(options.itemDelimiter || ',');
        		each(items, function (item, colNo) {
        			
        			if (!columns[colNo]) {
        				columns[colNo] = [];
        			
        			}
        			
        			columns[colNo][rowNo] = item;
        		});
        	});
        }
        
        // Parse into right types
        parseTypes(columns);
        
        // Use first row for series names?
        each(columns, function (column) {
        	if (typeof column[0] !== 'string') {
        		firstRowIsHeader = false;
        	}
        });
        
        
    	// If a user defined complete function exists, parse the columns 
    	// into a Highcharts options object.
    	if (options.complete) {
    		var categories,
    			firstCol,
    			type;
            
            // Use first column for X data or categories?
            if (columns.length > 1) {
	        	firstCol = columns.shift();
	        	if (firstRowIsHeader) {
	        		firstCol.shift(); // remove the first cell
	        	}
	            
	            // Use the first column for categories or X values
	            hasXData = firstCol.isNumeric || firstCol.isDatetime;
	            if (!hasXData) { // means type is neither datetime nor linear
	            	categories = firstCol;
	            }
	            
	            if (firstCol.isDatetime) {
	            	type = 'datetime';
	            }
	        }
            
            // Use the next columns for series
            var series = [],
                data,
                name;
            for (i = 0; i < columns.length; i++) {
            	if (firstRowIsHeader) {
                	name = columns[i].shift();
               	}
                data = [];
                for (var j = 0; j < columns[i].length; j++) {
                    data[j] = columns[i][j] !== undefined ?
                        (hasXData ?
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