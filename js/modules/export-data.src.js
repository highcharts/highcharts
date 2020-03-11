/* *
 *
 *  Experimental data export module for Highcharts
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
// @todo
// - Set up systematic tests for all series types, paired with tests of the data
//   module importing the same data.
'use strict';
import Highcharts from '../parts/Globals.js';
/**
 * Function callback to execute while data rows are processed for exporting.
 * This allows the modification of data rows before processed into the final
 * format.
 *
 * @callback Highcharts.ExportDataCallbackFunction
 * @extends Highcharts.EventCallbackFunction<Highcharts.Chart>
 *
 * @param {Highcharts.Chart} this
 * Chart context where the event occured.
 *
 * @param {Highcharts.ExportDataEventObject} event
 * Event object with data rows that can be modified.
 */
/**
 * Contains information about the export data event.
 *
 * @interface Highcharts.ExportDataEventObject
 */ /**
* Contains the data rows for the current export task and can be modified.
* @name Highcharts.ExportDataEventObject#dataRows
* @type {Array<Array<string>>}
*/
import U from '../parts/Utilities.js';
var defined = U.defined, extend = U.extend, isObject = U.isObject, pick = U.pick;
import '../parts/Chart.js';
import '../mixins/ajax.js';
import '../mixins/download-url.js';
var win = Highcharts.win, doc = win.document, seriesTypes = Highcharts.seriesTypes, downloadURL = Highcharts.downloadURL, fireEvent = Highcharts.fireEvent;
// Can we add this to utils? Also used in screen-reader.js
/**
 * HTML encode some characters vulnerable for XSS.
 * @private
 * @param  {string} html The input string
 * @return {string} The excaped string
 */
