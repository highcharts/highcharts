/**
 * @license Data plugin for Highcharts
 *
 * (c) 2012-2014 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */

/*
 * The Highcharts Data plugin is a utility to ease parsing of input sources like
 * CSV, HTML tables or grid views into basic configuration options for use 
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
 * - googleSpreadsheetKey : String 
 * A Google Spreadsheet key. See https://developers.google.com/gdata/samples/spreadsheet_sample
 * for general information on GS.
 *
 * - googleSpreadsheetWorksheet : String 
 * The Google Spreadsheet worksheet. The available id's can be read from 
 * https://spreadsheets.google.com/feeds/worksheets/{key}/public/basic
 *
 * - itemDelimiter : String
 * Item or cell delimiter for parsing CSV. Defaults to the tab character "\t" if a tab character
 * is found in the CSV string, if not it defaults to ",".
 *
 * - lineDelimiter : String
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
 * - switchRowsAndColumns : Boolean
 * Switch rows and columns of the input data, so that this.columns effectively becomes the
 * rows of the data set, and the rows are interpreted as series.
 *
 * - table : String|HTMLElement
 * A HTML table or the id of such to be parsed as input data. Related options ara startRow,
 * endRow, startColumn and endColumn to delimit what part of the table is used.
 */

// JSLint options:
/*global jQuery */

