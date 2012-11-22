/**
 * @license Google Spreadsheet loader plugin for Highcharts v0.1
 *
 * (c) 2011 Torstein Hønsi
 *
 * License: www.highcharts.com/license
 */

/* 
 * This plugin loads public Google Spreadsheets by key and sheet name and 
 * generates a Highcharts configuration object. See 
 * http://code.google.com/intl/no-NO/apis/gdata/samples/spreadsheet_sample.html 
 * for background on loading GS.
 * 
 * The first column is used as category labels. Subsequent columns are used 
 * for series data. The first row is used for series names. 
 * 
 * Options:
 * - columns (Function): A callback function for custom handling of the columns of the 
 *   spreadsheet before the Highcharts options are automatically built. 
 * - complete (Function): The callback function to execute when the data is 
 *   parsed. The options are passed in as the first argument and can be 
 *   extended by Highcharts.merge().
 * - key (String): The Google Spreadsheet key
 * - shiftRowsAndColumns (Boolean): Allows using rows instead of columns as 
 *   series data
 * - worksheet (String): The Google Spreadsheet worksheet. The available id's
 *   can be read from https://spreadsheets.google.com/feeds/worksheets/{key}/public/basic
 * 
 * 
 * Todo:
 * - Make options for skip first column, skip first row etc.
 * - Parse dates and numbers in the first column instead of always putting 
 *   it into categories.
 * 
 * Example:
 * 
 ------------------------------------------------------------------------------
 Highcharts.getGoogleSpreadsheet({
    key: '0AoIaUO7wH1HwdENPcGVEVkxfUDJkMmFBcXMzOVVPdHc',
    complete: function(options) {
        
        options = Highcharts.merge(options, {
            chart: {
                renderTo: 'container'
            }
        });
        
        var chart = new Highcharts.Chart(options);
    }
});
-------------------------------------------------------------------------------
 */

(function(Highcharts) {
    
    Highcharts.getGoogleSpreadsheet = function(options) {
                
        $.getJSON('https://spreadsheets.google.com/feeds/cells/'+ 
                  options.key +'/'+ (options.worksheet || 'od6') +
                  '/public/values?alt=json-in-script&callback=?',
                  function(json) {
                
            // Prepare the data from the spreadsheat
            var data = [],
                cells = json.feed.entry,
                cell,
                cellCount = cells.length,
                colCount = 0,
                rowCount = 0,
                columns = [],
                i,
                shiftRowsAndColumns = options.shiftRowsAndColumns,
                COL = shiftRowsAndColumns? 'row' : 'col',
                ROW = shiftRowsAndColumns? 'col' : 'row';
        
            // First, find the total number of columns and rows that 
            // are actually filled with data
            for (i = 0; i < cellCount; i++) {
                cell = cells[i];
                colCount = Math.max(colCount, cell.gs$cell[COL]);
                rowCount = Math.max(rowCount, cell.gs$cell[ROW]);            
            }
        
            // Set up arrays containing the column data
            for (i = 0; i < colCount; i++) {
                columns[i] = new Array(rowCount);
            }
            
            // Loop over the cells and assign the value to the right
            // place in the column arrays
            for (i = 0; i < cellCount; i++) {
                cell = cells[i];
                columns[cell.gs$cell[COL] - 1][cell.gs$cell[ROW] - 1] = 
                    cell.content.$t;
            }
            
            // If a user defined columns function exists, pass them over
            if (options.columns) {
            	options.columns(columns);
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
	                        null;
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
	                series: series,
	                title: {
	                    text: json.feed.title.$t
	                }
	            });
	        }
        });
   };
})(Highcharts);