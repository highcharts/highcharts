/**
 * @license Data plugin for Highcharts v0.1
 *
 * (c) 2012 Torstein Hønsi
 *
 * License: www.highcharts.com/license
 */

/*
 * The Highcharts Data plugin is a utility to ease parsing of input sources like
 * CSV, HTML tables or grid views into basing configuration options for use 
 * directly in the Highcharts constructor.
 *
 * Demo: http://jsfiddle.net/highcharts/SnLFj/
 *
 * --- OPTIONS ---
 *
 * - columns : Array<Array<Mixed>>
 * A two-dimensional array representing the input data on tabular form. This input can
 * be used when the data is already parsed, for example from a grid view component.
 * Each cell can be a string or number. If not switchRowsAndColumns is set, the columns
 * are interpreted as series. See also the rows option.
 *
 * - complete : Function(chartOptions)
 * The callback that is evaluated when the data is finished loading, optionally from an 
 * external source, and parsed. The first argument passed is a finished chart options
 * object, containing series and an xAxis with categories if applicable. Thise options
 * can be extended with additional options and passed directly to the chart constructor.
 *
 * - csv : String
 * A comma delimited string to be parsed. Related options are startRow, endRow, startColumn
 * and endColumn to delimit what part of the table is used. The lineDelimiter and 
 * itemDelimiter options define the CSV delimiter formats.
 * 
 * - endColumn : Integer
 * In tabular input data, the first row (indexed by 0) to use. Defaults to the last 
 * column containing data.
 *
 * - endRow : Integer
 * In tabular input data, the last row (indexed by 0) to use. Defaults to the last row
 * containing data.
 *
 * - itemDilimiter : String
 * Item or cell delimiter for parsing CSV. Defaults to ",".
 *
 * - lineDilimiter : String
 * Line delimiter for parsing CSV. Defaults to "\n".
 *
 * - parsed : Function
 * A callback function to access the parsed columns, the two-dimentional input data
 * array directly, before they are interpreted into series data and categories.
 *
 * - parseDate : Function
 * A callback function to parse string representations of dates into JavaScript timestamps.
 * Return an integer on success.
 *
 * - rows : Array<Array<Mixed>>
 * The same as the columns input option, but defining rows intead of columns.
 *
 * - startColumn : Integer
 * In tabular input data, the first column (indexed by 0) to use. 
 *
 * - startRow : Integer
 * In tabular input data, the first row (indexed by 0) to use.
 *
 * - table : String|HTMLElement
 * A HTML table or the id of such to be parsed as input data. Related options ara startRow,
 * endRow, startColumn and endColumn to delimit what part of the table is used.
 */

(function (Highcharts) {	
	
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
		this.columns = options.columns || this.rowsToColumns(options.rows) || [];
		
		
		// Parse a CSV string if options.csv is given
		this.parseCSV();
		
		// Parse a HTML table if options.table is given
		this.parseTable();
		
		// Interpret the values into right types
		this.parseTypes();
		
		// Use first row for series names?
		this.findHeaderRow();
		
		// Handle columns if a handleColumns callback is given
		this.parsed();
		
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
			startRow = options.startRow || 0,
			endRow = options.endRow || Number.MAX_VALUE,
			startColumn = options.startColumn || 0,
			endColumn = options.endColumn || Number.MAX_VALUE,
			lines;
			
		if (csv) {
			
			lines = csv
				.replace(/\r\n/g, "\n") // Unix
				.replace(/\r/g, "\n") // Mac
				.split(options.lineDelimiter || "\n");
			
			each(lines, function (line, rowNo) {
				if (rowNo >= startRow && rowNo <= endRow) {
					var items = line.split(options.itemDelimiter || ',');
					each(items, function (item, colNo) {
						if (colNo >= startColumn && colNo <= endColumn) {
							if (!columns[colNo - startColumn]) {
								columns[colNo - startColumn] = [];					
							}
							
							columns[colNo - startColumn][rowNo - startRow] = item;
						}
					});
				}
			});
		}
	},
	
	/**
	 * Parse a HTML table
	 */
	parseTable: function () {
		var options = this.options,
			table = options.table,
			columns = this.columns,
			startRow = options.startRow || 0,
			endRow = options.endRow || Number.MAX_VALUE,
			startColumn = options.startColumn || 0,
			endColumn = options.endColumn || Number.MAX_VALUE,
			colNo;
			
		if (table) {
			
			if (typeof table === 'string') {
				table = document.getElementById(table);
			}
			
			each(table.getElementsByTagName('tr'), function (tr, rowNo) {
				colNo = 0; 
				if (rowNo >= startRow && rowNo <= endRow) {
					each(tr.childNodes, function (item) {
						if ((item.tagName === 'TD' || item.tagName === 'TH') && colNo >= startColumn && colNo <= endColumn) {
							if (!columns[colNo]) {
								columns[colNo] = [];					
							}
							columns[colNo][rowNo - startRow] = item.innerHTML;
							
							colNo += 1;
						}
					});
				}
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
		return typeof str === 'number' ? str : str.replace(/^\s+|\s+$/g, '');
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
				/*jslint eqeq: true*/
				if (trimVal == floatVal) { // is numeric
				/*jslint eqeq: false*/
					columns[col][row] = floatVal;
					
					// If the number is greater than milliseconds in a year, assume datetime
					if (floatVal > 365 * 24 * 3600 * 1000) {
						columns[col].isDatetime = true;
					} else {
						columns[col].isNumeric = true;
					}					
				
				} else { // string, continue to determine if it is a date string or really a string
					dateVal = this.parseDate(val);
					
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
	 * Parse a date and return it as a number. Overridable through options.parseDate.
	 */
	parseDate: function (val) {
		var parseDate = this.options.parseDate;
		
		return parseDate ? parseDate(val) : Date.parse(val);
	},
	
	/**
	 * Reorganize rows into columns
	 */
	rowsToColumns: function (rows) {
		var row,
			rowsLength,
			col,
			colsLength,
			columns;

		if (rows) {
			columns = [];
			rowsLength = rows.length;
			for (row = 0; row < rowsLength; row++) {
				colsLength = rows[row].length;
				for (col = 0; col < colsLength; col++) {
					if (!columns[col]) {
						columns[col] = [];
					}
					columns[col][row] = rows[row][col];
				}
			}
		}
		return columns;
	},
	
	/**
	 * A hook for working directly on the parsed columns
	 */
	parsed: function () {
		if (this.options.parsed) {
			this.options.parsed.call(this, this.columns);
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
						null;
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
}(Highcharts));