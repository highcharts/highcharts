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
 * Modifies a table with the help of modifiers in an ordered chain.
 *
 * @private
 */
var ChainModifier = /** @class */ (function (_super) {
    __extends(ChainModifier, _super);
    /* *
     *
     *  Constructors
     *
     * */
    /**
     * Constructs an instance of the modifier chain.
     *
     * @param {DeepPartial<ChainModifier.Options>} [options]
     * Options to configure the modifier chain.
     *
     * @param {...DataModifier} [modifiers]
     * Modifiers in order for the modifier chain.
     */
    function ChainModifier(options) {
        var modifiers = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            modifiers[_i - 1] = arguments[_i];
        }
        var _this = _super.call(this) || this;
        _this.modifiers = modifiers;
        _this.options = merge(ChainModifier.defaultOptions, options);
        return _this;
    }
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Adds a configured modifier to the end of the modifier chain. Please note,
     * that the modifier can be added multiple times.
     *
     * @param {DataModifier} modifier
     * Configured modifier to add.
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     */
    ChainModifier.prototype.add = function (modifier, eventDetail) {
        this.emit({
            type: 'addModifier',
            detail: eventDetail,
            modifier: modifier
        });
        this.modifiers.push(modifier);
        this.emit({
            type: 'addModifier',
            detail: eventDetail,
            modifier: modifier
        });
    };
    /**
     * Clears all modifiers from the chain.
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     */
    ChainModifier.prototype.clear = function (eventDetail) {
        this.emit({
            type: 'clearChain',
            detail: eventDetail
        });
        this.modifiers.length = 0;
        this.emit({
            type: 'afterClearChain',
            detail: eventDetail
        });
    };
    /**
     * Applies partial modifications of a cell change to the property `modified`
     * of the given modified table.
     *
     * *Note:* The `modified` property of the table gets replaced.
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
    ChainModifier.prototype.modifyCell = function (table, columnName, rowIndex, cellValue, eventDetail) {
        var modifiers = (this.options.reverse ?
            this.modifiers.reverse() :
            this.modifiers);
        if (modifiers.length) {
            var clone = table.clone();
            for (var i = 0, iEnd = modifiers.length; i < iEnd; ++i) {
                modifiers[i].modifyCell(clone, columnName, rowIndex, cellValue, eventDetail);
                clone = clone.modified;
            }
            table.modified = clone;
        }
        return table;
    };
    /**
     * Applies partial modifications of column changes to the property
     * `modified` of the given table.
     *
     * *Note:* The `modified` property of the table gets replaced.
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
    ChainModifier.prototype.modifyColumns = function (table, columns, rowIndex, eventDetail) {
        var modifiers = (this.options.reverse ?
            this.modifiers.reverse() :
            this.modifiers.slice());
        if (modifiers.length) {
            var clone = table.clone();
            for (var i = 0, iEnd = modifiers.length; i < iEnd; ++i) {
                modifiers[i].modifyColumns(clone, columns, rowIndex, eventDetail);
                clone = clone.modified;
            }
            table.modified = clone;
        }
        return table;
    };
    /**
     * Applies partial modifications of row changes to the property `modified`
     * of the given table.
     *
     * *Note:* The `modified` property of the table gets replaced.
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
    ChainModifier.prototype.modifyRows = function (table, rows, rowIndex, eventDetail) {
        var modifiers = (this.options.reverse ?
            this.modifiers.reverse() :
            this.modifiers.slice());
        if (modifiers.length) {
            var clone = table.clone();
            for (var i = 0, iEnd = modifiers.length; i < iEnd; ++i) {
                modifiers[i].modifyRows(clone, rows, rowIndex, eventDetail);
                clone = clone.modified;
            }
            table.modified = clone;
        }
        return table;
    };
    /**
     * Applies several modifications to the table.
     *
     * *Note:* The `modified` property of the table gets replaced.
     *
     * @param {DataTable} table
     * Table to modify.
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {DataTable}
     * Table as a reference.
     *
     * @emits ChainDataModifier#execute
     * @emits ChainDataModifier#afterExecute
     */
    ChainModifier.prototype.modifyTable = function (table, eventDetail) {
        var chain = this;
        chain.emit({ type: 'modify', detail: eventDetail, table: table });
        var modifiers = (chain.options.reverse ?
            chain.modifiers.reverse() :
            chain.modifiers.slice());
        var modified = table.modified;
        for (var i = 0, iEnd = modifiers.length, modifier = void 0; i < iEnd; ++i) {
            modifier = modifiers[i];
            modified = modifier.modifyTable(modified).modified;
        }
        table.modified = modified;
        chain.emit({ type: 'afterModify', detail: eventDetail, table: table });
        return table;
    };
    /**
     * Removes a configured modifier from all positions of the modifier chain.
     *
     * @param {DataModifier} modifier
     * Configured modifier to remove.
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     */
    ChainModifier.prototype.remove = function (modifier, eventDetail) {
        var modifiers = this.modifiers;
        this.emit({
            type: 'removeModifier',
            detail: eventDetail,
            modifier: modifier
        });
        modifiers.splice(modifiers.indexOf(modifier), 1);
        this.emit({
            type: 'afterRemoveModifier',
            detail: eventDetail,
            modifier: modifier
        });
    };
    /* *
     *
     *  Static Properties
     *
     * */
    /**
     * Default option for the ordered modifier chain.
     */
    ChainModifier.defaultOptions = {
        modifier: 'Chain',
        reverse: false
    };
    return ChainModifier;
}(DataModifier));
/* *
 *
 *  Register
 *
 * */
DataModifier.addModifier(ChainModifier);
/* *
 *
 *  Export
 *
 * */
export default ChainModifier;
