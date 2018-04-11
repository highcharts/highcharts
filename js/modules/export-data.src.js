/**
 * Experimental data export module for Highcharts
 *
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */

// @todo
// - Set up systematic tests for all series types, paired with tests of the data
//   module importing the same data.

'use strict';
import Highcharts from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Chart.js';
import '../mixins/ajax.js';

var defined = Highcharts.defined,
    each = Highcharts.each,
    pick = Highcharts.pick,
    win = Highcharts.win,
    doc = win.document,
    seriesTypes = Highcharts.seriesTypes,
    downloadAttrSupported = doc.createElement('a').download !== undefined;

// Can we add this to utils? Also used in screen-reader.js
/**
 * HTML encode some characters vulnerable for XSS.
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
     * @optionparent exporting
     */
    exporting: {

        /**
         * Export-data module required. Caption for the data table. Same as
         * chart title by default. Set to `false` to disable.
         *
         * @type {Boolean|String}
         * @since 6.0.4
         * @sample highcharts/export-data/multilevel-table
         *            Multiple table headers
         * @default undefined
         * @apioption exporting.tableCaption
         */

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
             *            Multiple table headers
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
             * @type  {String}
             * @since 6.0.4
             */
            decimalPoint: null,
            /**
             * The item delimiter in the exported data. Use `;` for direct
             * exporting to Excel. Defaults to a best guess based on the browser
             * locale. If the locale _decimal point_ is `,`, the `itemDelimiter`
             * defaults to `;`, otherwise the `itemDelimiter` defaults to `,`.
             *
             * @type {String}
             */
            itemDelimiter: null,
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
        showTable: false,

        /**
         * Export-data module required. Use multi level headers in data table.
         * If [csv.columnHeaderFormatter](#exporting.csv.columnHeaderFormatter)
         * is defined, it has to return objects in order for multi level headers
         * to work.
         *
         * @sample highcharts/export-data/multilevel-table
         *            Multiple table headers
         * @since 6.0.4
         */
        useMultiLevelHeaders: true,

        /**
         * Export-data module required. If using multi level table headers, use
         * rowspans for headers that have only one level.
         *
         * @sample highcharts/export-data/multilevel-table
         *            Multiple table headers
         * @since 6.0.4
         */
        useRowspanHeaders: true
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
         * @since 6.1.0
         */
        openInCloud: 'Open in Highcharts Cloud',
        /**
         * Export-data module only. The text for the menu item.
         * @since 6.0.0
         */
        viewData: 'View data table'
    }
});

