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
 * Filters out table rows with a specific value range.
 *
 * @private
 */
var RangeModifier = /** @class */ (function (_super) {
    __extends(RangeModifier, _super);
    /* *
     *
     *  Constructor
     *
     * */
    /**
     * Constructs an instance of the range modifier.
     *
     * @param {RangeModifier.Options} [options]
     * Options to configure the range modifier.
     */
    function RangeModifier(options) {
        var _this = _super.call(this) || this;
        _this.options = merge(RangeModifier.defaultOptions, options);
        return _this;
    }
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Replaces table rows with filtered rows.
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
    RangeModifier.prototype.modifyTable = function (table, eventDetail) {
        var modifier = this;
        modifier.emit({ type: 'modify', detail: eventDetail, table: table });
        var _a = modifier.options, ranges = _a.ranges, strict = _a.strict;
        if (ranges.length) {
            var columns = table.getColumns(), rows = [], modified = table.modified;
            for (var i = 0, iEnd = ranges.length, range = void 0, rangeColumn = void 0; i < iEnd; ++i) {
                range = ranges[i];
                if (strict &&
                    typeof range.minValue !== typeof range.maxValue) {
                    continue;
                }
                rangeColumn = (columns[range.column] || []);
                for (var j = 0, jEnd = rangeColumn.length, cell = void 0, row = void 0; j < jEnd; ++j) {
                    cell = rangeColumn[j];
                    switch (typeof cell) {
                        default:
                            continue;
                        case 'boolean':
                        case 'number':
                        case 'string':
                            break;
                    }
                    if (strict &&
                        typeof cell !== typeof range.minValue) {
                        continue;
                    }
                    if (cell >= range.minValue &&
                        cell <= range.maxValue) {
                        row = table.getRow(j);
                        if (row) {
                            rows.push(row);
                        }
                    }
                }
            }
            modified.deleteRows();
            modified.setRows(rows);
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
     * Default options for the range modifier.
     */
    RangeModifier.defaultOptions = {
        modifier: 'Range',
        strict: false,
        ranges: []
    };
    return RangeModifier;
}(DataModifier));
/* *
 *
 *  Register
 *
 * */
DataModifier.addModifier(RangeModifier);
/* *
 *
 *  Export
 *
 * */
export default RangeModifier;
