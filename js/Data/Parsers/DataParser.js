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
import U from '../../Core/Utilities.js';
var addEvent = U.addEvent, fireEvent = U.fireEvent, uniqueKey = U.uniqueKey;
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
