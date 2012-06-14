/**
 * @license Data plugin for Highcharts v0.1
 *
 * (c) 2012 Torstein Hønsi
 *
 * License: www.highcharts.com/license
 */

/*
 * Demo: http://jsfiddle.net/highcharts/SnLFj/
 */

(function(Highcharts) {	
	
	// Utilities
	var each = Highcharts.each;
	
	
	// The Data constructor
	var Data = function (options) {
		this.init(options);
	};
	
	// Set the prototype properties
	Highcharts.extend(Data.prototype, {
		
	/**
	 * Initialize the Data object with the given options
	 */
	init: function (options) {
		this.options = options;
		this.columns = [];
		
        
        // Parse a CSV if options.csv is given
        this.parseCSV();
        
        // Interpret the values into right types
        this.parseTypes();
        
        // Use first row for series names?
        this.findHeaderRow();
        
        // Complete if a complete callback is given
        this.complete();
        
    },
    
    /**
     * Parse a CSV input string
     */
    parseCSV: function () {
    	var options = this.options,
    		csv = options.csv,
    		columns = this.columns,
    		lines;
    		
    	if (csv) {
        	lines = csv.split(options.lineDelimiter || '\n');
        	
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
    },
    
    /**
     * Find the header row. For now, we just check whether the first row contains
     * numbers or strings. Later we could loop down and find the first row with 
     * numbers.
     */
    findHeaderRow: function () {
    	var headerRow = 0;
    	each(this.columns, function (column) {
        	if (typeof column[0] !== 'string') {
        		headerRow = null;
        	}
        });
        this.headerRow = 0;        	
    },
    
   	/**
   	 * Trim a string from whitespace
   	 */
   	trim: function (str) {
		return str.replace(/^\s+|\s+$/g, '');
	},
	
	/**
	 * Parse numeric cells in to number types and date types in to true dates.
	 * @param {Object} columns
	 */
	parseTypes: function () {
		var columns = this.columns,
			col = columns.length, 
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
				trimVal = this.trim(val);
				if (trimVal == floatVal) { // is numeric
					columns[col][row] = floatVal;
					
					// If the number is greater than milliseconds in a year, assume datetime
					if (floatVal > 365 * 24 * 3600 * 1000) {
						columns[col].isDatetime = true;
					} else {
						columns[col].isNumeric = true;
					}					
				
				} else { // string, continue to determine if it is a date string or really a string
					dateVal = Date.parse(val);
					
					if (col === 0 && typeof dateVal === 'number' && !isNaN(dateVal)) { // is date
						columns[col][row] = dateVal;
						columns[col].isDatetime = true;
					
					} else { // string
						columns[col][row] = trimVal;
					}
				}
				
			}
		}		
	},
	
	/**
	 * If a complete callback function is provided in the options, interpret the 
	 * columns into a Highcharts options object.
	 */
	complete: function () {
		
		var columns = this.columns,
			hasXData,
			categories,
			firstCol,
			type,
			options = this.options,
			series,
			data,
			name,
			i,
			j;
			
		
    	if (options.complete) {
    	    
            // Use first column for X data or categories?
            if (columns.length > 1) {
	        	firstCol = columns.shift();
	        	if (this.headerRow === 0) {
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
            series = [];
            for (i = 0; i < columns.length; i++) {
            	if (this.headerRow === 0) {
                	name = columns[i].shift();
               	}
                data = [];
                for (j = 0; j < columns[i].length; j++) {
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
            
            // Do the callback
            options.complete({
                xAxis: {
                    categories: categories,
                    type: type
                },
                series: series
            });
        }
    }
	});
	
	// Register the Data prototype and data function on Highcharts
	Highcharts.Data = Data;
	Highcharts.data = function (options) {
		return new Data(options);
	};
})(Highcharts);