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
import DataTable from '../DataTable.js';
import U from '../../Core/Utilities.js';
var merge = U.merge;
/* *
 *
 *  Class
 *
 * */
/**
 * Groups table rows into subtables depending on column values.
 *
 * @private
 */
var GroupModifier = /** @class */ (function (_super) {
    __extends(GroupModifier, _super);
    /* *
     *
     *  Constructors
     *
     * */
    /**
     * Constructs an instance of the group modifier.
     *
     * @param {GroupModifier.Options} [options]
     * Options to configure the group modifier.
     */
    function GroupModifier(options) {
        var _this = _super.call(this) || this;
        _this.options = merge(GroupModifier.defaultOptions, options);
        return _this;
    }
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Applies modifications to the table rows and returns a new table with
     * subtable, containing the grouped rows. The rows of the new table contain
     * three columns:
     * - `groupBy`: Column name used to group rows by.
     * - `table`: Subtable containing the grouped rows.
     * - `value`: containing the common value of the group
     *
     * @param {DataTable} table
     * Table to modify.
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {DataTable}
     * Table with `modified` property as a reference.
     */
    GroupModifier.prototype.modifyTable = function (table, eventDetail) {
        var modifier = this;
        modifier.emit({ type: 'modify', detail: eventDetail, table: table });
        var byGroups = [], tableGroups = [], valueGroups = [], groupColumn = (modifier.options.groupColumn ||
            table.getColumnNames()[0]), valueColumn = (table.getColumn(groupColumn) ||
            []), _a = modifier.options, invalidValues = _a.invalidValues, validValues = _a.validValues, modified = table.modified = table.clone(true, eventDetail);
        var value, valueIndex;
        for (var i = 0, iEnd = valueColumn.length; i < iEnd; ++i) {
            value = valueColumn[i];
            if (typeof value !== 'undefined') {
                if (value instanceof DataTable ||
                    (invalidValues &&
                        invalidValues.indexOf(value) >= 0) || (validValues &&
                    validValues.indexOf(value) === -1)) {
                    continue;
                }
                valueIndex = valueGroups.indexOf(value);
                if (valueIndex === -1) {
                    var newTable = new DataTable();
                    newTable.setRows([table.getRowObject(i) || {}]);
                    byGroups.push(groupColumn);
                    tableGroups.push(newTable);
                    valueGroups.push(value);
                }
                else {
                    tableGroups[valueIndex].setRows([table.getRow(i) || []]);
                }
            }
        }
        modified.deleteColumns();
        modified.setColumns({
            groupBy: byGroups,
            table: tableGroups,
            value: valueGroups
        });
        modifier.emit({ type: 'afterModify', detail: eventDetail, table: table });
        return table;
    };
    /* *
     *
     *  Static Properties
     *
     * */
    /**
     * Default options to group table rows.
     */
    GroupModifier.defaultOptions = {
        modifier: 'Group',
        groupColumn: ''
    };
    return GroupModifier;
}(DataModifier));
/* *
 *
 *  Register
 *
 * */
DataModifier.addModifier(GroupModifier);
/* *
 *
 *  Export
 *
 * */
export default GroupModifier;