function htmlencode(html) {
    return html
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}
Highcharts.setOptions({
    /**
     * Callback that fires while exporting data. This allows the modification of
     * data rows before processed into the final format.
     *
     * @type      {Highcharts.ExportDataCallbackFunction}
     * @context   Highcharts.Chart
     * @requires  modules/export-data
     * @apioption chart.events.exportData
     */
    /**
     * When set to `false` will prevent the series data from being included in
     * any form of data export.
     *
     * Since version 6.0.0 until 7.1.0 the option was existing undocumented
     * as `includeInCSVExport`.
     *
     * @type      {boolean}
     * @since     7.1.0
     * @requires  modules/export-data
     * @apioption plotOptions.series.includeInDataExport
     */
    /**
     * @optionparent exporting
     * @private
     */
    exporting: {
        /**
         * Caption for the data table. Same as chart title by default. Set to
         * `false` to disable.
         *
         * @sample highcharts/export-data/multilevel-table
         *         Multiple table headers
         *
         * @type      {boolean|string}
         * @since     6.0.4
         * @requires  modules/export-data
         * @apioption exporting.tableCaption
         */
        /**
         * Options for exporting data to CSV or ExCel, or displaying the data
         * in a HTML table or a JavaScript structure.
         *
         * This module adds data export options to the export menu and provides
         * functions like `Chart.getCSV`, `Chart.getTable`, `Chart.getDataRows`
         * and `Chart.viewData`.
         *
         * The XLS converter is limited and only creates a HTML string that is
         * passed for download, which works but creates a warning before
         * opening. The workaround for this is to use a third party XLSX
         * converter, as demonstrated in the sample below.
         *
         * @sample  highcharts/export-data/categorized/ Categorized data
         * @sample  highcharts/export-data/stock-timeaxis/ Highstock time axis
         * @sample  highcharts/export-data/xlsx/
         *          Using a third party XLSX converter
         *
         * @since    6.0.0
         * @requires modules/export-data
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
             * If [useMultiLevelHeaders](#exporting.useMultiLevelHeaders) is
             * true, columnHeaderFormatter by default returns an object with
             * columnTitle and topLevelColumnTitle for each key. Columns with
             * the same topLevelColumnTitle have their titles merged into a
             * single cell with colspan for table/Excel export.
             *
             * If `useMultiLevelHeaders` is false, or for CSV export, it returns
             * the series name, followed by the key if there is more than one
             * key.
             *
             * For the axis it returns the axis title or "Category" or
             * "DateTime" by default.
             *
             * Return `false` to use Highcharts' proposed header.
             *
             * @sample highcharts/export-data/multilevel-table
             *         Multiple table headers
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
             * Which decimal point to use for exported CSV. Defaults to the same
             * as the browser locale, typically `.` (English) or `,` (German,
             * French etc).
             *
             * @type  {string|null}
             * @since 6.0.4
             */
            decimalPoint: null,
            /**
             * The item delimiter in the exported data. Use `;` for direct
             * exporting to Excel. Defaults to a best guess based on the browser
             * locale. If the locale _decimal point_ is `,`, the `itemDelimiter`
             * defaults to `;`, otherwise the `itemDelimiter` defaults to `,`.
             *
             * @type {string|null}
             */
            itemDelimiter: null,
            /**
             * The line delimiter in the exported data, defaults to a newline.
             */
            lineDelimiter: '\n'
        },
        /**
         * Show a HTML table below the chart with the chart's current data.
         *
         * @sample highcharts/export-data/showtable/
         *         Show the table
         * @sample highcharts/studies/exporting-table-html
         *         Experiment with putting the table inside the subtitle to
         *         allow exporting it.
         *
         * @since    6.0.0
         * @requires modules/export-data
         */
        showTable: false,
        /**
         * Use multi level headers in data table. If [csv.columnHeaderFormatter
         * ](#exporting.csv.columnHeaderFormatter) is defined, it has to return
         * objects in order for multi level headers to work.
         *
         * @sample highcharts/export-data/multilevel-table
         *         Multiple table headers
         *
         * @since    6.0.4
         * @requires modules/export-data
         */
        useMultiLevelHeaders: true,
        /**
         * If using multi level table headers, use rowspans for headers that
         * have only one level.
         *
         * @sample highcharts/export-data/multilevel-table
         *         Multiple table headers
         *
         * @since    6.0.4
         * @requires modules/export-data
         */
        useRowspanHeaders: true
    },
    /**
     * @optionparent lang
     *
     * @private
     */
    lang: {
        /**
         * The text for the menu item.
         *
         * @since    6.0.0
         * @requires modules/export-data
         */
        downloadCSV: 'Download CSV',
        /**
         * The text for the menu item.
         *
         * @since    6.0.0
         * @requires modules/export-data
         */
        downloadXLS: 'Download XLS',
        /**
         * The text for the menu item.
         *
         * @since    6.0.0
         * @requires modules/export-data
         */
        viewData: 'View data table'
    }
});
/* eslint-disable no-invalid-this */
// Add an event listener to handle the showTable option
Highcharts.addEvent(Highcharts.Chart, 'render', function () {
    if (this.options &&
        this.options.exporting &&
        this.options.exporting.showTable &&
        !this.options.chart.forExport) {
        this.viewData();
    }
});
/* eslint-enable no-invalid-this */
/**
 * Set up key-to-axis bindings. This is used when the Y axis is datetime or
 * categorized. For example in an arearange series, the low and high values
 * should be formatted according to the Y axis type, and in order to link them
 * we need this map.
 *
 * @private
 * @function Highcharts.Chart#setUpKeyToAxis
 * @return {void}
 */
Highcharts.Chart.prototype.setUpKeyToAxis = function () {
    if (seriesTypes.arearange) {
        seriesTypes.arearange.prototype.keyToAxis = {
            low: 'y',
            high: 'y'
        };
    }
    if (seriesTypes.gantt) {
        seriesTypes.gantt.prototype.keyToAxis = {
            start: 'x',
            end: 'x'
        };
    }
};
/**
 * Export-data module required. Returns a two-dimensional array containing the
 * current chart data.
 *
 * @function Highcharts.Chart#getDataRows
 *
 * @param {boolean} [multiLevelHeaders]
 *        Use multilevel headers for the rows by default. Adds an extra row with
 *        top level headers. If a custom columnHeaderFormatter is defined, this
 *        can override the behavior.
 *
 * @return {Array<Array<(number|string)>>}
 *         The current chart data
 *
 * @fires Highcharts.Chart#event:exportData
 */
