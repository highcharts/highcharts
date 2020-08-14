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
/* *
 *
 *  Imports
 *
 * */
import DataJSON from '../DataJSON.js';
import DataModifier from './DataModifier.js';
import DataTable from '../DataTable.js';
import DataTableRow from '../DataTableRow.js';
import U from '../../Core/Utilities.js';
var merge = U.merge;
/* *
 *
 *  Class
 *
 * */
/**
 * Groups table rows into subtables depending on column values.
 */
var GroupDataModifier = /** @class */ (function (_super) {
    __extends(GroupDataModifier, _super);
    /* *
     *
     *  Constructors
     *
     * */
    /**
     * Constructs an instance of the group modifier.
     *
     * @param {GroupDataModifier.Options} [options]
     * Options to configure the group modifier.
     */
    function GroupDataModifier(options) {
        var _this = _super.call(this) || this;
        _this.options = merge(GroupDataModifier.defaultOptions, options);
        return _this;
    }
    /* *
     *
     *  Static Functions
     *
     * */
    /**
     * Converts a class JSON to a group modifier.
     *
     * @param {ChainDataModifier.ClassJSON} json
     * Class JSON to convert to an instance of group modifier.
     *
     * @return {ChainDataModifier}
     * Group modifier of the class JSON.
     */
    GroupDataModifier.fromJSON = function (json) {
        return new GroupDataModifier(json.options);
    };
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
     * @return {DataTable}
     * New modified table.
     */
    GroupDataModifier.prototype.execute = function (table) {
        this.emit({ type: 'execute', table: table });
        var modifier = this, _a = modifier.options, groupColumn = _a.groupColumn, invalidValues = _a.invalidValues, validValues = _a.validValues, columnGroups = [], tableGroups = [], valueGroups = [];
        var row, value, valueIndex;
        for (var i = 0, iEnd = table.getRowCount(); i < iEnd; ++i) {
            row = table.getRow(i);
            if (row) {
                value = row.getColumn(groupColumn);
                if (value instanceof DataTable ||
                    value instanceof Date ||
                    (invalidValues &&
                        invalidValues.indexOf(value) >= 0) || (validValues &&
                    validValues.indexOf(value) === -1)) {
                    continue;
                }
                valueIndex = valueGroups.indexOf(value);
                if (valueIndex === -1) {
                    columnGroups.push(groupColumn.toString());
                    tableGroups.push(new DataTable([row]));
                    valueGroups.push(value);
                }
                else {
                    tableGroups[valueIndex].insertRow(row);
                }
            }
        }
        table = new DataTable();
        for (var i = 0, iEnd = tableGroups.length; i < iEnd; ++i) {
            table.insertRow(new DataTableRow({
                id: "" + i,
                groupBy: columnGroups[i],
                table: tableGroups[i],
                value: valueGroups[i]
            }));
        }
        this.emit({ type: 'afterExecute', table: table });
        return table;
    };
    /**
     * Converts the group modifier to a class JSON, including all containing all
     * modifiers.
     *
     * @return {DataJSON.ClassJSON}
     * Class JSON of this group modifier.
     */
    GroupDataModifier.prototype.toJSON = function () {
        var json = {
            $class: 'GroupDataModifier',
            options: merge(this.options)
        };
        return json;
    };
    /* *
     *
     *  Static Properties
     *
     * */
    /**
     * Default options to group table rows.
     */
    GroupDataModifier.defaultOptions = {
        modifier: 'Group',
        groupColumn: 0
    };
    return GroupDataModifier;
}(DataModifier));
/* *
 *
 *  Register
 *
 * */
DataJSON.addClass(GroupDataModifier);
DataModifier.addModifier(GroupDataModifier);
/* *
 *
 *  Export
 *
 * */
export default GroupDataModifier;
