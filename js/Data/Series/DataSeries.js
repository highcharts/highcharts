/* eslint-disable brace-style */
/* eslint-disable no-console */
/* eslint-disable valid-jsdoc */
/* *
 *
 *  Imports
 *
 * */
import CS from '../../Core/Series/Series.js';
import DataPoint from './DataPoint.js';
import DataTable from '../DataTable.js';
import LegendSymbolMixin from '../../Mixins/LegendSymbol.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import U from '../../Core/Utilities.js';
var extend = U.extend, fireEvent = U.fireEvent, merge = U.merge;
/* *
 *
 *  Class
 *
 * */
var DataSeries = /** @class */ (function () {
    /* *
     *
     *  Constructor
     *
     * */
    function DataSeries(chart, options) {
        if (options === void 0) { options = {}; }
        console.log('DataSeries.constructor');
        this.chart = chart;
        this.data = [];
        this.linkedSeries = [];
        this.options = merge(DataSeries.defaultOptions, options);
        this.points = [];
        this.table = (options.data ?
            DataSeries.getTableFromSeriesOptions(this.options) :
            new DataTable());
        this.userOptions = options;
        this.visible = true;
    }
    /* *
     *
     *  Functions
     *
     * */
    /* public findPoint(
        tableRow: DataTableRow,
        startIndex: number = 0
    ): (this['pointClass']['prototype']|undefined) {
        if (tableRow.isNull()) {
            return;
        }

        const series = this,
            data = series.data,
            id = tableRow.id,
            x = tableRow.getCellAsNumber('x');

        let point: typeof series.data[0],
            pointTableRow: (DataTableRow);

        for (let i = startIndex, iEnd = data.length; i < iEnd; ++i) {
            point = data[i];
            if (point) {
                pointTableRow = point.tableRow;
                if (pointTableRow === tableRow) {
                    return point;
                }
                if (pointTableRow.id === id) {
                    return point;
                }
                if (pointTableRow.getCellAsNumber('x') === x) {
                    return point;
                }
            }
        }
    } */
    /** @deprecated */
    DataSeries.prototype.init = function (chart, options) {
        console.log('DataSeries.init');
        var series = this;
        fireEvent(this, 'init');
        series.chart = chart;
        series.options = merge(series.options, options);
        series.userOptions = merge(series.userOptions, options);
        var table = DataSeries.getTableFromSeriesOptions(series.options);
        if (table) {
            series.setTable(table);
        }
        series.bindAxes();
        chart.series.push(this);
        fireEvent(this, 'afterInit');
    };
    DataSeries.prototype.plotGroup = function (parent) {
        console.log('DataSeries.plotGroup');
        var series = this, chart = series.chart, options = series.options, visibility = series.visible, xAxis = series.xAxis, yAxis = series.yAxis, zIndex = options.zIndex;
        return parent.renderer
            .g()
            .addClass('highcharts-data-series')
            .attr({
            translateX: xAxis ? xAxis.left : chart.plotLeft,
            translateY: yAxis ? yAxis.top : chart.plotTop,
            scaleX: 1,
            scaleY: 1,
            visibility: visibility,
            zIndex: zIndex
        })
            .add(parent);
    };
    /**
     * Render series as points.
     */
    DataSeries.prototype.render = function (parent) {
        var series = this, chart = series.chart, points = series.points, renderer = chart.renderer;
        var group = series.group;
        if (parent) {
            group = series.plotGroup(parent);
        }
        else if (!group) {
            series.group = group = series.plotGroup(chart.seriesGroup || renderer.boxWrapper);
        }
        for (var i = 0, iEnd = points.length, point = void 0; i < iEnd; ++i) {
            point = points[i];
            if (point) {
                point.render(group);
            }
        }
    };
    /** @deprecated */
    DataSeries.prototype.setData = function (data) {
        console.log('DataSeries.setData');
        var series = this;
        series.setTable(DataSeries.getTableFromSeriesOptions({
            data: data,
            keys: series.pointArrayMap
        }));
    };
    /**
     * Add or update points of table rows.
     */
    DataSeries.prototype.setTable = function (table) {
        console.log('DataSeries.setTable');
        var series = this, seriesData = series.data, seriesTable = series.table, tableRows = table.getAllRows(), tableRowsLength = tableRows.length, SeriesPoint = series.pointClass;
        if (series.table === table) {
            return;
        }
        series.table = table;
        for (var i = 0, iEnd = tableRowsLength, point = void 0, tableRow = void 0; i < iEnd; ++i) {
            point = seriesData[i];
            tableRow = tableRows[i];
            if (tableRow.isNull()) {
                if (point) {
                    point.destroy();
                }
                seriesData[i] = null;
            }
            else if (point) {
                point.setTableRow(tableRow);
            }
            else {
                seriesData[i] = new SeriesPoint(series, tableRow);
            }
        }
        seriesData.length = tableRowsLength;
    };
    DataSeries.prototype.translate = function () {
        console.log('DataSeries.translate');
        var series = this;
        series.points = series.data.slice();
    };
    /* *
     *
     *  Static Properties
     *
     * */
    DataSeries.defaultOptions = {
        dataLabels: {
            enabled: false
        }
    };
    /* *
     *
     *  Static Functions
     *
     * */
    DataSeries.getSeriesOptionsFromTable = CS.getSeriesOptionsFromTable;
    DataSeries.getTableFromSeriesOptions = CS.getTableFromSeriesOptions;
    return DataSeries;
}());
extend(DataSeries.prototype, {
    bindAxes: CS.prototype.bindAxes,
    drawLegendSymbol: LegendSymbolMixin.drawRectangle,
    pointArrayMap: ['y'],
    pointClass: DataPoint
});
/* *
 *
 *  Registry
 *
 * */
SeriesRegistry.registerSeriesType('data', DataSeries);
/* *
 *
 *  Default Export
 *
 * */
export default DataSeries;