(function (Highcharts) {	
	
	// Utilities
	var each = Highcharts.each;
	
	
	// The Data constructor
	var Data = function (dataOptions, chartOptions) {
		this.init(dataOptions, chartOptions);
	};
	
	// Set the prototype properties
	Highcharts.extend(Data.prototype, {
		
	/**
	 * Initialize the Data object with the given options
	 */
	init: function (options, chartOptions) {
		this.options = options;
		this.chartOptions = chartOptions;
		this.columns = options.columns || this.rowsToColumns(options.rows) || [];

		// No need to parse or interpret anything
		if (this.columns.length) {
			this.dataFound();

		// Parse and interpret
		} else {

			// Parse a CSV string if options.csv is given
			this.parseCSV();
			
			// Parse a HTML table if options.table is given
			this.parseTable();

			// Parse a Google Spreadsheet 
			this.parseGoogleSpreadsheet();	
		}

	},

	/**
	 * Get the column distribution. For example, a line series takes a single column for 
	 * Y values. A range series takes two columns for low and high values respectively,
	 * and an OHLC series takes four columns.
	 */
	getColumnDistribution: function () {
		var chartOptions = this.chartOptions,
			options = this.options,
			xColumns = [],
			getValueCount = function (type) {
				return (Highcharts.seriesTypes[type || 'line'].prototype.pointArrayMap || [0]).length;
			},
			getPointArrayMap = function (type) {
				return Highcharts.seriesTypes[type || 'line'].prototype.pointArrayMap;
			},
			globalType = chartOptions && chartOptions.chart && chartOptions.chart.type,
			individualCounts = [],
			seriesBuilders = [],
			seriesIndex,
			i;

		each((chartOptions && chartOptions.series) || [], function (series) {
			individualCounts.push(getValueCount(series.type || globalType));
		});

		// Collect the x-column indexes from seriesMapping
		each((options && options.seriesMapping) || [], function (mapping) {
			xColumns.push(mapping.x || 0);
		});

		// If there are no defined series with x-columns, use the first column as x column
		if (xColumns.length === 0) {
			xColumns.push(0);
		}

		// Loop all seriesMappings and constructs SeriesBuilders from
		// the mapping options.
		each((options && options.seriesMapping) || [], function (mapping) {
			var builder = new SeriesBuilder(),
				numberOfValueColumnsNeeded = individualCounts[seriesIndex] || getValueCount(globalType),
				seriesArr = (chartOptions && chartOptions.series) || [],
				series = seriesArr[seriesIndex] || {},
				pointArrayMap = getPointArrayMap(series.type || globalType) || ['y'];

			// Add an x reader from the x property or from an undefined column
			// if the property is not set. It will then be auto populated later.
			builder.addXReader(mapping.x);

			// Add all column mappings
			for (var name in mapping) {
				if (mapping.hasOwnProperty(name) && name !== 'x') {
					builder.addColumnReader(mapping[name], name);
				}
			}

			// Add missing columns
			for (i = 0; i < numberOfValueColumnsNeeded; i++) {
				if (!builder.hasReader(pointArrayMap[i])) {
					builder.addNextColumnReader(pointArrayMap[i]);
				}
			}

			seriesBuilders.push(builder);
			seriesIndex++;
		});

		var globalPointArrayMap = getPointArrayMap(globalType);
		if (globalPointArrayMap === undefined) {
			globalPointArrayMap = ['y'];
		}

		this.valueCount = {
			global: getValueCount(globalType),
			xColumns: xColumns,
			individual: individualCounts,
			seriesBuilders: seriesBuilders,
			globalPointArrayMap: globalPointArrayMap
		};
	},

	/**
	 * When the data is parsed into columns, either by CSV, table, GS or direct input,
	 * continue with other operations.
	 */
	dataFound: function () {
		
		if (this.options.switchRowsAndColumns) {
			this.columns = this.rowsToColumns(this.columns);
		}

		// Interpret the info about series and columns
		this.getColumnDistribution();

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
		var self = this,
			options = this.options,
			csv = options.csv,
			columns = this.columns,
			startRow = options.startRow || 0,
			endRow = options.endRow || Number.MAX_VALUE,
			startColumn = options.startColumn || 0,
			endColumn = options.endColumn || Number.MAX_VALUE,
			itemDelimiter,
			lines,
			activeRowNo = 0;
			
		if (csv) {
			
			lines = csv
				.replace(/\r\n/g, "\n") // Unix
				.replace(/\r/g, "\n") // Mac
				.split(options.lineDelimiter || "\n");

			itemDelimiter = options.itemDelimiter || (csv.indexOf('\t') !== -1 ? '\t' : ',');
			
			each(lines, function (line, rowNo) {
				var trimmed = self.trim(line),
					isComment = trimmed.indexOf('#') === 0,
					isBlank = trimmed === '',
					items;
				
				if (rowNo >= startRow && rowNo <= endRow && !isComment && !isBlank) {
					items = line.split(itemDelimiter);
					each(items, function (item, colNo) {
						if (colNo >= startColumn && colNo <= endColumn) {
							if (!columns[colNo - startColumn]) {
								columns[colNo - startColumn] = [];					
							}
							
							columns[colNo - startColumn][activeRowNo] = item;
						}
					});
					activeRowNo += 1;
				}
			});

			this.dataFound();
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
			endColumn = options.endColumn || Number.MAX_VALUE;

		if (table) {
			
			if (typeof table === 'string') {
				table = document.getElementById(table);
			}
			
			each(table.getElementsByTagName('tr'), function (tr, rowNo) {
				if (rowNo >= startRow && rowNo <= endRow) {
					each(tr.children, function (item, colNo) {
						if ((item.tagName === 'TD' || item.tagName === 'TH') && colNo >= startColumn && colNo <= endColumn) {
							if (!columns[colNo - startColumn]) {
								columns[colNo - startColumn] = [];					
							}
							
							columns[colNo - startColumn][rowNo - startRow] = item.innerHTML;
						}
					});
				}
			});

			this.dataFound(); // continue
		}
	},

	/**
	 */
	parseGoogleSpreadsheet: function () {
		var self = this,
			options = this.options,
			googleSpreadsheetKey = options.googleSpreadsheetKey,
			columns = this.columns,
			startRow = options.startRow || 0,
			endRow = options.endRow || Number.MAX_VALUE,
			startColumn = options.startColumn || 0,
			endColumn = options.endColumn || Number.MAX_VALUE,
			gr, // google row
			gc; // google column

		if (googleSpreadsheetKey) {
			jQuery.getJSON('https://spreadsheets.google.com/feeds/cells/' + 
				  googleSpreadsheetKey + '/' + (options.googleSpreadsheetWorksheet || 'od6') +
					  '/public/values?alt=json-in-script&callback=?',
					  function (json) {
					
				// Prepare the data from the spreadsheat
				var cells = json.feed.entry,
					cell,
					cellCount = cells.length,
					colCount = 0,
					rowCount = 0,
					i;
			
				// First, find the total number of columns and rows that 
				// are actually filled with data
				for (i = 0; i < cellCount; i++) {
					cell = cells[i];
					colCount = Math.max(colCount, cell.gs$cell.col);
					rowCount = Math.max(rowCount, cell.gs$cell.row);			
				}
			
				// Set up arrays containing the column data
				for (i = 0; i < colCount; i++) {
					if (i >= startColumn && i <= endColumn) {
						// Create new columns with the length of either end-start or rowCount
						columns[i - startColumn] = [];

						// Setting the length to avoid jslint warning
						columns[i - startColumn].length = Math.min(rowCount, endRow - startRow);
					}
				}
				
				// Loop over the cells and assign the value to the right
				// place in the column arrays
				for (i = 0; i < cellCount; i++) {
					cell = cells[i];
					gr = cell.gs$cell.row - 1; // rows start at 1
					gc = cell.gs$cell.col - 1; // columns start at 1

					// If both row and col falls inside start and end
					// set the transposed cell value in the newly created columns
					if (gc >= startColumn && gc <= endColumn &&
						gr >= startRow && gr <= endRow) {
						columns[gc - startColumn][gr - startRow] = cell.content.$t;
					}
				}
				self.dataFound();
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
		return typeof str === 'string' ? str.replace(/^\s+|\s+$/g, '') : str;
	},
	
	/**
	 * Parse numeric cells in to number types and date types in to true dates.
	 */
	parseTypes: function () {
		var columns = this.columns,
			col = columns.length, 
			row,
			val,
			floatVal,
			trimVal,
			isXColumn,
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
					// Only allow parsing of dates if this column is an x-column
					isXColumn = this.valueCount.xColumns.indexOf(col) !== -1;
					if (isXColumn && typeof dateVal === 'number' && !isNaN(dateVal)) { // is date
						columns[col][row] = dateVal;
						columns[col].isDatetime = true;
					
					} else { // string
						columns[col][row] = trimVal === '' ? null : trimVal;
					}
				}
				
			}
		}
	},
	
	/**
	 * A collection of available date formats, extendable from the outside to support
	 * custom date formats.
	 */
	dateFormats: {
		'YYYY-mm-dd': {
			regex: '^([0-9]{4})-([0-9]{2})-([0-9]{2})$',
			parser: function (match) {
				return Date.UTC(+match[1], match[2] - 1, +match[3]);
			}
		}
	},
	
	/**
	 * Parse a date and return it as a number. Overridable through options.parseDate.
	 */
	parseDate: function (val) {
		var parseDate = this.options.parseDate,
			ret,
			key,
			format,
			match;

		if (parseDate) {
			ret = parseDate(val);
		}
			
		if (typeof val === 'string') {
			for (key in this.dateFormats) {
				format = this.dateFormats[key];
				match = val.match(format.regex);
				if (match) {
					ret = format.parser(match);
				}
			}
		}
		return ret;
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
			xColumns = [],
			type,
			options = this.options,
			series,
			data,
			i,
			j,
			seriesIndex,
			allSeriesBuilders = [],
			builder;
			
		xColumns.length = columns.length;
		if (options.complete) {

			// Get the names and shift the top row
			for (i = 0; i < columns.length; i++) {
				if (this.headerRow === 0) {
					columns[i].name = columns[i].shift();
				}
			}
			
			// Use the next columns for series
			series = [];
			var columnCursor = new ColumnCursor(columns.length, this.valueCount.seriesBuilders);

			// Populate defined series
			for (seriesIndex = 0; seriesIndex < this.valueCount.seriesBuilders.length; seriesIndex++) {
				builder = this.valueCount.seriesBuilders[seriesIndex];

				// If the builder can be populated with remaining columns, then add it to allBuilders
				if (builder.populateColumns(columnCursor)) {
					allSeriesBuilders.push(builder);
				}
			}

			// Populate dynamic series
			while (columnCursor.freeIndexes.length > 0) {
				builder = new SeriesBuilder();
				builder.addXReader(0);
				columnCursor.addUsedIndex(0);

				for (i = 0; i < this.valueCount.global; i++) {
					builder.addNextColumnReader(this.valueCount.globalPointArrayMap[i]);
				}

				// If the builder can be populated with remaining columns, then add it to allBuilders
				if (builder.populateColumns(columnCursor)) {
					allSeriesBuilders.push(builder);
				}
			}

			// Read data for all builders
			for (seriesIndex = 0; seriesIndex < allSeriesBuilders.length; seriesIndex++) {
				builder = allSeriesBuilders[seriesIndex];

				// Iterate down the cells of each column and add data to the series
				data = [];
				for (j = 0; j < columns[0].length; j++) { // TODO: which column's length should we use here
					data[j] = builder.read(columns, j);
				}

				// Add the series
				series[seriesIndex] = {
					name: builder.getName(),
					data: data
				};
			}

			// Get the data-type from the first series x column
			if (allSeriesBuilders.length > 0 && allSeriesBuilders[0].readers.length > 0) {
				var typeCol = columns[allSeriesBuilders[0].readers[0].columnIndex];
				if (typeCol !== undefined) {
					if (typeCol.isDatetime) {
						type = 'datetime';
					} else if (!typeCol.isNumeric) {
						type = 'category';
					}
				}
			}

			// Do the callback
			options.complete({
				xAxis: {
					type: type
				},
				series: series
			});
		}
	}
	});
	
	// Register the Data prototype and data function on Highcharts
	Highcharts.Data = Data;
	Highcharts.data = function (options, chartOptions) {
		return new Data(options, chartOptions);
	};

	// Extend Chart.init so that the Chart constructor accepts a new configuration
	// option group, data.
	Highcharts.wrap(Highcharts.Chart.prototype, 'init', function (proceed, userOptions, callback) {
		var chart = this;

		if (userOptions && userOptions.data) {
			Highcharts.data(Highcharts.extend(userOptions.data, {
				complete: function (dataOptions) {
					
					// Merge series configs
					if (userOptions.series) {
						each(userOptions.series, function (series, i) {
							userOptions.series[i] = Highcharts.merge(series, dataOptions.series[i]);
						});
					}

					// Do the merge
					userOptions = Highcharts.merge(dataOptions, userOptions);

					proceed.call(chart, userOptions, callback);
				}
			}), userOptions);
		} else {
			proceed.call(chart, userOptions, callback);
		}
	});

	/**
	 * Creates a new SeriesBuilder. A SeriesBuilder consists of a number
	 * of ColumnReaders that reads columns and give them a name.
	 * Ex: A series builder can be constructed to read column 3 as 'x' and
	 * column 7 and 8 as 'y1' and 'y2'.
	 * The output would then be points/rows of the form {x: 11, y1: 22, y2: 33}
	 * 
	 * The name of the builder is taken from the second column. In the above
	 * example it would be the column with index 7.
	 * @constructor
	 */
	function SeriesBuilder() {
		this.readers = [];
		this.pointIsArray = true;
	}

	/**
	 * Populates readers with column indexes. A reader can be added without
	 * a specific index and for those readers the index is taken sequentially
	 * from the free columns (this is handled by the ColumnCursor instance).
	 * @param columnCursor
	 * @returns {boolean}
	 */
	SeriesBuilder.prototype.populateColumns = function (columnCursor) {
		var builder = this,
			enoughColumns = true;

		// Loop each reader and give it an index if its missing.
		// The columnCursor.next() will return undefined if there
		// are no more columns.
		each(builder.readers, function (reader) {
			if (!reader.hasIndex()) {
				reader.setIndex(columnCursor.next());
			}
		});

		// Now, all readers should have columns mapped. If not
		// then return false to signal that this series should
		// not be added.
		each(builder.readers, function (reader) {
			if (!reader.hasIndex()) {
				enoughColumns = false;
			}
		});

		return enoughColumns;
	};

	/**
	 * Reads a row from the dataset and returns a point or array depending
	 * on the names of the readers.
	 * @param columns
	 * @param rowIndex
	 * @returns {Array | Object}
	 */
	SeriesBuilder.prototype.read = function (columns, rowIndex) {
		var builder = this,
			pointIsArray = builder.pointIsArray,
			point = pointIsArray ? [] : {};

		// Loop each reader and ask it to read its value.
		// Then, build an array or point based on the readers names.
		each(builder.readers, function (reader) {
			var value = reader.read(columns, rowIndex);
			if (pointIsArray) {
				point.push(value);
			} else {
				point[reader.getConfigName()] = value; 
			}
		});

		// The name comes from the first column (excluding the x column)
		if (this.name === undefined && builder.readers.length >= 2) {
			var columnIndexes = builder.getReferencedColumnIndexes();
			if (columnIndexes.length >= 2) {
				// remove the first one (x col)
				columnIndexes.shift();

				// Sort the remaining
				columnIndexes.sort();

				// Now use the lowest index as name column
				this.name = columns[columnIndexes.shift()].name;
			}
		}

		return point;
	};

	/**
	 * Creates and adds ColumnReader from the given columnIndex and configName.
	 * ColumnIndex can be undefined and in that case the reader will be given
	 * an index when columns are populated.
	 * @param columnIndex {Number | undefined}
	 * @param configName
	 */
	SeriesBuilder.prototype.addColumnReader = function (columnIndex, configName) {
		this.readers.push(new ColumnReader(columnIndex, configName));

		if (!(configName === 'x' || configName === 'y' || configName === undefined)) {
			this.pointIsArray = false;
		}
	};

	/**
	 * Adds a columnReader for the x column.
	 * @param columnIndex
	 */
	SeriesBuilder.prototype.addXReader = function (columnIndex) {
		this.addColumnReader(columnIndex, 'x');
	};

	/**
	 * Creates and adds a column reader for the next free column index.
	 * @param configName
	 */
	SeriesBuilder.prototype.addNextColumnReader = function (configName) {
		this.addColumnReader(undefined, configName);
	};

	/**
	 * Returns an array of column indexes that the builder will use when
	 * reading data.
	 * @returns {Array}
	 */
	SeriesBuilder.prototype.getReferencedColumnIndexes = function () {
		var i,
			referencedColumnIndexes = [],
			columnReader;
		
		for (i = 0; i < this.readers.length; i = i + 1) {
			columnReader = this.readers[i];
			if (columnReader.hasIndex()) {
				referencedColumnIndexes.push(columnReader.getIndex());
			}
		}

		return referencedColumnIndexes;
	};

	/**
	 * Returns true if the builder has a reader for the given configName.
	 * @param configName
	 * @returns {boolean}
	 */
	SeriesBuilder.prototype.hasReader = function (configName) {
		var i, columnReader;
		for (i = 0; i < this.readers.length; i = i + 1) {
			columnReader = this.readers[i];
			if (columnReader.getConfigName() === configName) {
				return true;
			}
		}

		return false;
	};

	/**
	 * Returns the name that the created series should have.
	 * @returns {String}
	 */
	SeriesBuilder.prototype.getName = function () {
		return this.name;
	};

	/**
	 * The column cursor keeps track of which columns are free and which
	 * are used. Then the free columns are used to populate dynamically
	 * added series.
	 * @param numberOfColumns
	 * @param seriesBuilders
	 * @constructor
	 */
	function ColumnCursor(numberOfColumns, seriesBuilders) {
		var s,
			i,
			freeIndexes = [],
			freeIndexValues = [],
			referencedIndexes;

		// Add all columns as free
		for (i = 0; i < numberOfColumns; i = i + 1) {
			freeIndexes.push(true);
		}

		// Loop all defined builders and remove their referenced columns
		for (s = 0; s < seriesBuilders.length; s = s + 1) {
			referencedIndexes = seriesBuilders[s].getReferencedColumnIndexes();

			for (i = 0; i < referencedIndexes.length; i = i + 1) {
				freeIndexes[referencedIndexes[i]] = false;
			}
		}

		// Collect the values for the free indexes
		for (i = 0; i < freeIndexes.length; i = i + 1) {
			if (freeIndexes[i]) {
				freeIndexValues.push(i);
			}
		}

		this.freeIndexes = freeIndexValues;
	}

	/**
	 * Mark an index as used (not free).
	 * @param usedIndex {Number}
	 */
	ColumnCursor.prototype.addUsedIndex = function (usedIndex) {
		var index = this.freeIndexes.indexOf(usedIndex);
		if (index !== -1) {
			this.freeIndexes.splice(index, 1);
		}
	};

	/**
	 * Returns the next free index or undefined if there are no
	 * more free indexes.
	 * @returns {Number | undefined}
	 */
	ColumnCursor.prototype.next = function () {
		return this.freeIndexes.shift();
	};

	/**
	 * Creates a new ColumnReader that reads data from a column by the column index.
	 * @param columnIndex or undefined
	 * @param configName or undefined
	 * @constructor
	 */
	function ColumnReader(columnIndex, configName) {
		this.columnIndex = columnIndex;
		this.configName = configName;
	}

	/**
	 * Reads and returns the value in a cell in the data set.
	 * @param columns
	 * @param rowIndex
	 * @returns {*}
	 */
	ColumnReader.prototype.read = function (columns, rowIndex) {
		return columns[this.columnIndex][rowIndex];
	};

	/**
	 * Returns the config name for this column reader. Ex: 'x' or 'label'.
	 * @returns {*}
	 */
	ColumnReader.prototype.getConfigName = function () {
		return this.configName;
	};

	/**
	 * Returns true if the reader has its index specified.
	 * @returns {boolean}
	 */
	ColumnReader.prototype.hasIndex = function () {
		return this.columnIndex !== undefined;
	};

	/**
	 * Sets the column index for the reader.
	 * @param index {Number}
	 */
	ColumnReader.prototype.setIndex = function (index) {
		this.columnIndex = index;
	};

	/**
	 * Returns the index that the reader reads from.
	 * @returns {Number}
	 */
	ColumnReader.prototype.getIndex = function () {
		return this.columnIndex;
	};

/*	// Exposed for testing
	window.ColumnReader = ColumnReader;
	window.ColumnCursor = ColumnCursor;
	window.SeriesBuilder = SeriesBuilder;//*/

}(Highcharts));
