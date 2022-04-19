/* *
 *
 *  (c) 2020-2021 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Wojciech Chmiel
 *  - Sophie Bremer
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
import U from '../../Core/Utilities.js';
var merge = U.merge;
/* *
 *
 *  Class
 *
 * */
/**
 * Inverts columns and rows in a table.
 *
 * @private
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
     *  Functions
     *
     * */
    /**
     * Applies partial modifications of a cell change to the property `modified`
     * of the given modified table.
     *
     * @param {Highcharts.DataTable} table
     * Modified table.
     *
     * @param {string} columnName
     * Column name of changed cell.
     *
     * @param {number|undefined} rowIndex
     * Row index of changed cell.
     *
     * @param {Highcharts.DataTableCellType} cellValue
     * Changed cell value.
     *
     * @param {Highcharts.DataTableEventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {Highcharts.DataTable}
     * Table with `modified` property as a reference.
     */
    InvertModifier.prototype.modifyCell = function (table, columnName, rowIndex, cellValue, eventDetail) {
        var modified = table.modified, modifiedRowIndex = modified.getRowIndexBy('columnNames', columnName);
        if (typeof modifiedRowIndex === 'undefined') {
            modified.setColumns(this.modifyTable(table.clone()).getColumns(), void 0, eventDetail);
        }
        else {
            modified.setCell("" + rowIndex, modifiedRowIndex, cellValue, eventDetail);
        }
        return table;
    };
    /**
     * Applies partial modifications of column changes to the property
     * `modified` of the given table.
     *
     * @param {Highcharts.DataTable} table
     * Modified table.
     *
     * @param {Highcharts.DataTableColumnCollection} columns
     * Changed columns as a collection, where the keys are the column names.
     *
     * @param {number} [rowIndex=0]
     * Index of the first changed row.
     *
     * @param {Highcharts.DataTableEventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {Highcharts.DataTable}
     * Table with `modified` property as a reference.
     */
    InvertModifier.prototype.modifyColumns = function (table, columns, rowIndex, eventDetail) {
        var modified = table.modified, modifiedColumnNames = (modified.getColumn('columnNames') || []);
        var columnNames = table.getColumnNames(), reset = (table.getRowCount() !== modifiedColumnNames.length);
        if (!reset) {
            for (var i = 0, iEnd = columnNames.length; i < iEnd; ++i) {
                if (columnNames[i] !== modifiedColumnNames[i]) {
                    reset = true;
                    break;
                }
            }
        }
        if (reset) {
            return this.modifyTable(table, eventDetail);
        }
        columnNames = Object.keys(columns);
        for (var i = 0, iEnd = columnNames.length, column = void 0, columnName = void 0, modifiedRowIndex = void 0; i < iEnd; ++i) {
            columnName = columnNames[i];
            column = columns[columnName];
            modifiedRowIndex = (modified.getRowIndexBy('columnNames', columnName) ||
                modified.getRowCount());
            for (var j = 0, j2 = rowIndex, jEnd = column.length; j < jEnd; ++j, ++j2) {
                modified.setCell("" + j2, modifiedRowIndex, column[j], eventDetail);
            }
        }
        return table;
    };
    /**
     * Applies partial modifications of row changes to the property `modified`
     * of the given table.
     *
     * @param {Highcharts.DataTable} table
     * Modified table.
     *
     * @param {Array<(Highcharts.DataTableRow|Highcharts.DataTableRowObject)>} rows
     * Changed rows.
     *
     * @param {number} [rowIndex]
     * Index of the first changed row.
     *
     * @param {Highcharts.DataTableEventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {Highcharts.DataTable}
     * Table with `modified` property as a reference.
     */
    InvertModifier.prototype.modifyRows = function (table, rows, rowIndex, eventDetail) {
        var columnNames = table.getColumnNames(), modified = table.modified, modifiedColumnNames = (modified.getColumn('columnNames') || []);
        var reset = (table.getRowCount() !== modifiedColumnNames.length);
        if (!reset) {
            for (var i = 0, iEnd = columnNames.length; i < iEnd; ++i) {
                if (columnNames[i] !== modifiedColumnNames[i]) {
                    reset = true;
                    break;
                }
            }
        }
        if (reset) {
            return this.modifyTable(table, eventDetail);
        }
        for (var i = 0, i2 = rowIndex, iEnd = rows.length, row = void 0; i < iEnd; ++i, ++i2) {
            row = rows[i];
            if (row instanceof Array) {
                modified.setColumn("" + i2, row);
            }
            else {
                for (var j = 0, jEnd = columnNames.length; j < jEnd; ++j) {
                    modified.setCell("" + i2, j, row[columnNames[j]], eventDetail);
                }
            }
        }
        return table;
    };
    /**
     * Inverts rows and columns in the table.
     *
     * @param {DataTable} table
     * Table to invert.
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {DataTable}
     * Table with inverted `modified` property as a reference.
     */
    InvertModifier.prototype.modifyTable = function (table, eventDetail) {
        var modifier = this;
        modifier.emit({ type: 'modify', detail: eventDetail, table: table });
        var modified = table.modified;
        if (table.hasColumns(['columnNames'])) { // inverted table
            var columnNames = ((table.deleteColumns(['columnNames']) || {})
                .columnNames || []).map(function (column) { return "" + column; }), columns = {};
            for (var i = 0, iEnd = table.getRowCount(), row = void 0; i < iEnd; ++i) {
                row = table.getRow(i);
                if (row) {
                    columns[columnNames[i]] = row;
                }
            }
            modified.deleteColumns();
            modified.setColumns(columns);
        }
        else { // regular table
            var columns = {};
            for (var i = 0, iEnd = table.getRowCount(), row = void 0; i < iEnd; ++i) {
                row = table.getRow(i);
                if (row) {
                    columns["" + i] = row;
                }
            }
            columns.columnNames = table.getColumnNames();
            modified.deleteColumns();
            modified.setColumns(columns);
        }
        modifier.emit({ type: 'afterModify', detail: eventDetail, table: table });
        return table;
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
DataModifier.addModifier(InvertModifier);
/* *
 *
 *  Export
 *
 * */
export default InvertModifier;
