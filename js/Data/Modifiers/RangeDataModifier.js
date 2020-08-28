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
import U from '../../Core/Utilities.js';
var merge = U.merge;
/* *
 *
 *  Class
 *
 * */
/**
 * Filters out table rows with a specific value range.
 */
var RangeDataModifier = /** @class */ (function (_super) {
    __extends(RangeDataModifier, _super);
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
    function RangeDataModifier(options) {
        var _this = _super.call(this) || this;
        _this.options = merge(RangeDataModifier.defaultOptions, options);
        return _this;
    }
    /* *
     *
     *  Static Functions
     *
     * */
    /**
     * Converts a class JSON to a range modifier.
     *
     * @param {RangeDataModifier.ClassJSON} json
     * Class JSON to convert to an instance of range modifier.
     *
     * @return {RangeDataModifier}
     * GrouRangep modifier of the class JSON.
     */
    RangeDataModifier.fromJSON = function (json) {
        return new RangeDataModifier(json.options);
    };
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Applies modifications to the table rows and returns a new table with
     * subtable, containing only the filtered rows.
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
    RangeDataModifier.prototype.execute = function (table, eventDetail) {
        var modifier = this, _a = modifier.options, ranges = _a.ranges, strict = _a.strict, rows = table.getAllRows(), result = new DataTable();
        var column, range, row;
        this.emit({ type: 'execute', detail: eventDetail, table: table });
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
        this.emit({ type: 'afterExecute', detail: eventDetail, table: result });
        return result;
    };
    /**
     * Converts the range modifier to a class JSON, including all containing all
     * modifiers.
     *
     * @return {DataJSON.ClassJSON}
     * Class JSON of this range modifier.
     */
    RangeDataModifier.prototype.toJSON = function () {
        return {
            $class: 'RangeDataModifier',
            options: merge(this.options)
        };
    };
    /* *
     *
     *  Static Properties
     *
     * */
    /**
     * Default options for the range modifier.
     */
    RangeDataModifier.defaultOptions = {
        modifier: 'Range',
        strict: false,
        ranges: [
            {
                column: 0,
                maxValue: (Number.POSITIVE_INFINITY - 1),
                minValue: (Number.NEGATIVE_INFINITY + 1)
            }
        ]
    };
    return RangeDataModifier;
}(DataModifier));
/* *
 *
 *  Register
 *
 * */
DataJSON.addClass(RangeDataModifier);
DataModifier.addModifier(RangeDataModifier);
/* *
 *
 *  Export
 *
 * */
export default RangeDataModifier;
