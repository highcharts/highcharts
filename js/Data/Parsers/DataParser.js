/* *
 *
 *  Data module
 *
 *  (c) 2012-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
import DataTable from '../DataTable.js';
import DataTableRow from '../DataTableRow.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import U from '../../Core/Utilities.js';
var addEvent = U.addEvent, fireEvent = U.fireEvent, flat = U.flat, unflat = U.unflat, uniqueKey = U.uniqueKey;
/* *
 *
 *  Class
 *
 * */
/**
 * Abstract class providing an interface and basic methods for a DataParser
 */
var DataParser = /** @class */ (function () {
    function DataParser() {
    }
    /* *
     *
     *  Static Functions
     *
     * */
    /**
     * Converts the DataTable instance to a record of columns.
     *
     * @param {DataTable} table
     * Table to convert.
     *
     * @param {boolean} [usePresentationOrder]
     * Whether to use the column order of the presentation state.
     *
     * @return {Array<Array<DataTableRow.CellType>>}
     * A record of columns, where the key is the name of the column,
     * and the values are the content of the column.
     */
    DataParser.getColumnsFromTable = function (table, usePresentationOrder) {
        var columnsObject = {
            id: []
        }, rows = table.getAllRows();
        for (var rowIndex = 0, rowCount = rows.length; rowIndex < rowCount; rowIndex++) {
            var row = rows[rowIndex], cellNames = row.getCellNames(), cellCount = cellNames.length;
            columnsObject.id.push(row.id); // Push the ID column
            for (var j = 0; j < cellCount; j++) {
                var cellName = cellNames[j], cell = row.getCell(cellName);
                if (!columnsObject[cellName]) {
                    columnsObject[cellName] = [];
                    // If row number is greater than 0
                    // add the previous rows as undefined
                    if (rowIndex > 0) {
                        for (var rowNumber = 0; rowNumber < rowIndex; rowNumber++) {
                            columnsObject[cellName][rowNumber] = void 0;
                        }
                    }
                }
                columnsObject[cellName][rowIndex] = cell;
            }
            // If the object has columns that were not in the row
            // add them as undefined
            var columnsInObject = Object.keys(columnsObject);
            for (var columnIndex = 0; columnIndex < columnsInObject.length; columnIndex++) {
                var columnName = columnsInObject[columnIndex];
                while (columnsObject[columnName].length - 1 < rowIndex) {
                    columnsObject[columnName].push(void 0);
                }
            }
        }
        var columnNames = Object.keys(columnsObject);
        if (usePresentationOrder) {
            columnNames.sort(table.presentationState.getColumnSorter());
        }
        return columnNames.map(function (columnName) { return columnsObject[columnName]; });
    };
    /**
     * Converts the DataTableRow instance to common series options.
     *
     * @param {DataTableRow} tableRow
     * Table row to convert.
     *
     * @param {Array<string>} [keys]
     * Data keys to extract from the table row.
     *
     * @return {Highcharts.PointOptions}
     * Common point options.
     */
    DataParser.getPointOptionsFromTableRow = function (tableRow, keys) {
        var pointOptions = {
            id: tableRow.id
        }, cellNames = tableRow.getCellNames();
        var cellName;
        for (var j = 0, jEnd = cellNames.length; j < jEnd; ++j) {
            cellName = cellNames[j];
            if (keys && keys.indexOf(cellName) === -1) {
                continue;
            }
            pointOptions[cellName] = tableRow.getCell(cellName);
        }
        return unflat(pointOptions);
    };
    /**
     * Converts the DataTable instance to common series options.
     *
     * @param {DataTable} table
     * Table to convert.
     *
     * @param {Array<string>} [keys]
     * Data keys to extract from table rows.
     *
     * @return {Highcharts.SeriesOptions}
     * Common series options.
     */
    DataParser.getSeriesOptionsFromTable = function (table, keys) {
        var rows = table.getAllRows(), data = [], seriesOptions = {
            id: table.id,
            data: data,
            keys: keys
        };
        for (var i = 0, iEnd = rows.length; i < iEnd; ++i) {
            data.push(DataParser.getPointOptionsFromTableRow(rows[i], keys));
        }
        return seriesOptions;
    };
    /**
     * Converts a simple two dimensional array to a DataTable instance. The
     * array needs to be structured like a DataFrame, so that the first
     * dimension becomes the columns and the second dimension the rows.
     *
     * @param {Array<Array<DataTableRow.CellType>>} [columns]
     * Array to convert.
     *
     * @param {Array<string>} [headers]
     * Column names to use.
     *
     * @param {DataConverter} [converter]
     * Converter for value conversions in table rows.
     *
     * @return {DataTable}
     * DataTable instance from the arrays.
     */
    DataParser.getTableFromColumns = function (columns, headers) {
        if (columns === void 0) { columns = []; }
        if (headers === void 0) { headers = []; }
        var columnsLength = columns.length, table = new DataTable();
        // Assign an unique id for every column
        // without a provided name
        while (headers.length < columnsLength) {
            headers.push(uniqueKey());
        }
        table.presentationState.setColumnOrder(headers);
        if (columnsLength) {
            for (var i = 0, iEnd = columns[0].length; i < iEnd; ++i) {
                var row = new DataTableRow();
                for (var j = 0; j < columnsLength; ++j) {
                    row.insertCell(headers[j], columns[j][i]);
                }
                table.insertRow(row);
            }
        }
        return table;
    };
    /**
     * Converts series options to a DataTable instance.
     *
     * @param {Highcharts.SeriesOptions} seriesOptions
     * Series options to convert.
     *
     * @return {DataTable}
     * DataTable instance.
     */
    DataParser.getTableFromSeriesOptions = function (seriesOptions) {
        var table = new DataTable(void 0, seriesOptions.id), data = (seriesOptions.data || []);
        var keys = (seriesOptions.keys || []).slice();
        if (!keys.length) {
            if (seriesOptions.type) {
                var seriesClass = SeriesRegistry.seriesTypes[seriesOptions.type], pointArrayMap = (seriesClass &&
                    seriesClass.prototype.pointArrayMap);
                if (pointArrayMap) {
                    keys = pointArrayMap.slice();
                    keys.unshift('x');
                }
            }
            if (!keys.length) {
                keys = ['x', 'y'];
            }
        }
        for (var i = 0, iEnd = data.length; i < iEnd; ++i) {
            table.insertRow(DataParser.getTableRowFromPointOptions(data[i], i, keys));
        }
        return table;
    };
    /**
     * Converts series options to a DataTable instance.
     *
     * @param {Highcharts.PointOptions} pointOptions
     * Point options to convert.
     *
     * @param {number} [index]
     * Point index for x value.
     *
     * @param {Array<string>} [keys]
     * Data keys to convert options.
     *
     * @return {DataTable}
     * DataTable instance.
     */
    DataParser.getTableRowFromPointOptions = function (pointOptions, index, keys) {
        var _a;
        if (index === void 0) { index = 0; }
        if (keys === void 0) { keys = ['x', 'y']; }
        var tableRow;
        // Array
        if (pointOptions instanceof Array) {
            var tableRowOptions = {};
            for (var i = 0, iEnd = pointOptions.length; i < iEnd; ++i) {
                tableRowOptions[keys[i] || "" + i] = pointOptions[i];
            }
            tableRow = new DataTableRow(tableRowOptions);
            // Object
        }
        else if (pointOptions &&
            typeof pointOptions === 'object') {
            tableRow = new DataTableRow(flat(pointOptions));
            // Primitive
        }
        else {
            tableRow = new DataTableRow((_a = {},
                _a[keys[0] || 'x'] = index,
                _a[keys[1] || 'y'] = pointOptions,
                _a));
        }
        return tableRow;
    };
    /**
     * Emits an event on the DataParser instance.
     *
     * @param {DataParser.EventObject} [e]
     * Event object containing additional event data
     */
    DataParser.prototype.emit = function (e) {
        fireEvent(this, e.type, e);
    };
    /**
     * Registers a callback for a specific parser event.
     *
     * @param {string} type
     * Event type as a string.
     *
     * @param {DataEventEmitter.EventCallback} callback
     * Function to register for an modifier callback.
     *
     * @return {Function}
     * Function to unregister callback from the modifier event.
     */
    DataParser.prototype.on = function (type, callback) {
        return addEvent(this, type, callback);
    };
    /* *
     *
     *  Static Properties
     *
     * */
    /**
     * Default options
     */
    DataParser.defaultOptions = {
        startColumn: 0,
        endColumn: Number.MAX_VALUE,
        startRow: 0,
        endRow: Number.MAX_VALUE,
        firstRowAsNames: true,
        switchRowsAndColumns: false
    };
    return DataParser;
}());
export default DataParser;
