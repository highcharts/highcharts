/* *
 *
 *  Data Layer
 *
 *  (c) 2012-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import DataModifier from './DataModifier.js';
import DataJSON from '../DataJSON.js';
import DataTable from '../DataTable.js';
import DataTableRow from '../DataTableRow.js';
import U from '../../Core/Utilities.js';
var merge = U.merge, defined = U.defined;
/* *
 *
 *  Class
 *
 * */
/**
 * Inverts columns and rows in a table.
 */
var InvertModifier = /** @class */ (function (_super) {
    __extends(InvertModifier, _super);
    /* *
     *
     *  Constructor
     *
     * */
    /**
     * Constructs an instance of the invert modifier.
     *
     * @param {InvertModifier.Options} [options]
     * Options to configure the invert modifier.
     */
    function InvertModifier(options) {
        var _this = _super.call(this) || this;
        _this.options = merge(InvertModifier.defaultOptions, options);
        return _this;
    }
    /* *
     *
     *  Static Functions
     *
     * */
    /**
     * Converts a class JSON to a invert modifier.
     *
     * @param {InvertModifier.ClassJSON} json
     * Class JSON to convert to an instance of invert modifier.
     *
     * @return {InvertModifier}
     * Series points modifier of the class JSON.
     */
    InvertModifier.fromJSON = function (json) {
        return new InvertModifier(json.options);
    };
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Create new DataTable with inverted rows and columns.
     *
     * @param {DataTable} table
     * Table to modify.
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {DataTable}
     * New modified table.
     */
    InvertModifier.prototype.execute = function (table, eventDetail) {
        var modifier = this, newTable = new DataTable(), columns = table.toColumns(), newRowIds = Object.keys(columns), oldRowsLength = table.getRowCount();
        var oldRow, newCells, newRow, rowCell;
        modifier.emit({ type: 'execute', detail: eventDetail, table: table });
        for (var i = 0, iEnd = newRowIds.length; i < iEnd; i++) {
            if (newRowIds[i] !== 'id') {
                newCells = {
                    id: newRowIds[i]
                };
                for (var j = 0; j < oldRowsLength; j++) {
                    oldRow = table.getRow(j);
                    rowCell = oldRow && oldRow.getCell(newRowIds[i]);
                    if (defined(rowCell) && (oldRow === null || oldRow === void 0 ? void 0 : oldRow.id)) {
                        newCells[oldRow.id] = rowCell;
                    }
                }
                newRow = new DataTableRow(newCells);
                newTable.insertRow(newRow);
            }
        }
        modifier.emit({ type: 'afterExecute', detail: eventDetail, table: newTable });
        return newTable;
    };
    /**
     * Converts the invert modifier to a class JSON,
     * including all containing all modifiers.
     *
     * @return {DataJSON.ClassJSON}
     * Class JSON of this invert modifier.
     */
    InvertModifier.prototype.toJSON = function () {
        return {
            $class: 'InvertModifier',
            options: merge(this.options)
        };
    };
    /* *
     *
     *  Static Properties
     *
     * */
    /**
     * Default options for the invert modifier.
     */
    InvertModifier.defaultOptions = {
        modifier: 'InvertModifier'
    };
    return InvertModifier;
}(DataModifier));
/* *
 *
 *  Register
 *
 * */
DataJSON.addClass(InvertModifier);
DataModifier.addModifier(InvertModifier);
/* *
 *
 *  Export
 *
 * */
export default InvertModifier;
