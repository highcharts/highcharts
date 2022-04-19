/* *
 *
 *  (c) 2020-2021 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sophie Bremer
 *  - Sebastian Bochan
 *  - Gøran Slettemark
 *
 * */
'use strict';
import DataTable from '../DataTable.js';
import U from '../../Core/Utilities.js';
var addEvent = U.addEvent, fireEvent = U.fireEvent, uniqueKey = U.uniqueKey;
/* *
 *
 *  Class
 *
 * */
/**
 * Abstract class providing an interface and basic methods for a DataParser
 *
 * @private
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
     * Converts an array of columns to a table instance. Second dimension of the
     * array are the row cells.
     *
     * @param {Array<DataTable.Column>} [columns]
     * Array to convert.
     *
     * @param {Array<string>} [headers]
     * Column names to use.
     *
     * @return {DataTable}
     * Table instance from the arrays.
     */
    DataParser.getTableFromColumns = function (columns, headers) {
        if (columns === void 0) { columns = []; }
        if (headers === void 0) { headers = []; }
        var table = new DataTable();
        for (var i = 0, iEnd = Math.max(headers.length, columns.length); i < iEnd; ++i) {
            table.setColumn(headers[i] || "" + i, columns[i]);
        }
        return table;
    };
    /**
     * Emits an event on the DataParser instance.
     *
     * @param {DataParser.Event} [e]
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
