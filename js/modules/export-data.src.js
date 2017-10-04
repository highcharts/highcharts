/**
 * Experimental data export module for Highcharts
 *
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */

// @todo
// - Deprecate repo and plugins page
// - Before official release, set up systematic tests for all series types

/* eslint max-len: ["warn", 80, 4] */
'use strict';
import Highcharts from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Chart.js';

var each = Highcharts.each,
	pick = Highcharts.pick,
	win = Highcharts.win,
	doc = win.document,
	seriesTypes = Highcharts.seriesTypes,
	downloadAttrSupported = doc.createElement('a').download !== undefined;

Highcharts.setOptions({
	/**
	 * @optionparent exporting
	 */
	exporting: {
		/**
		 * Options for exporting data to CSV or ExCel, or displaying the data
		 * in a HTML table or a JavaScript structure. Requires the
		 * `export-data.js` module. This module adds data export options to the
		 * export menu and provides functions like `Chart.getCSV`,
		 * `Chart.getTable`, `Chart.getDataRows` and `Chart.viewData`.
		 *
		 * @sample  highcharts/export-data/categorized/ Categorized data
		 * @sample  highcharts/export-data/stock-timeaxis/ Highstock time axis
		 * 
		 * @since 6.0.0
		 */
		csv: {
			/**
			 * Formatter callback for the column headers. Parameters are:
			 * - `item` - The series or axis object)
			 * - `key` -  The point key, for example y or z
			 * - `keyLength` - The amount of value keys for this item, for
			 *   example a range series has the keys `low` and `high` so the
			 *   key length is 2.
			 * 
			 * By default it returns the series name, followed by the key if
			 * there is more than one key. For the axis it returns the axis
			 * title or "Category" or "DateTime" by default.
			 *
			 * Return `false` to use Highcharts' proposed header.
			 * 
			 * @type {Function|null}
			 */
			columnHeaderFormatter: null,
			/**
			 * Which date format to use for exported dates on a datetime X axis.
			 * See `Highcharts.dateFormat`.
			 */
			dateFormat: '%Y-%m-%d %H:%M:%S',
			/**
			 * The item delimiter in the exported data. Use `;` for direct
			 * exporting to Excel.
			 */
			itemDelimiter: ',',
			/**
			 * The line delimiter in the exported data, defaults to a newline.
			 */
			lineDelimiter: '\n'
		},
		/**
		 * Export-data module required. Show a HTML table below the chart with 
		 * the chart's current data.
		 *
		 * @sample highcharts/export-data/showtable/ Show the table
		 * @since 6.0.0
		 */
		showTable: false
	},
	/**
	 * @optionparent lang
	 */
	lang: {
		/**
		 * Export-data module only. The text for the menu item.
		 * @since 6.0.0
		 */
		downloadCSV: 'Download CSV',
		/**
		 * Export-data module only. The text for the menu item.
		 * @since 6.0.0
		 */
		downloadXLS: 'Download XLS',
		/**
		 * Export-data module only. The text for the menu item.
		 * @since 6.0.0
		 */
		viewData: 'View data table'
	}
});

// Add an event listener to handle the showTable option
Highcharts.Chart.prototype.callbacks.push(function (chart) {
	Highcharts.addEvent(chart, 'render', function () {
		if (
			chart.options &&
			chart.options.exporting &&
			chart.options.exporting.showTable
		) {
			chart.viewData();
		}
	});
});

// Set up key-to-axis bindings. This is used when the Y axis is datetime or 
// categorized. For example in an arearange series, the low and high values
// sholud be formatted according to the Y axis type, and in order to link them
// we need this map.
Highcharts.Chart.prototype.setUpKeyToAxis = function () {
	if (seriesTypes.arearange) {
		seriesTypes.arearange.prototype.keyToAxis = {
			low: 'y',
			high: 'y'
		};
	}
};

/**
 * Export-data module required. Returns a two-dimensional array containing the
 * current chart data.
 *
 * @returns {Array.<Array>}
 *          The current chart data
 */
