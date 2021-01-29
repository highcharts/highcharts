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
 * Sort table rows according to values of a column.
 */
var SortModifier = /** @class */ (function (_super) {
    __extends(SortModifier, _super);
    /* *
     *
     *  Constructor
     *
     * */
    /**
     * Constructs an instance of the range modifier.
     *
     * @param {RangeDataModifier.Options} [options]
     * Options to configure the range modifier.
     */
    function SortModifier(options) {
        var _this = _super.call(this) || this;
        _this.options = merge(SortModifier.defaultOptions, options);
        return _this;
    }
    /* *
     *
     *  Static Functions
     *
     * */
    SortModifier.ascending = function (a, b) {
        return (!a || !b ? 0 :
            a < b ? -1 :
                a > b ? 1 :
                    0);
    };
    SortModifier.descending = function (a, b) {
        return (!a || !b ? 0 :
            b < a ? -1 :
                b > a ? 1 :
                    0);
    };
    /* *
     *
     *  Functions
     *
     * */
    SortModifier.prototype.execute = function (table, eventDetail) {
        var modifier = this, _a = modifier.options, direction = _a.direction, indexColumn = _a.indexColumn, orderByColumn = _a.orderByColumn, compare = (direction === 'asc' ?
            SortModifier.ascending :
            SortModifier.descending);
        modifier.emit({ type: 'execute', detail: eventDetail, table: table });
        var tableRows = table.getAllRows();
        var tableRow = table.getFirstNonNullRow();
        if (indexColumn &&
            tableRow &&
            !tableRow.hasCell(indexColumn)) {
            for (var i = 0, iEnd = tableRows.length; i < iEnd; ++i) {
                tableRow = tableRows[i];
                tableRow.insertCell(indexColumn, i);
            }
        }
        tableRows.sort(function (a, b) { return compare(a.getCell(orderByColumn), b.getCell(orderByColumn)); });
        var result = new DataTable(tableRows);
        modifier.emit({ type: 'afterExecute', detail: eventDetail, table: result });
        return result;
    };
    /**
     * Converts the sort modifier to a class JSON.
     *
     * @return {DataJSON.ClassJSON}
     * Class JSON of this sort modifier.
     */
    SortModifier.prototype.toJSON = function () {
        return {
            $class: 'SortModifier',
            options: merge(this.options)
        };
    };
    /* *
     *
     *  Static Properties
     *
     * */
    /**
     * Default options to group table rows.
     */
    SortModifier.defaultOptions = {
        modifier: 'Order',
        direction: 'desc',
        orderByColumn: 'y'
    };
    return SortModifier;
}(DataModifier));
/* *
 *
 *  Default Export
 *
 * */
export default SortModifier;
