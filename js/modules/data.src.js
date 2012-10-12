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
		
		var async = false;
		
		this.options = options;
		this.columns = [];
		
		
		// Parse a CSV string if options.csv is given
		this.parseCSV();
		
		// Parse a HTML table if options.table is given
		this.parseTable();
		
		// Load and parse SVG
		if (options.svg) {
			this.loadSVG();
			async = true;
		}
		
		// Interpret the values into right types
		this.parseTypes();
		
		// Use first row for series names?
		this.findHeaderRow();
		
		// Handle columns if a handleColumns callback is given
		this.parsed();
		
		// Complete if a complete callback is given
		if (!async) {
			this.complete();
		}
		
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
	 * Parse an SVG path into a simplified array that Highcharts can read
	 */
	pathToArray: function (path, translate) {
		
		var i = 0,
			position = 0,
			positions,
			fixedPoint = [0, 0],
			isRelative,
			isString,
			operator;
		path = path
			// Move letters apart
			.replace(/([A-Za-z])/g, ' $1 ')
			// Add space before minus
			.replace(/-/g, ' -')
			// Trim
			.replace(/^\s*/, "").replace(/\s*$/, "")
		
			// Split on spaces, minus and commas
			.split(/[ ,]+/);
		
		// Blank path
		if (path.length === 1) {
			return [];	
		}
		
		// Real path
		for (i = 0; i < path.length; i++) {
			isString = /[a-zA-Z]/.test(path[i]);
			
			// Handle strings
			if (isString) {
				operator = path[i];
				positions = 2;
				
				// Curves have six positions
				if (operator === 'c' || operator === 'C') {
					positions = 6;
				}
				
				// Enter or exit relative mode
				if (operator === 'm' || operator === 'l' || operator === 'c') {
					path[i] = operator.toUpperCase();
					isRelative = true;
				} else if (operator === 'M' || operator === 'L' || operator === 'C') {
					isRelative = false;
				
				
				// Horizontal and vertical line to
				} else if (operator === 'h') {
					isRelative = true;
					path[i] = 'L';
					path.splice(i + 2, 0, 0);
				} else if (operator === 'v') {
					isRelative = true;
					path[i] = 'L';
					path.splice(i + 1, 0, 0);
				} else if (operator === 'H' || operator === 'h') {
					isRelative = false;
					path[i] = 'L';
					path.splice(i + 2, 0, fixedPoint[1]);
				} else if (operator === 'V' || operator === 'v') {
					isRelative = false;
					path[i] = 'L';
					path.splice(i + 1, 0, fixedPoint[0]);
				}
			
			// Handle numbers
			} else {
				
				path[i] = parseFloat(path[i]);
				if (isRelative) {
					path[i] += fixedPoint[position % 2];
				
				} 
				if (translate && (!isRelative || (operator === 'm' && i < 3))) { // only translate absolute points or initial moveTo
					path[i] += translate[position % 2];
				}
				
				path[i] = Math.round(path[i] * 100) / 100;
				
				// Set the fixed point for the next pair
				if (position === positions - 1) {
					fixedPoint = [path[i-1], path[i]];
				}
				
				// Reset to zero position (x/y switching)
				if (position === positions - 1) {
					position = 0;
				} else {
					position += 1;
				}
			}
		}
		return path;
	},
	
	/**
	 * Load an SVG file and extract the paths
 	 * @param {Object} url
	 */
	loadSVG: function () {
		
		var data = this,
			options = this.options;
		
		function getTranslate(elem) {
			var transform = elem.getAttribute('transform'),
				translate = transform && transform.match(/translate\(([0-9\-\. ]+),([0-9\-\. ]+)\)/);
			
			return translate && [parseFloat(translate[1]), parseFloat(translate[2])]; 
		}
		
		function getName(elem) {
			return elem.getAttribute('inkscape:label') || elem.getAttribute('id') || elem.getAttribute('class');
		}
		
		$.ajax({
			url: options.svg,
			dataType: 'xml',
			success: function (xml) {
				var arr = [],
					currentParent,
					allPaths = xml.getElementsByTagName('path'),
					commonLineage,
					lastCommonAncestor,
					handleGroups,
					defs = xml.getElementsByTagName('defs')[0],
					clipPaths;
					
				// Skip clip paths
				clipPaths = defs && defs.getElementsByTagName('path');
				if (clipPaths) {
					each(clipPaths, function (path) {
						path.skip = true;
					});
				}
				
				// If not all paths belong to the same group, handle groups
				each(allPaths, function (path, i) {
					if (!path.skip) {
						var itemLineage = [],
							parentNode,
							j;
						
						if (i > 0 && path.parentNode !== currentParent) {
							handleGroups = true;
						}
						currentParent = path.parentNode;
						
						// Handle common lineage
						parentNode = path;
						while ((parentNode = parentNode.parentNode)) {
							itemLineage.push(parentNode);
						}
						itemLineage.reverse();
						
						if (!commonLineage) {
							commonLineage = itemLineage; // first iteration
						} else {
							for (j = 0; j < commonLineage.length; j++) {
								if (commonLineage[j] !== itemLineage[j]) {
									commonLineage.slice(0, j);
								}
							}
						}
					}
				});
				lastCommonAncestor = commonLineage[commonLineage.length - 1];
				
				// Iterate groups to find sub paths
				if (handleGroups) {
					each(lastCommonAncestor.getElementsByTagName('g'), function (g) {
						var groupPath = [],
							translate = getTranslate(g);
						
						each(g.getElementsByTagName('path'), function (path) {
							if (!path.skip) {
								groupPath = groupPath.concat(
									data.pathToArray(path.getAttribute('d'), translate)
								);
								
								path.skip = true;
							}
						});
						arr.push({
							name: getName(g),
							path: groupPath
						});
					});
				}
				
				// Iterate the remaining paths that are not parts of groups
				each(allPaths, function (path) {
					if (!path.skip) {
						arr.push({
							name: getName(path),
							path: data.pathToArray(path.getAttribute('d'), getTranslate(path))
						});
					}			
				});
				
				// Do the callback
				options.complete({
					series: [{
						data: arr
					}]
				});
			}
		});
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