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
import DataJSON from '../DataJSON.js';
import DataModifier from './DataModifier.js';
import DataTable from '../DataTable.js';
import DataTableRow from '../DataTableRow.js';
import U from '../../Core/Utilities.js';
var merge = U.merge;
var GroupDataModifier = /** @class */ (function (_super) {
    __extends(GroupDataModifier, _super);
    /* *
     *
     *  Constructors
     *
     * */
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
    GroupDataModifier.fromJSON = function (json) {
        return new GroupDataModifier(json.options);
    };
    /* *
     *
     *  Functions
     *
     * */
    GroupDataModifier.prototype.execute = function (table) {
        this.emit({ type: 'execute', table: table });
        var modifier = this, _a = modifier.options, groupColumn = _a.groupColumn, invalidValues = _a.invalidValues, validValues = _a.validValues, groupTables = [], groupValues = [];
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
                valueIndex = groupValues.indexOf(value);
                if (valueIndex === -1) {
                    groupTables.push(new DataTable([row]));
                    groupValues.push(value);
                }
                else {
                    groupTables[valueIndex].insertRow(row);
                }
            }
        }
        table = new DataTable();
        for (var i = 0, iEnd = groupTables.length; i < iEnd; ++i) {
            table.insertRow(new DataTableRow({
                id: "" + i,
                value: groupValues[i],
                table: groupTables[i]
            }));
        }
        this.emit({ type: 'afterExecute', table: table });
        return table;
    };
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
    GroupDataModifier.defaultOptions = {
        modifier: 'Group',
        groupColumn: 0
    };
    return GroupDataModifier;
}(DataModifier));
DataJSON.addClass(GroupDataModifier);
DataModifier.addModifier(GroupDataModifier);
export default GroupDataModifier;