// Add an event listener to handle the showTable option
Highcharts.addEvent(Highcharts.Chart, 'render', function () {
    if (
        this.options &&
        this.options.exporting &&
        this.options.exporting.showTable
    ) {
        this.viewData();
    }
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
 * @param  {Boolean} multiLevelHeaders
 *            Use multilevel headers for the rows by default. Adds an extra row
 *            with top level headers. If a custom columnHeaderFormatter is
 *            defined, this can override the behavior.
 *
 * @returns {Array.<Array>}
 *          The current chart data
 */
Highcharts.Chart.prototype.getDataRows = function (multiLevelHeaders) {
    var time = this.time,
        csvOptions = (this.options.exporting && this.options.exporting.csv) ||
            {},
        xAxis,
        xAxes = this.xAxis,
        rows = {},
        rowArr = [],
        dataRows,
        topLevelColumnTitles = [],
        columnTitles = [],
        columnTitleObj,
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

            if (!item) {
                return 'Category';
            }

            if (item instanceof Highcharts.Axis) {
                return (item.options.title && item.options.title.text) ||
                    (item.isDatetimeAxis ? 'DateTime' : 'Category');
            }

            if (multiLevelHeaders) {
                return {
                    columnTitle: keyLength > 1 ? key : item.name,
                    topLevelColumnTitle: item.name
                };
            }

            return item.name + (keyLength > 1 ? ' (' + key + ')' : '');
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
            mockSeries,
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
                columnTitleObj = columnHeaderFormatter(
                    series,
                    pointArrayMap[j],
                    pointArrayMap.length
                );
                columnTitles.push(
                    columnTitleObj.columnTitle || columnTitleObj
                );
                if (multiLevelHeaders) {
                    topLevelColumnTitles.push(
                        columnTitleObj.topLevelColumnTitle || columnTitleObj
                    );
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
            each(series.options.data, function eachData(options, pIdx) {
                var key,
                    prop,
                    val,
                    point;

                point = { series: mockSeries };
                series.pointClass.prototype.applyOptions.apply(
                    point,
                    [options]
                );
                key = point.x;

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
                    rows[key].name = (
                        series.data[pIdx] &&
                        series.data[pIdx].name
                    );
                }

                while (j < valueCount) {
                    prop = pointArrayMap[j]; // y, z etc
                    val = point[prop];
                    rows[key][i + j] = pick(
                        categoryMap[prop][val], // Y axis category if present
                        datetimeValueAxisMap[prop] ?
                            time.dateFormat(csvOptions.dateFormat, val) :
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

    // Add computed column headers and top level headers to final row set
    dataRows = multiLevelHeaders ? [topLevelColumnTitles, columnTitles] :
        [columnTitles];

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
        if (multiLevelHeaders && dataRows[1]) {
            // If using multi level headers, we just added top level header.
            // Also add for sub level
            dataRows[1].splice(column, 0, xTitle);
        }

        // Add the category column
        each(rowArr, function (row) { // eslint-disable-line no-loop-func
            var category = row.name;
            if (xAxis && !defined(category)) {
                if (xAxis.isDatetimeAxis) {
                    if (row.x instanceof Date) {
                        row.x = row.x.getTime();
                    }
                    category = time.dateFormat(
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
        decimalPoint = pick(
            csvOptions.decimalPoint,
            csvOptions.itemDelimiter !== ',' && useLocalDecimalPoint ?
                (1.1).toLocaleString()[1] :
                '.'
        ),
        // use ';' for direct to Excel
        itemDelimiter = pick(
            csvOptions.itemDelimiter,
            decimalPoint === ',' ? ';' : ','
        ),
        // '\n' isn't working with the js csv data extraction
        lineDelimiter = csvOptions.lineDelimiter;

    // Transform the rows to CSV
    each(rows, function (row, i) {
        var val = '',
            j = row.length;
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
 * @sample  highcharts/export-data/viewdata/
 *          View the data from the export menu
 * @returns {String}
 *          HTML representation of the data.
 */
Highcharts.Chart.prototype.getTable = function (useLocalDecimalPoint) {
    var html = '<table>',
        options = this.options,
        decimalPoint = useLocalDecimalPoint ? (1.1).toLocaleString()[1] : '.',
        useMultiLevelHeaders = pick(
            options.exporting.useMultiLevelHeaders, true
        ),
        rows = this.getDataRows(useMultiLevelHeaders),
        rowLength = 0,
        topHeaders = useMultiLevelHeaders ? rows.shift() : null,
        subHeaders = rows.shift(),
        // Compare two rows for equality
        isRowEqual = function (row1, row2) {
            var i = row1.length;
            if (row2.length === i) {
                while (i--) {
                    if (row1[i] !== row2[i]) {
                        return false;
                    }
                }
            } else {
                return false;
            }
            return true;
        },
        // Get table cell HTML from value
        getCellHTMLFromValue = function (tag, classes, attrs, value) {
            var val = pick(value, ''),
                className = 'text' + (classes ? ' ' + classes : '');
            // Convert to string if number
            if (typeof val === 'number') {
                val = val.toString();
                if (decimalPoint === ',') {
                    val = val.replace('.', decimalPoint);
                }
                className = 'number';
            } else if (!value) {
                className = 'empty';
            }
            return '<' + tag + (attrs ? ' ' + attrs : '') +
                    ' class="' + className + '">' +
                    val + '</' + tag + '>';
        },
        // Get table header markup from row data
        getTableHeaderHTML = function (topheaders, subheaders, rowLength) {
            var html = '<thead>',
                i = 0,
                len = rowLength || subheaders && subheaders.length,
                next,
                cur,
                curColspan = 0,
                rowspan;
            // Clean up multiple table headers. Chart.getDataRows() returns two
            // levels of headers when using multilevel, not merged. We need to
            // merge identical headers, remove redundant headers, and keep it
            // all marked up nicely.
            if (
                useMultiLevelHeaders &&
                topheaders &&
                subheaders &&
                !isRowEqual(topheaders, subheaders)
            ) {
                html += '<tr>';
                for (; i < len; ++i) {
                    cur = topheaders[i];
                    next = topheaders[i + 1];
                    if (cur === next) {
                        ++curColspan;
                    } else if (curColspan) {
                        // Ended colspan
                        // Add cur to HTML with colspan.
                        html += getCellHTMLFromValue(
                            'th',
                            'highcharts-table-topheading',
                            'scope="col" ' +
                            'colspan="' + (curColspan + 1) + '"',
                            cur
                        );
                        curColspan = 0;
                    } else {
                        // Cur is standalone. If it is same as sublevel,
                        // remove sublevel and add just toplevel.
                        if (cur === subheaders[i]) {
                            if (options.exporting.useRowspanHeaders) {
                                rowspan = 2;
                                delete subheaders[i];
                            } else {
                                rowspan = 1;
                                subheaders[i] = '';
                            }
                        } else {
                            rowspan = 1;
                        }
                        html += getCellHTMLFromValue(
                            'th',
                            'highcharts-table-topheading',
                            'scope="col"' +
                            (rowspan > 1 ?
                                ' valign="top" rowspan="' + rowspan + '"' :
                            ''),
                            cur
                        );
                    }
                }
                html += '</tr>';
            }

            // Add the subheaders (the only headers if not using multilevels)
            if (subheaders) {
                html += '<tr>';
                for (i = 0, len = subheaders.length; i < len; ++i) {
                    if (subheaders[i] !== undefined) {
                        html += getCellHTMLFromValue(
                            'th', null, 'scope="col"', subheaders[i]
                        );
                    }
                }
                html += '</tr>';
            }
            html += '</thead>';
            return html;
        };

    // Add table caption
    if (options.exporting.tableCaption !== false) {
        html += '<caption class="highcharts-table-caption">' + pick(
                options.exporting.tableCaption,
                (
                    options.title.text ?
                    htmlencode(options.title.text) :
                    'Chart'
                )) +
                '</caption>';
    }

    // Find longest row
    for (var i = 0, len = rows.length; i < len; ++i) {
        if (rows[i].length > rowLength) {
            rowLength = rows[i].length;
        }
    }

    // Add header
    html += getTableHeaderHTML(
        topHeaders,
        subHeaders,
        Math.max(rowLength, subHeaders.length)
    );

    // Transform the rows to HTML
    html += '<tbody>';
    each(rows, function (row) {
        html += '<tr>';
        for (var j = 0; j < rowLength; j++) {
            // Make first column a header too. Especially important for
            // category axes, but also might make sense for datetime? Should
            // await user feedback on this.
            html += getCellHTMLFromValue(
                j ? 'td' : 'th',
                null,
                j ? '' : 'scope="row"',
                row[j]
            );
        }
        html += '</tr>';
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
    } else if (this.title && this.title.textStr) {
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

/**
 * Experimental function to send a chart's config to the Cloud for editing.
 *
 * Limitations
 * - All functions (formatters and callbacks) are removed since they're not
 *   JSON.
 *
 * @todo
 * - Let the Cloud throw a friendly warning about unsupported structures like
 *   formatters.
 * - Dynamically updated charts probably fail, we need a generic
 *   Chart.getOptions function that returns all non-default options. Should also
 *   be used by the export module.
 */
Highcharts.Chart.prototype.openInCloud = function () {

    var options,
        paramObj,
        params;

    // Recursively remove function callbacks
    function removeFunctions(ob) {
        Object.keys(ob).forEach(function (key) {
            if (typeof ob[key] === 'function') {
                delete ob[key];
            }
            if (Highcharts.isObject(ob[key])) { // object and not an array
                removeFunctions(ob[key]);
            }
        });
    }

    function openInCloud() {
        var form = doc.createElement('form');
        doc.body.appendChild(form);
        form.method = 'post';
        form.action = 'https://cloud-api.highcharts.com/openincloud';
        form.target = '_blank';
        var input = doc.createElement('input');
        input.type = 'hidden';
        input.name = 'chart';
        input.value = params;
        form.appendChild(input);
        form.submit();
        doc.body.removeChild(form);
    }

    options = Highcharts.merge(this.userOptions);
    removeFunctions(options);

    paramObj = {
        name: (options.title && options.title.text) || 'Chart title',
        options: options,
        settings: {
            constructor: 'Chart',
            dataProvider: {
                csv: this.getCSV()
            }
        }
    };

    params = JSON.stringify(paramObj);
    openInCloud();
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
        },
        openInCloud: {
            textKey: 'openInCloud',
            onclick: function () {
                this.openInCloud();
            }
        }
    });

    exportingOptions.buttons.contextButton.menuItems.push(
        'separator',
        'downloadCSV',
        'downloadXLS',
        'viewData',
        'openInCloud'
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