Highcharts.Chart.prototype.getDataRows = function (multiLevelHeaders) {
    var hasParallelCoords = this.hasParallelCoordinates, time = this.time, csvOptions = ((this.options.exporting && this.options.exporting.csv) || {}), xAxis, xAxes = this.xAxis, rows = {}, rowArr = [], dataRows, topLevelColumnTitles = [], columnTitles = [], columnTitleObj, i, x, xTitle, 
    // Options
    columnHeaderFormatter = function (item, key, keyLength) {
        if (csvOptions.columnHeaderFormatter) {
            var s = csvOptions.columnHeaderFormatter(item, key, keyLength);
            if (s !== false) {
                return s;
            }
        }
        if (!item) {
            return 'Category';
        }
        if (item instanceof Highcharts.Axis) {
            return (item.options.title && item.options.title.text) ||
                (item.isDatetimeAxis ? 'DateTime' : 'Category');
        }
        if (multiLevelHeaders) {
            return {
                columnTitle: keyLength > 1 ?
                    key :
                    item.name,
                topLevelColumnTitle: item.name
            };
        }
        return item.name + (keyLength > 1 ? ' (' + key + ')' : '');
    }, 
    // Map the categories for value axes
    getCategoryAndDateTimeMap = function (series, pointArrayMap, pIdx) {
        var categoryMap = {}, dateTimeValueAxisMap = {};
        pointArrayMap.forEach(function (prop) {
            var axisName = ((series.keyToAxis && series.keyToAxis[prop]) ||
                prop) + 'Axis', 
            // Points in parallel coordinates refers to all yAxis
            // not only `series.yAxis`
            axis = Highcharts.isNumber(pIdx) ?
                series.chart[axisName][pIdx] :
                series[axisName];
            categoryMap[prop] = (axis && axis.categories) || [];
            dateTimeValueAxisMap[prop] = (axis && axis.isDatetimeAxis);
        });
        return {
            categoryMap: categoryMap,
            dateTimeValueAxisMap: dateTimeValueAxisMap
        };
    }, xAxisIndices = [];
    // Loop the series and index values
    i = 0;
    this.setUpKeyToAxis();
    this.series.forEach(function (series) {
        var keys = series.options.keys, pointArrayMap = keys || series.pointArrayMap || ['y'], valueCount = pointArrayMap.length, xTaken = !series.requireSorting && {}, xAxisIndex = xAxes.indexOf(series.xAxis), categoryAndDatetimeMap = getCategoryAndDateTimeMap(series, pointArrayMap), mockSeries, j;
        if (series.options.includeInDataExport !== false &&
            !series.options.isInternal &&
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
            // Compute the column headers and top level headers, usually the
            // same as series names
            j = 0;
            while (j < valueCount) {
                columnTitleObj = columnHeaderFormatter(series, pointArrayMap[j], pointArrayMap.length);
                columnTitles.push(columnTitleObj.columnTitle || columnTitleObj);
                if (multiLevelHeaders) {
                    topLevelColumnTitles.push(columnTitleObj.topLevelColumnTitle ||
                        columnTitleObj);
                }
                j++;
            }
            mockSeries = {
                chart: series.chart,
                autoIncrement: series.autoIncrement,
                options: series.options,
                pointArrayMap: series.pointArrayMap
            };
            // Export directly from options.data because we need the uncropped
            // data (#7913), and we need to support Boost (#7026).
            series.options.data.forEach(function eachData(options, pIdx) {
                var key, prop, val, name, point;
                // In parallel coordinates chart, each data point is connected
                // to a separate yAxis, conform this
                if (hasParallelCoords) {
                    categoryAndDatetimeMap = getCategoryAndDateTimeMap(series, pointArrayMap, pIdx);
                }
                point = { series: mockSeries };
                series.pointClass.prototype.applyOptions.apply(point, [options]);
                key = point.x;
                name = series.data[pIdx] && series.data[pIdx].name;
                j = 0;
                // Pies, funnels, geo maps etc. use point name in X row
                if (!series.xAxis || series.exportKey === 'name') {
                    key = name;
                }
                if (xTaken) {
                    if (xTaken[key]) {
                        key += '|' + pIdx;
                    }
                    xTaken[key] = true;
                }
                if (!rows[key]) {
                    // Generate the row
                    rows[key] = [];
                    // Contain the X values from one or more X axes
                    rows[key].xValues = [];
                }
                rows[key].x = point.x;
                rows[key].name = name;
                rows[key].xValues[xAxisIndex] = point.x;
                while (j < valueCount) {
                    prop = pointArrayMap[j]; // y, z etc
                    val = point[prop];
                    rows[key][i + j] = pick(
                    // Y axis category if present
                    categoryAndDatetimeMap.categoryMap[prop][val], 
                    // datetime yAxis
                    categoryAndDatetimeMap.dateTimeValueAxisMap[prop] ?
                        time.dateFormat(csvOptions.dateFormat, val) :
                        null, 
                    // linear/log yAxis
                    val);
                    j++;
                }
            });
            i = i + j;
        }
    });
    // Make a sortable array
    for (x in rows) {
        if (Object.hasOwnProperty.call(rows, x)) {
            rowArr.push(rows[x]);
        }
    }
    var xAxisIndex, column;
    // Add computed column headers and top level headers to final row set
    dataRows = multiLevelHeaders ? [topLevelColumnTitles, columnTitles] :
        [columnTitles];
    i = xAxisIndices.length;
    while (i--) { // Start from end to splice in
        xAxisIndex = xAxisIndices[i][0];
        column = xAxisIndices[i][1];
        xAxis = xAxes[xAxisIndex];
        // Sort it by X values
        rowArr.sort(function (// eslint-disable-line no-loop-func
        a, b) {
            return a.xValues[xAxisIndex] - b.xValues[xAxisIndex];
        });
        // Add header row
        xTitle = columnHeaderFormatter(xAxis);
        dataRows[0].splice(column, 0, xTitle);
        if (multiLevelHeaders && dataRows[1]) {
            // If using multi level headers, we just added top level header.
            // Also add for sub level
            dataRows[1].splice(column, 0, xTitle);
        }
        // Add the category column
        rowArr.forEach(function (// eslint-disable-line no-loop-func
        row) {
            var category = row.name;
            if (xAxis && !defined(category)) {
                if (xAxis.isDatetimeAxis) {
                    if (row.x instanceof Date) {
                        row.x = row.x.getTime();
                    }
                    category = time.dateFormat(csvOptions.dateFormat, row.x);
                }
                else if (xAxis.categories) {
                    category = pick(xAxis.names[row.x], xAxis.categories[row.x], row.x);
                }
                else {
                    category = row.x;
                }
            }
            // Add the X/date/category
            row.splice(column, 0, category);
        });
    }
    dataRows = dataRows.concat(rowArr);
    fireEvent(this, 'exportData', { dataRows: dataRows });
    return dataRows;
};
/**
 * Export-data module required. Returns the current chart data as a CSV string.
 *
 * @function Highcharts.Chart#getCSV
 *
 * @param {boolean} [useLocalDecimalPoint]
 *        Whether to use the local decimal point as detected from the browser.
 *        This makes it easier to export data to Excel in the same locale as the
 *        user is.
 *
 * @return {string}
 *         CSV representation of the data
 */