Highcharts.Chart.prototype.getDataRows = function () {
	var csvOptions = (this.options.exporting && this.options.exporting.csv) ||
			{},
		xAxis,
		xAxes = this.xAxis,
		rows = {},
		rowArr = [],
		dataRows,
		names = [],
		i,
		x,
		xTitle,
		// Options
		columnHeaderFormatter = function (item, key, keyLength) {

			if (csvOptions.columnHeaderFormatter) {
				var s = csvOptions.columnHeaderFormatter(item, key, keyLength);
				if (s !== false) {
					return s;
				}
			}

			
			if (item instanceof Highcharts.Axis) {
				return (item.options.title && item.options.title.text) ||
					(item.isDatetimeAxis ? 'DateTime' : 'Category');
			}
			return item ?
				item.name + (keyLength > 1 ? ' (' + key + ')' : '') :
				'Category';
		},
		xAxisIndices = [];

	// Loop the series and index values
	i = 0;

	this.setUpKeyToAxis();

	each(this.series, function (series) {
		var keys = series.options.keys,
			pointArrayMap = keys || series.pointArrayMap || ['y'],
			valueCount = pointArrayMap.length,
			xTaken = !series.requireSorting && {},
			categoryMap = {},
			datetimeValueAxisMap = {},
			xAxisIndex = Highcharts.inArray(series.xAxis, xAxes),
			j;

		// Map the categories for value axes
		each(pointArrayMap, function (prop) {

			var axisName = (
				(series.keyToAxis && series.keyToAxis[prop]) ||
				prop
			) + 'Axis';

			categoryMap[prop] = (
				series[axisName] &&
				series[axisName].categories
			) || [];
			datetimeValueAxisMap[prop] = (
				series[axisName] &&
				series[axisName].isDatetimeAxis
			);
		});

		if (
			series.options.includeInCSVExport !== false &&
			series.visible !== false // #55
		) {

			// Build a lookup for X axis index and the position of the first
			// series that belongs to that X axis. Includes -1 for non-axis
			// series types like pies.
			if (!Highcharts.find(xAxisIndices, function (index) {
				return index[0] === xAxisIndex;
			})) {
				xAxisIndices.push([xAxisIndex, i]);
			}

			// Add the column headers, usually the same as series names
			j = 0;
			while (j < valueCount) {
				names.push(columnHeaderFormatter(
					series,
					pointArrayMap[j],
					pointArrayMap.length
				));
				j++;
			}

			each(series.points, function (point, pIdx) {
				var key = point.x,
					prop,
					val;

				if (xTaken) {
					if (xTaken[key]) {
						key += '|' + pIdx;
					}
					xTaken[key] = true;
				}

				j = 0;

				if (!rows[key]) {
					// Generate the row
					rows[key] = [];
					// Contain the X values from one or more X axes
					rows[key].xValues = [];
				}
				rows[key].x = point.x;
				rows[key].xValues[xAxisIndex] = point.x;

				// Pies, funnels, geo maps etc. use point name in X row
				if (!series.xAxis || series.exportKey === 'name') {
					rows[key].name = point.name;
				}

				while (j < valueCount) {
					prop = pointArrayMap[j]; // y, z etc
					val = point[prop];
					rows[key][i + j] = pick(
						categoryMap[prop][val], // Y axis category if present
						datetimeValueAxisMap[prop] ?
							Highcharts.dateFormat(csvOptions.dateFormat, val) :
							null,
						val
					);
					j++;
				}

			});
			i = i + j;
		}
	});

	// Make a sortable array
	for (x in rows) {
		if (rows.hasOwnProperty(x)) {
			rowArr.push(rows[x]);
		}
	}

	var xAxisIndex, column;
	dataRows = [names];

	i = xAxisIndices.length;
	while (i--) { // Start from end to splice in
		xAxisIndex = xAxisIndices[i][0];
		column = xAxisIndices[i][1];
		xAxis = xAxes[xAxisIndex];

		// Sort it by X values
		rowArr.sort(function (a, b) { // eslint-disable-line no-loop-func
			return a.xValues[xAxisIndex] - b.xValues[xAxisIndex];
		});

		// Add header row
		xTitle = columnHeaderFormatter(xAxis);
		dataRows[0].splice(column, 0, xTitle);

		// Add the category column
		each(rowArr, function (row) { // eslint-disable-line no-loop-func
			var category = row.name;
			if (!category) {
				if (xAxis.isDatetimeAxis) {
					if (row.x instanceof Date) {
						row.x = row.x.getTime();
					}
					category = Highcharts.dateFormat(
						csvOptions.dateFormat,
						row.x
					);
				} else if (xAxis.categories) {
					category = pick(
						xAxis.names[row.x],
						xAxis.categories[row.x],
						row.x
					);
				} else {
					category = row.x;
				}
			}

			// Add the X/date/category
			row.splice(column, 0, category);
		});
	}
	dataRows = dataRows.concat(rowArr);

	return dataRows;
};

