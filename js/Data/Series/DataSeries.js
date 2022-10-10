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
import D from '../../Core/DefaultOptions.js';
var defaultTime = D.defaultTime;
import LegendSymbol from '../../Core/Legend/LegendSymbol.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import SortModifier from '../Modifiers/SortModifier.js';
import U from '../../Core/Utilities.js';
var cleanRecursively = U.cleanRecursively, extend = U.extend, fireEvent = U.fireEvent, merge = U.merge, pick = U.pick;
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
        this.options = this.setOptions(options);
        this.points = [];
        this.state = '';
        this.table = new DataTable();
        this.tableListeners = [];
        this.userOptions = options;
        this.visible = true;
        this.setData(options.data || []);
    }
    /* *
     *
     *  Static Functions
     *
     * */
    /**
     * Converts the DataTable instance to common series options.
     *
     * @private
     *
     * @param {DataTable} table
     * Table to convert.
     *
     * @param {Array<string>} [keys]
     * Data keys to extract from table rows.
     *
     * @return {Highcharts.SeriesOptions}
     * Common series options.
     */
    DataSeries.getSeriesOptionsFromTable = function (table, keys) {
        var rows = table.getRowObjects(), data = [];
        var pointStart;
        for (var i = 0, iEnd = rows.length; i < iEnd; ++i) {
            if (i === 0) {
                pointStart = (parseInt(rows[i][keys && keys[0] || 'x'], 10) ||
                    void 0);
            }
            data.push(DataPoint.getPointOptionsFromTableRow(rows[i]) || {});
        }
        return {
            data: data,
            id: table.id,
            keys: keys,
            pointStart: pointStart,
            type: 'data'
        };
    };
    /**
     * Converts series options to a DataTable instance.
     *
     * @private
     *
     * @param {Highcharts.SeriesOptions} seriesOptions
     * Series options to convert.
     *
     * @return {DataTable}
     * DataTable instance.
     */
    DataSeries.getTableFromSeriesOptions = function (seriesOptions) {
        var table = new DataTable(void 0, seriesOptions.id), data = (seriesOptions.data || []);
        var keys = (seriesOptions.keys || []), x = (seriesOptions.pointStart || 0);
        if (!keys.length &&
            seriesOptions.type) {
            var seriesClass = SeriesRegistry.seriesTypes[seriesOptions.type];
            keys = (seriesClass &&
                seriesClass.prototype.pointArrayMap ||
                []);
        }
        if (!keys.length) {
            keys = ['y'];
        }
        for (var i = 0, iEnd = data.length; i < iEnd; ++i) {
            table.setRow(DataPoint.getTableRowFromPointOptions(data[i], keys, x));
            x = DataSeries.increment(x, seriesOptions);
        }
        return table;
    };
    // eslint-disable-next-line valid-jsdoc
    /** @private */
    DataSeries.increment = function (value, options, time) {
        if (options === void 0) { options = {}; }
        if (time === void 0) { time = defaultTime; }
        var intervalUnit = options.pointIntervalUnit;
        var interval = pick(options.pointInterval, 1);
        // Added code for pointInterval strings
        if (intervalUnit) {
            var date = new time.Date(value);
            switch (intervalUnit) {
                case 'day':
                    time.set('Date', date, time.get('Date', date) + interval);
                    break;
                case 'month':
                    time.set('Month', date, time.get('Month', date) + interval);
                    break;
                case 'year':
                    time.set('FullYear', date, time.get('FullYear', date) + interval);
                    break;
                default:
            }
            interval = date.getTime() - value;
        }
        return value + interval;
    };
    /* *
     *
     *  Functions
     *
     * */
    DataSeries.prototype.destroy = function () {
        console.log('DataSeries.destroy');
        this.destroyTableListeners();
    };
    DataSeries.prototype.destroyTableListeners = function () {
        console.log('DataSeries.destroyTableListeners');
        var series = this, tableListeners = series.tableListeners.slice();
        series.tableListeners.length = 0;
        for (var i = 0, iEnd = tableListeners.length; i < iEnd; ++i) {
            tableListeners[i]();
        }
    };
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
    DataSeries.prototype.hasData = function () {
        console.log('DataSeries.hasData');
        return (this.table.getRowCount() > 0);
    };
    /** @deprecated */
    DataSeries.prototype.init = function (chart, options) {
        console.log('DataSeries.init');
        var series = this;
        fireEvent(series, 'init');
        series.chart = chart;
        series.setOptions(options);
        series.bindAxes();
        chart.series.push(series);
        series.setData(options.data || []);
        fireEvent(series, 'afterInit');
    };
    DataSeries.prototype.plotGroup = function (parent) {
        console.log('DataSeries.plotGroup');
        var series = this, chart = series.chart, options = series.options, zIndex = options.zIndex, attributes = {
            translateX: chart.plotLeft,
            translateY: chart.plotTop,
            scaleX: 1,
            scaleY: 1,
            visibility: series.visible ? 'visible' : 'hidden',
            zIndex: zIndex
        };
        // Avoid setting undefined opacity, or in styled mode
        if (typeof this.opacity !== 'undefined' &&
            !this.chart.styledMode &&
            this.state !== 'inactive' // #13719
        ) {
            attributes.opacity = this.opacity;
        }
        return parent.renderer
            .g()
            .addClass('highcharts-data-series')
            .attr(attributes)
            .add(parent);
    };
    DataSeries.prototype.redraw = function () {
        console.log('DataSeries.redraw');
        var series = this;
        series.translate();
        series.render();
        if (series.isDirty ||
            series.isDirtyData) { // #3868, #3945
            delete series.kdTree;
        }
    };
    /**
     * Render series as points.
     */
    DataSeries.prototype.render = function (parent) {
        console.log('DataSeries.render');
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
            keys: series.pointArrayMap,
            type: 'data'
        }));
    };
    /** @private */
    DataSeries.prototype.setOptions = function (options) {
        console.log('DataSeries.setOptions');
        var series = this, chart = series.chart;
        fireEvent(series, 'setOptions', { userOptions: options });
        series.options = merge(DataSeries.defaultOptions, (chart &&
            chart.options.plotOptions &&
            chart.options.plotOptions.series), (chart &&
            chart.userOptions &&
            chart.userOptions.plotOptions &&
            chart.userOptions.plotOptions[series.type]), options);
        series.userOptions = merge(options);
        fireEvent(series, 'afterSetOptions', { options: series.options });
        return series.options;
    };
    /**
     * Add or update table.
     */
    DataSeries.prototype.setTable = function (table) {
        console.log('DataSeries.setTable');
        var series = this, dataSorting = series.options.dataSorting, pointsToKeep = [], seriesData = series.data, seriesDataLength = seriesData.length, tableIds = table.getColumnAsNumbers('id', true) || [], tableIdsLength = tableIds.length, PointClass = series.pointClass;
        if (series.table === table) {
            return;
        }
        if (dataSorting && dataSorting.enabled) {
            table = (new SortModifier({
                orderByColumn: series.pointArrayMap[0],
                orderInColumn: 'x'
            })).modifyTable(table);
        }
        series.destroyTableListeners();
        series.table = table;
        series.tableListeners.push(table.on('afterSetRows', function (e) {
            if (e.type === 'afterSetRows') {
                var rowIndex = e.rowIndex, rows = e.rows;
                var currentIndex = rowIndex, point = void 0;
                for (var _i = 0, _a = rows || []; _i < _a.length; _i++) {
                    var row = _a[_i];
                    point = new PointClass(series, rows, currentIndex++);
                    if (currentIndex >= seriesData.length) {
                        seriesData[currentIndex] = point;
                    }
                    else {
                        seriesData.splice(currentIndex, 0, point);
                    }
                }
            }
        }), table.on('afterDeleteRows', function (e) {
            if (e.type === 'afterDeleteRows') {
                seriesData.splice(e.rowIndex, e.rowCount);
            }
        }));
        for (var i = 0, iEnd = tableIdsLength, point = void 0, pointTableRow = void 0, id = void 0; i < iEnd; ++i) {
            point = seriesData[i];
            id = tableIds[i];
            if (!table.autoId) {
                for (var j = 0, jEnd = seriesData.length; j < jEnd; ++j) {
                    point = seriesData[j];
                    if (point &&
                        point.tableRow.id === id) {
                        break;
                    }
                }
                if (!point) {
                    point = seriesData[i];
                }
            }
            if (isNaN(id)) {
                if (point) {
                    point.destroy();
                    point = null;
                }
                seriesData[i] = null;
            }
            else if (point) {
                pointTableRow = point.tableRow;
                if (pointTableRow.id !== id) {
                    point.setTableRow(table.getRowObject(table.getRowIndexBy('id', id) || i) ||
                        {});
                }
            }
            else {
                point = new PointClass(series, table.getRowObject(table.getRowIndexBy('id', id) || i), i);
                seriesData[i] = point;
            }
            if (point) {
                pointsToKeep.push(point);
            }
        }
        if (seriesDataLength > tableIdsLength) {
            for (var i = 0, iEnd = seriesDataLength, point = void 0; i < iEnd; ++i) {
                point = seriesData[i];
                if (point) {
                    if (!pointsToKeep.indexOf(point)) {
                        point.destroy();
                    }
                    else {
                        point.index = i;
                    }
                }
            }
        }
    };
    DataSeries.prototype.translate = function () {
        console.log('DataSeries.translate');
        var series = this;
        series.points = series.data.slice();
    };
    DataSeries.prototype.update = function (options, redraw) {
        console.log('DataSeries.update');
        var series = this;
        options = cleanRecursively(options, series.options);
        fireEvent(series, 'update', { options: options });
        series.options = merge(series.options, {
            animation: false,
            index: pick(series.options.index, series.index)
        }, options);
        series.setData(options.data || []);
        fireEvent(series, 'afterUpdate');
        if (pick(redraw, true)) {
            series.chart.redraw();
        }
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
    return DataSeries;
}());
extend(DataSeries.prototype, {
    axisTypes: [],
    bindAxes: CS.prototype.bindAxes,
    drawLegendSymbol: LegendSymbol.drawRectangle,
    insert: CS.prototype.insert,
    is: CS.prototype.is,
    parallelArrays: [],
    pointArrayMap: ['y'],
    pointClass: DataPoint,
    type: 'data',
    updateParallelArrays: CS.prototype.updateParallelArrays
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
