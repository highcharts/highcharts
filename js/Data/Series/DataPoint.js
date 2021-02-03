/* eslint-disable brace-style */
/* eslint-disable no-console */
/* *
 *
 *  Imports
 *
 * */
import CP from '../../Core/Series/Point.js';
import U from '../../Core/Utilities.js';
var merge = U.merge;
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
    function DataPoint(series, options, x) {
        if (options === void 0) { options = {}; }
        console.log('DataPoint.constructor');
        this.series = series;
        this.options = merge({ x: x }, options);
        this.tableRow = DataPoint.getTableRowFromPointOptions(options);
    }
    /* *
     *
     *  Functions
     *
     * */
    DataPoint.prototype.destroy = function () {
        console.log('DataPoint.destroy');
        var point = this;
        point.series.table.deleteRow(point.tableRow);
    };
    DataPoint.prototype.render = function (parent) {
        console.log('DataPoint.render');
        var point = this, tableRow = point.tableRow;
        point.graphic = parent.renderer
            .rect(tableRow.getCellAsNumber('x') * 10, tableRow.getCellAsNumber('y'), 1, 1)
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
        var point = this;
        if (point.tableRow !== tableRow) {
            point.series.table.replaceRow(point.tableRow, tableRow);
            point.tableRow = tableRow;
        }
        this.update(DataPoint.getPointOptionsFromTableRow(tableRow, this.series.pointArrayMap) || {});
    };
    DataPoint.prototype.update = function (options, redraw, animation) {
        console.log('DataPoint.update');
        var point = this;
        merge(true, point.options, options);
        if (redraw) {
            point.series.chart.redraw(animation);
        }
    };
    /* *
     *
     *  Static Functions
     *
     * */
    DataPoint.getPointOptionsFromTableRow = CP.getPointOptionsFromTableRow;
    DataPoint.getTableRowFromPointOptions = CP.getTableRowFromPointOptions;
    return DataPoint;
}());
/* *
 *
 *  Default Export
 *
 * */
export default DataPoint;