/**
 * Export-data module required. Returns the current chart data as a CSV string.
 *
 * @param  {Boolean} useLocalDecimalPoint
 *         Whether to use the local decimal point as detected from the browser.
 *         This makes it easier to export data to Excel in the same locale as
 *         the user is.
 *
 * @returns {String}
 *          CSV representation of the data
 */
Highcharts.Chart.prototype.getCSV = function (useLocalDecimalPoint) {
	var csv = '',
		rows = this.getDataRows(),
		csvOptions = this.options.exporting.csv,
		// use ';' for direct to Excel
		itemDelimiter = csvOptions.itemDelimiter,
		// '\n' isn't working with the js csv data extraction
		lineDelimiter = csvOptions.lineDelimiter;

	// Transform the rows to CSV
	each(rows, function (row, i) {
		var val = '',
			j = row.length,
			n = useLocalDecimalPoint ? (1.1).toLocaleString()[1] : '.';
		while (j--) {
			val = row[j];
			if (typeof val === 'string') {
				val = '"' + val + '"';
			}
			if (typeof val === 'number') {
				if (n === ',') {
					val = val.toString().replace('.', ',');
				}
			}
			row[j] = val;
		}
		// Add the values
		csv += row.join(itemDelimiter);

		// Add the line delimiter
		if (i < rows.length - 1) {
			csv += lineDelimiter;
		}
	});
	return csv;
};

/**
 * Export-data module required. Build a HTML table with the chart's current
 * data.
 *
 * @sample  highcharts/export-data/viewdata/ 
 *          View the data from the export menu
 * @returns {String}
 *          HTML representation of the data.
 */
Highcharts.Chart.prototype.getTable = function (useLocalDecimalPoint) {
	var html = '<table><thead>',
		rows = this.getDataRows();

	// Transform the rows to HTML
	each(rows, function (row, i) {
		var tag = i ? 'td' : 'th',
			val,
			j,
			n = useLocalDecimalPoint ? (1.1).toLocaleString()[1] : '.';

		html += '<tr>';
		for (j = 0; j < row.length; j = j + 1) {
			val = row[j];
			// Add the cell
			if (typeof val === 'number') {
				val = val.toString();
				if (n === ',') {
					val = val.replace('.', n);
				}
				html += '<' + tag + ' class="number">' + val + '</' + tag + '>';

			} else {
				html += '<' + tag + ' class="text">' + 
					(val === undefined ? '' : val) + '</' + tag + '>';
			}
		}

		html += '</tr>';

		// After the first row, end head and start body
		if (!i) {
			html += '</thead><tbody>';
		}

	});
	html += '</tbody></table>';

	return html;
};

/**
 * File download using download attribute if supported.
 *
 * @private
 */
