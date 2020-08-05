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
import U from '../../Core/Utilities.js';
var merge = U.merge;
var FilterRangeDataModifier = /** @class */ (function (_super) {
    __extends(FilterRangeDataModifier, _super);
    /* *
     *
     *  Constructor
     *
     * */
    function FilterRangeDataModifier(options) {
        var _this = _super.call(this, options) || this;
        _this.options = merge(FilterRangeDataModifier.defaultOptions, options);
        return _this;
    }
    /* *
     *
     *  Static Functions
     *
     * */
    FilterRangeDataModifier.fromJSON = function () {
        return new FilterRangeDataModifier();
    };
    /* *
     *
     *  Functions
     *
     * */
    FilterRangeDataModifier.prototype.execute = function (table) {
        var _a = this.options, ranges = _a.ranges, strict = _a.strict, rows = table.getAllRows(), result = new DataTable();
        var column, range, row;
        for (var i = 0, iEnd = ranges.length; i < iEnd; ++i) {
            range = ranges[i];
            if (strict &&
                typeof range.minValue !== typeof range.maxValue) {
                continue;
            }
            for (var j = 0, jEnd = rows.length; j < jEnd; ++j) {
                row = rows[j];
                column = row.getColumn(range.column);
                /* eslint-disable @typescript-eslint/indent */
                switch (typeof column) {
                    default:
                        continue;
                    case 'boolean':
                    case 'number':
                    case 'string':
                        break;
                }
                /* eslint-enable @typescript-eslint/indent */
                if (strict &&
                    typeof column !== typeof range.minValue) {
                    continue;
                }
                if (column >= range.minValue &&
                    column <= range.maxValue) {
                    result.insertRow(row);
                }
            }
        }
        return result;
    };
    FilterRangeDataModifier.prototype.toJSON = function () {
        return {
            $class: 'FilterRangeDataModifier',
            options: this.options
        };
    };
    /* *
     *
     *  Static Properties
     *
     * */
    FilterRangeDataModifier.defaultOptions = {
        modifier: 'FilterRange',
        strict: false,
        ranges: [
            {
                column: 0,
                maxValue: (Number.POSITIVE_INFINITY - 1),
                minValue: (Number.NEGATIVE_INFINITY + 1)
            }
        ]
    };
    return FilterRangeDataModifier;
}(DataModifier));
DataJSON.addClass(FilterRangeDataModifier);
DataModifier.addModifier(FilterRangeDataModifier);
export default FilterRangeDataModifier;
