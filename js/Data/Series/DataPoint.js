/* eslint-disable brace-style */
/* eslint-disable no-console */
/* eslint-disable no-invalid-this */
import CP from '../../Core/Series/Point.js';
import DataTableRow from '../DataTableRow.js';
import U from '../../Core/Utilities.js';
var extend = U.extend, merge = U.merge;
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
        this.tableRow = DataTableRow.NULL;
        if (data) {
            if (data instanceof DataTableRow) {
                this.setTableRow(data);
            }
            else {
                this.setTableRow(DataPoint.getTableRowFromPointOptions(data));
            }
        }
    }
    /* *
     *
     *  Functions
     *
     * */
    DataPoint.prototype.destroy = function () {
        console.log('DataPoint.destroy');
        var point = this;
        point.tableRow = DataTableRow.NULL;
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
            .rect(tableRow.getCellAsNumber('x') * 10, tableRow.getCellAsNumber(valueKey) * 10, 1, 1)
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
            point.tableRowListener = tableRow.on('afterChangeRow', function () {
                point.update(DataPoint.getPointOptionsFromTableRow(this, series.options.keys || series.pointArrayMap) || {}, false, false);
                series.isDirty = true;
                series.isDirtyData = true;
                // POC by Torstein
                if (typeof chart.redrawTimer === 'undefined') {
                    chart.redrawTimer = setTimeout(function () {
                        chart.redrawTimer = void 0;
                        chart.redraw();
                    });
                }
            });
        }
        point.update(DataPoint.getPointOptionsFromTableRow(tableRow, series.pointArrayMap) || {}, true, false);
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