Highcharts.Chart.prototype.fileDownload = function (href, extension, content) {
	var a,
		blobObject,
		name;

	if (this.options.exporting.filename) {
		name = this.options.exporting.filename;
	} else if (this.title) {
		name = this.title.textStr.replace(/ /g, '-').toLowerCase();
	} else {
		name = 'chart';
	}

	// MS specific. Check this first because of bug with Edge (#76)
	if (win.Blob && win.navigator.msSaveOrOpenBlob) {
		// Falls to msSaveOrOpenBlob if download attribute is not supported
		blobObject = new win.Blob(
			['\uFEFF' + content], // #7084
			{ type: 'text/csv' }
		);
		win.navigator.msSaveOrOpenBlob(blobObject, name + '.' + extension);

	// Download attribute supported
	} else if (downloadAttrSupported) {
		a = doc.createElement('a');
		a.href = href;
		a.download = name + '.' + extension;
		this.container.appendChild(a); // #111
		a.click();
		a.remove();

	} else {
		Highcharts.error('The browser doesn\'t support downloading files');
	}
};

/**
 * Call this on click of 'Download CSV' button
 *
 * @private
 */
Highcharts.Chart.prototype.downloadCSV = function () {
	var csv = this.getCSV(true);
	this.fileDownload(
		'data:text/csv,\uFEFF' + encodeURIComponent(csv),
		'csv',
		csv,
		'text/csv'
	);
};

/**
 * Call this on click of 'Download XLS' button
 *
 * @private
 */
Highcharts.Chart.prototype.downloadXLS = function () {
	var uri = 'data:application/vnd.ms-excel;base64,',
		template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" ' +
			'xmlns:x="urn:schemas-microsoft-com:office:excel" ' +
			'xmlns="http://www.w3.org/TR/REC-html40">' +
			'<head><!--[if gte mso 9]><xml><x:ExcelWorkbook>' +
			'<x:ExcelWorksheets><x:ExcelWorksheet>' +
			'<x:Name>Ark1</x:Name>' +
			'<x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>' +
			'</x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook>' +
			'</xml><![endif]-->' +
			'<style>td{border:none;font-family: Calibri, sans-serif;} ' +
			'.number{mso-number-format:"0.00";} ' +
			'.text{ mso-number-format:"\@";}</style>' +
			'<meta name=ProgId content=Excel.Sheet>' +
			'<meta charset=UTF-8>' +
			'</head><body>' +
			this.getTable(true) +
			'</body></html>',
		base64 = function (s) {
			return win.btoa(unescape(encodeURIComponent(s))); // #50
		};
	this.fileDownload(
		uri + base64(template),
		'xls',
		template,
		'application/vnd.ms-excel'
	);
};

/**
 * Export-data module required. View the data in a table below the chart.
 */
Highcharts.Chart.prototype.viewData = function () {
	if (!this.dataTableDiv) {
		this.dataTableDiv = doc.createElement('div');
		this.dataTableDiv.className = 'highcharts-data-table';

		// Insert after the chart container
		this.renderTo.parentNode.insertBefore(
			this.dataTableDiv,
			this.renderTo.nextSibling
		);
	}

	this.dataTableDiv.innerHTML = this.getTable();
};


// Add "Download CSV" to the exporting menu.
var exportingOptions = Highcharts.getOptions().exporting;
if (exportingOptions) {

	Highcharts.extend(exportingOptions.menuItemDefinitions, {
		downloadCSV: {
			textKey: 'downloadCSV',
			onclick: function () {
				this.downloadCSV();
			}
		},
		downloadXLS: {
			textKey: 'downloadXLS',
			onclick: function () {
				this.downloadXLS();
			}
		},
		viewData: {
			textKey: 'viewData',
			onclick: function () {
				this.viewData();
			}
		}
	});

	exportingOptions.buttons.contextButton.menuItems.push(
		'separator',
		'downloadCSV',
		'downloadXLS',
		'viewData'
	);
}

// Series specific
if (seriesTypes.map) {
	seriesTypes.map.prototype.exportKey = 'name';
}
if (seriesTypes.mapbubble) {
	seriesTypes.mapbubble.prototype.exportKey = 'name';
}
if (seriesTypes.treemap) {
	seriesTypes.treemap.prototype.exportKey = 'name';
}
