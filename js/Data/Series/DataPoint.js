/* eslint-disable brace-style */
/* eslint-disable no-console */
/* eslint-disable no-invalid-this */
import U from '../../Core/Utilities.js';
var extend = U.extend, merge = U.merge;
/* *
 *
 *  Functions
 *
 * */
/**
 * Reconstructs object keys in dot syntax to tree-like objects.
 * @private
 */
function tree(flatObj) {
    var obj = {};
    Object
        .getOwnPropertyNames(flatObj)
        .forEach(function (name) {
        if (name.indexOf('.') === -1) {
            if (flatObj[name] instanceof Array) {
                obj[name] = flatObj[name].map(tree);
            }
            else {
                obj[name] = flatObj[name];
            }
        }
        else {
            var subNames = name.split('.'), subObj = subNames
                .slice(0, -1)
                .reduce(function (subObj, subName) {
                return (subObj[subName] = (subObj[subName] || {}));
            }, obj);
            subObj[(subNames.pop() || '')] = flatObj[name];
        }
    });
    return obj;
}
/* *
 *
 *  Class
 *
 * */
var DataPoint = /** @class */ (function () {
    /* *
     *
     *  Constructor
     *
     * */
    function DataPoint(series, data, x) {
        console.log('DataPoint.constructor');
        this.options = { x: x };
        this.series = series;
        this.tableRow = {};
        if (data) {
            this.setTableRow(DataPoint.getTableRowFromPointOptions(data));
        }
    }
    /* *
     *
     *  Static Functions
     *
     * */
    /**
     * Converts the DataTableRow instance to common series options.
     *
     * @param {DataTableRow} tableRow
     * Table row to convert.
     *
     * @param {Array<string>} [keys]
     * Data keys to extract from the table row.
     *
     * @return {Highcharts.PointOptions}
     * Common point options.
     */
    DataPoint.getPointOptionsFromTableRow = function (tableRow) {
        return tree(tableRow);
    };
    /**
     * Converts series options to a DataTable instance.
     *
     * @param {Highcharts.PointOptions} pointOptions
     * Point options to convert.
     *
     * @param {Array<string>} [keys]
     * Data keys to convert options.
     *
     * @param {number} [x]
     * Point index for x value.
     *
     * @return {DataTable}
     * DataTable instance.
     */
    DataPoint.getTableRowFromPointOptions = function (pointOptions, keys, x) {
        var _a;
        if (keys === void 0) { keys = ['y']; }
        if (x === void 0) { x = 0; }
        var tableRow;
        keys = keys.slice();
        // Array
        if (pointOptions instanceof Array) {
            tableRow = {};
            if (pointOptions.length > keys.length) {
                keys.unshift(typeof pointOptions[0] === 'string' ?
                    'name' :
                    'x');
            }
            for (var i = 0, iEnd = pointOptions.length; i < iEnd; ++i) {
                tableRow[keys[i] || "".concat(i)] = pointOptions[i];
            }
            // Object
        }
        else if (typeof pointOptions === 'object') {
            if (pointOptions === null) {
                tableRow = {};
            }
            else {
                tableRow = tree(pointOptions);
            }
            // Primitive
        }
        else {
            tableRow = (_a = {
                    x: x
                },
                _a[keys[0] || 'y'] = pointOptions,
                _a);
        }
        return tableRow;
    };
    /* *
     *
     *  Functions
     *
     * */
    DataPoint.prototype.destroy = function () {
        console.log('DataPoint.destroy');
        var point = this;
        point.tableRow = {};
        if (point.tableRowListener) {
            point.tableRowListener();
        }
    };
    DataPoint.prototype.render = function (parent) {
        console.log('DataPoint.render');
        var point = this, tableRow = point.tableRow, valueKey = point.series.pointArrayMap[0];
        if (point.graphic) {
            point.graphic.destroy();
        }
        point.graphic = parent.renderer
            .rect(tableRow['x'] * 10, tableRow[valueKey] * 10, 1, 1)
            .addClass('highcharts-data-point')
            .attr({
            fill: '#333',
            stroke: '#000',
            'stroke-width': 1,
            opacity: 1
        })
            .add(parent);
    };
    DataPoint.prototype.setTableRow = function (tableRow) {
        console.log('DataPoint.setTableRow');
        var point = this, series = point.series, chart = series.chart;
        if (point.tableRow !== tableRow) {
            if (point.tableRowListener) {
                point.tableRowListener();
            }
            point.tableRow = tableRow;
            // point.tableRowListener = tableRow.on('afterChangeRow', function (
            //     this: DataTableRow
            // ): void {
            //     point.update(
            //         DataPoint.getPointOptionsFromTableRow(
            //             this,
            //             series.options.keys || series.pointArrayMap
            //         ) || {},
            //         false,
            //         false
            //     );
            //     series.isDirty = true;
            //     series.isDirtyData = true;
            //     // POC by Torstein
            //     if (typeof chart.redrawTimer === 'undefined') {
            //         chart.redrawTimer = setTimeout(function (): void {
            //             chart.redrawTimer = void 0;
            //             chart.redraw();
            //         });
            //     }
            // });
        }
        point.update(DataPoint.getPointOptionsFromTableRow(tableRow) || {}, true, false);
    };
    DataPoint.prototype.update = function (options, redraw, animation) {
        console.log('DataPoint.update');
        var point = this, series = point.series;
        merge(true, point.options, options);
        if (redraw) {
            series.isDirty = true;
            series.isDirtyData = true;
            series.chart.redraw(animation);
        }
    };
    return DataPoint;
}());
/* *
 *
 *  Default Export
 *
 * */
export default DataPoint;
