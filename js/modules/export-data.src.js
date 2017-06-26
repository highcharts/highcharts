/**
 * Expoerimental data export module for Highcharts
 *
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */

// docs
// - After experimental release:
// - Move info in repo readme to docs/API.
// - Deprecate repo and plugins page
// - Update demos (esp accessibility) to use new URL
// - Before official release, set up systematic tests for all series types

/* eslint indent:0 */
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
    lang: {
        downloadCSV: 'Download CSV',
        downloadXLS: 'Download XLS',
        viewData: 'View data table'
    }
});

/**
 * Get the data rows as a two dimensional array
 */
Highcharts.Chart.prototype.getDataRows = function () {
    var options = (this.options.exporting || {}).csv || {},
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
        dateFormat = options.dateFormat || '%Y-%m-%d %H:%M:%S',
        columnHeaderFormatter = options.columnHeaderFormatter || function (item, key, keyLength) {
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
    each(this.series, function (series) {
        var keys = series.options.keys,
            pointArrayMap = keys || series.pointArrayMap || ['y'],
            valueCount = pointArrayMap.length,
            requireSorting = series.requireSorting,
            categoryMap = {},
            xAxisIndex = Highcharts.inArray(series.xAxis, xAxes),
            j;

        // Map the categories for value axes
        each(pointArrayMap, function (prop) {
            categoryMap[prop] = (series[prop + 'Axis'] && series[prop + 'Axis'].categories) || [];
        });

        if (series.options.includeInCSVExport !== false && series.visible !== false) { // #55

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
                names.push(columnHeaderFormatter(series, pointArrayMap[j], pointArrayMap.length));
                j++;
            }

            each(series.points, function (point, pIdx) {
                var key = requireSorting ? point.x : point.x + '|' + pIdx,
                    prop,
                    val;

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
					// Pick a Y axis category if present
                    rows[key][i + j] = pick(categoryMap[prop][val], val);
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
        //dataRows = [[xTitle].concat(names)];
        dataRows[0].splice(column, 0, xTitle);

        // Add the category column
        each(rowArr, function (row) { // eslint-disable-line no-loop-func
            var category = row.name;
            if (!category) {
                if (xAxis.isDatetimeAxis) {
                    if (row.x instanceof Date) {
                        row.x = row.x.getTime();
                    }
                    category = Highcharts.dateFormat(dateFormat, row.x);
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
 * Get a CSV string
 */
Highcharts.Chart.prototype.getCSV = function (useLocalDecimalPoint) {
    var csv = '',
        rows = this.getDataRows(),
        options = (this.options.exporting || {}).csv || {},
        itemDelimiter = options.itemDelimiter || ',', // use ';' for direct to Excel
        lineDelimiter = options.lineDelimiter || '\n'; // '\n' isn't working with the js csv data extraction

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
 * Build a HTML table with the data
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
                html += '<' + tag + ' class="text">' + (val === undefined ? '' : val) + '</' + tag + '>';
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
 * Use download attribute if supported, else  run a simple PHP script that
 * returns a file. The source code for the PHP script can be viewed at
 * https://raw.github.com/highcharts/highcharts/master/studies/csv-export/csv.php
 */
Highcharts.Chart.prototype.fileDownload = function (href, extension, content, MIME) {
    var a,
        blobObject,
        name,
        options = (this.options.exporting || {}).csv || {},
        url = options.url || 'http://www.highcharts.com/studies/csv-export/download.php';

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
        blobObject = new win.Blob([content]);
        win.navigator.msSaveOrOpenBlob(blobObject, name + '.' + extension);

    // Download attribute supported
    } else if (downloadAttrSupported) {
        a = doc.createElement('a');
        a.href = href;
        a.download = name + '.' + extension;
        this.container.append(a); // #111
        a.click();
        a.remove();

    } else {
        // Fall back to server side handling
        Highcharts.post(url, {
            data: content,
            type: MIME,
            extension: extension
        });
    }
};

/**
 * Call this on click of 'Download CSV' button
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
 */
Highcharts.Chart.prototype.downloadXLS = function () {
    var uri = 'data:application/vnd.ms-excel;base64,',
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">' +
            '<head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>' +
            '<x:Name>Ark1</x:Name>' +
            '<x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->' +
            '<style>td{border:none;font-family: Calibri, sans-serif;} .number{mso-number-format:"0.00";} .text{ mso-number-format:"\@";}</style>' +
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
 * View the data in a table below the chart
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