Highcharts.Chart.prototype.getCSV = function (useLocalDecimalPoint) {
    var csv = '', rows = this.getDataRows(), csvOptions = this.options.exporting.csv, decimalPoint = pick(csvOptions.decimalPoint, csvOptions.itemDelimiter !== ',' && useLocalDecimalPoint ?
        (1.1).toLocaleString()[1] :
        '.'), 
    // use ';' for direct to Excel
    itemDelimiter = pick(csvOptions.itemDelimiter, decimalPoint === ',' ? ';' : ','), 
    // '\n' isn't working with the js csv data extraction
    lineDelimiter = csvOptions.lineDelimiter;
    // Transform the rows to CSV
    rows.forEach(function (row, i) {
        var val = '', j = row.length;
        while (j--) {
            val = row[j];
            if (typeof val === 'string') {
                val = '"' + val + '"';
            }
            if (typeof val === 'number') {
                if (decimalPoint !== '.') {
                    val = val.toString().replace('.', decimalPoint);
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
 * @sample highcharts/export-data/viewdata/
 *         View the data from the export menu
 *
 * @function Highcharts.Chart#getTable
 *
 * @param {boolean} [useLocalDecimalPoint]
 *        Whether to use the local decimal point as detected from the browser.
 *        This makes it easier to export data to Excel in the same locale as the
 *        user is.
 *
 * @return {string}
 *         HTML representation of the data.
 *
 * @fires Highcharts.Chart#event:afterGetTable
 */
Highcharts.Chart.prototype.getTable = function (useLocalDecimalPoint) {
    var html = '<table id="highcharts-data-table-' + this.index + '">', options = this.options, decimalPoint = useLocalDecimalPoint ? (1.1).toLocaleString()[1] : '.', useMultiLevelHeaders = pick(options.exporting.useMultiLevelHeaders, true), rows = this.getDataRows(useMultiLevelHeaders), rowLength = 0, topHeaders = useMultiLevelHeaders ? rows.shift() : null, subHeaders = rows.shift(), 
    // Compare two rows for equality
    isRowEqual = function (row1, row2) {
        var i = row1.length;
        if (row2.length === i) {
            while (i--) {
                if (row1[i] !== row2[i]) {
                    return false;
                }
            }
        }
        else {
            return false;
        }
        return true;
    }, 
    // Get table cell HTML from value
    getCellHTMLFromValue = function (tag, classes, attrs, value) {
        var val = pick(value, ''), className = 'text' + (classes ? ' ' + classes : '');
        // Convert to string if number
        if (typeof val === 'number') {
            val = val.toString();
            if (decimalPoint === ',') {
                val = val.replace('.', decimalPoint);
            }
            className = 'number';
        }
        else if (!value) {
            className = 'empty';
        }
        return '<' + tag + (attrs ? ' ' + attrs : '') +
            ' class="' + className + '">' +
            val + '</' + tag + '>';
    }, 
    // Get table header markup from row data
    getTableHeaderHTML = function (topheaders, subheaders, rowLength) {
        var html = '<thead>', i = 0, len = rowLength || subheaders && subheaders.length, next, cur, curColspan = 0, rowspan;
        // Clean up multiple table headers. Chart.getDataRows() returns two
        // levels of headers when using multilevel, not merged. We need to
        // merge identical headers, remove redundant headers, and keep it
        // all marked up nicely.
        if (useMultiLevelHeaders &&
            topheaders &&
            subheaders &&
            !isRowEqual(topheaders, subheaders)) {
            html += '<tr>';
            for (; i < len; ++i) {
                cur = topheaders[i];
                next = topheaders[i + 1];
                if (cur === next) {
                    ++curColspan;
                }
                else if (curColspan) {
                    // Ended colspan
                    // Add cur to HTML with colspan.
                    html += getCellHTMLFromValue('th', 'highcharts-table-topheading', 'scope="col" ' +
                        'colspan="' + (curColspan + 1) + '"', cur);
                    curColspan = 0;
                }
                else {
                    // Cur is standalone. If it is same as sublevel,
                    // remove sublevel and add just toplevel.
                    if (cur === subheaders[i]) {
                        if (options.exporting.useRowspanHeaders) {
                            rowspan = 2;
                            delete subheaders[i];
                        }
                        else {
                            rowspan = 1;
                            subheaders[i] = '';
                        }
                    }
                    else {
                        rowspan = 1;
                    }
                    html += getCellHTMLFromValue('th', 'highcharts-table-topheading', 'scope="col"' +
                        (rowspan > 1 ?
                            ' valign="top" rowspan="' + rowspan + '"' :
                            ''), cur);
                }
            }
            html += '</tr>';
        }
        // Add the subheaders (the only headers if not using multilevels)
        if (subheaders) {
            html += '<tr>';
            for (i = 0, len = subheaders.length; i < len; ++i) {
                if (typeof subheaders[i] !== 'undefined') {
                    html += getCellHTMLFromValue('th', null, 'scope="col"', subheaders[i]);
                }
            }
            html += '</tr>';
        }
        html += '</thead>';
        return html;
    };
    // Add table caption
    if (options.exporting.tableCaption !== false) {
        html += '<caption class="highcharts-table-caption">' + pick(options.exporting.tableCaption, (options.title.text ?
            htmlencode(options.title.text) :
            'Chart')) + '</caption>';
    }
    // Find longest row
    for (var i = 0, len = rows.length; i < len; ++i) {
        if (rows[i].length > rowLength) {
            rowLength = rows[i].length;
        }
    }
    // Add header
    html += getTableHeaderHTML(topHeaders, subHeaders, Math.max(rowLength, subHeaders.length));
    // Transform the rows to HTML
    html += '<tbody>';
    rows.forEach(function (row) {
        html += '<tr>';
        for (var j = 0; j < rowLength; j++) {
            // Make first column a header too. Especially important for
            // category axes, but also might make sense for datetime? Should
            // await user feedback on this.
            html += getCellHTMLFromValue(j ? 'td' : 'th', null, j ? '' : 'scope="row"', row[j]);
        }
        html += '</tr>';
    });
    html += '</tbody></table>';
    var e = { html: html };
    fireEvent(this, 'afterGetTable', e);
    return e.html;
};
/**
 * Get a blob object from content, if blob is supported
 *
 * @private
 * @param {string} content
 *        The content to create the blob from.
 * @param {string} type
 *        The type of the content.
 * @return {string|undefined}
 *         The blob object, or undefined if not supported.
 */
function getBlobFromContent(content, type) {
    var nav = win.navigator, webKit = (nav.userAgent.indexOf('WebKit') > -1 &&
        nav.userAgent.indexOf('Chrome') < 0), domurl = win.URL || win.webkitURL || win;
    try {
        // MS specific
        if (nav.msSaveOrOpenBlob && win.MSBlobBuilder) {
            var blob = new win.MSBlobBuilder();
            blob.append(content);
            return blob.getBlob('image/svg+xml');
        }
        // Safari requires data URI since it doesn't allow navigation to blob
        // URLs.
        if (!webKit) {
            return domurl.createObjectURL(new win.Blob(['\uFEFF' + content], // #7084
            { type: type }));
        }
    }
    catch (e) {
        // Ignore
    }
}
/**
 * Call this on click of 'Download CSV' button
 *
 * @private
 * @function Highcharts.Chart#downloadCSV
 * @return {void}
 */
Highcharts.Chart.prototype.downloadCSV = function () {
    var csv = this.getCSV(true);
    downloadURL(getBlobFromContent(csv, 'text/csv') ||
        'data:text/csv,\uFEFF' + encodeURIComponent(csv), this.getFilename() + '.csv');
};
/**
 * Call this on click of 'Download XLS' button
 *
 * @private
 * @function Highcharts.Chart#downloadXLS
 * @return {void}
 */
Highcharts.Chart.prototype.downloadXLS = function () {
    var uri = 'data:application/vnd.ms-excel;base64,', template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" ' +
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
        '</body></html>', base64 = function (s) {
        return win.btoa(unescape(encodeURIComponent(s))); // #50
    };
    downloadURL(getBlobFromContent(template, 'application/vnd.ms-excel') ||
        uri + base64(template), this.getFilename() + '.xls');
};
/**
 * Export-data module required. View the data in a table below the chart.
 *
 * @function Highcharts.Chart#viewData
 * @return {void}
 *
 * @fires Highcharts.Chart#event:afterViewData
 */
Highcharts.Chart.prototype.viewData = function () {
    if (!this.dataTableDiv) {
        this.dataTableDiv = doc.createElement('div');
        this.dataTableDiv.className = 'highcharts-data-table';
        // Insert after the chart container
        this.renderTo.parentNode.insertBefore(this.dataTableDiv, this.renderTo.nextSibling);
    }
    this.dataTableDiv.innerHTML = this.getTable();
    fireEvent(this, 'afterViewData', this.dataTableDiv);
};
// Add "Download CSV" to the exporting menu.
var exportingOptions = Highcharts.getOptions().exporting;
if (exportingOptions) {
    extend(exportingOptions.menuItemDefinitions, {
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
    if (exportingOptions.buttons) {
        exportingOptions.buttons.contextButton.menuItems.push('separator', 'downloadCSV', 'downloadXLS', 'viewData');
    }
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
