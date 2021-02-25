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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import Chart from '../../Core/Chart/Chart.js';
import Component from './Component.js';
import DataSeriesConverter from '../../Data/DataSeriesConverter.js';
import DataStore from '../../Data/Stores/DataStore.js';
import DataJSON from '../../Data/DataJSON.js';
import H from '../../Core/Globals.js';
import U from '../../Core/Utilities.js';
var createElement = U.createElement, merge = U.merge, uniqueKey = U.uniqueKey;
/* *
 *
 *  Class
 *
 * */
var ChartComponent = /** @class */ (function (_super) {
    __extends(ChartComponent, _super);
    /* *
     *
     *  Constructor
     *
     * */
    function ChartComponent(options) {
        var _a;
        var _this = this;
        options = merge(ChartComponent.defaultOptions, options);
        _this = _super.call(this, options) || this;
        _this.options = options;
        _this.charter = _this.options.Highcharts;
        _this.chartConstructor = _this.options.chartConstructor;
        _this.type = 'chart';
        _this.chartContainer = createElement('figure');
        if (_this.options.chartClassName) {
            _this.chartContainer.classList.add(_this.options.chartClassName);
        }
        if (_this.options.chartID) {
            _this.chartContainer.id = _this.options.chartID;
        }
        _this.chartOptions = _this.options.chartOptions || {};
        // Extend via event.
        _this.on('resize', function (e) {
            if (_this.chart) {
                _this.chart.setSize(_this.dimensions.width, _this.dimensions.height);
            }
        });
        var table = (_a = _this.store) === null || _a === void 0 ? void 0 : _a.table;
        if (table) {
            _this.on('tableChanged', function (e) {
                var _a;
                if (((_a = e.detail) === null || _a === void 0 ? void 0 : _a.sender) !== _this.id) {
                    _this.updateSeries();
                }
            });
        }
        return _this;
    }
    ChartComponent.fromJSON = function (json) {
        var options = json.options;
        var chartOptions = JSON.parse(json.options.chartOptions || '');
        var store = json.store ? DataJSON.fromJSON(json.store) : void 0;
        var component = new ChartComponent(merge(options, {
            chartOptions: chartOptions,
            Highcharts: Highcharts,
            store: store instanceof DataStore ? store : void 0
        }));
        return component;
    };
    /* *
     *
     *  Class methods
     *
     * */
    ChartComponent.prototype.load = function () {
        this.emit({ type: 'load' });
        _super.prototype.load.call(this);
        this.initChart();
        this.parentElement.appendChild(this.element);
        this.element.appendChild(this.chartContainer);
        this.hasLoaded = true;
        this.emit({ type: 'afterLoad' });
        return this;
    };
    ChartComponent.prototype.render = function () {
        _super.prototype.render.call(this);
        this.emit({ type: 'afterRender' });
        return this;
    };
    ChartComponent.prototype.redraw = function () {
        _super.prototype.redraw.call(this);
        this.initChart();
        return this.render();
    };
    ChartComponent.prototype.update = function (options) {
        var _a;
        _super.prototype.update.call(this, options);
        if (this.chart) {
            this.chart.update(((_a = this.options) === null || _a === void 0 ? void 0 : _a.chartOptions) || {});
        }
        this.emit({ type: 'afterUpdate' });
        return this;
    };
    ChartComponent.prototype.updateSeries = function () {
        var _a;
        var series = new DataSeriesConverter((_a = this.store) === null || _a === void 0 ? void 0 : _a.table, {})
            .getAllSeriesData();
        if (this.chart) {
            this.chart.update({ series: series }, true);
        }
    };
    ChartComponent.prototype.initChart = function () {
        var _a;
        var series = new DataSeriesConverter((_a = this.store) === null || _a === void 0 ? void 0 : _a.table, {});
        this.chartOptions.series = this.chartOptions.series ? __spreadArrays(series.getAllSeriesData(), this.chartOptions.series) :
            series.getAllSeriesData();
        this.constructChart();
        if (this.chart) {
            var _b = this.dimensions, width = _b.width, height = _b.height;
            this.chart.setSize(width, height);
        }
    };
    ChartComponent.prototype.constructChart = function () {
        var constructorMap = {
            '': 'chart',
            stock: 'stockChart',
            map: 'mapChart',
            gantt: 'ganttChart'
        };
        if (this.chartConstructor !== 'chart') {
            var constructor = constructorMap[this.chartConstructor];
            if (this.charter[constructor]) {
                this.chart = new this.charter[constructor](this.chartContainer, this.chartOptions);
                if (this.chart instanceof Chart) {
                    return this.chart;
                }
            }
        }
        if (typeof this.charter.chart !== 'function') {
            throw new Error('Chart constructor not found');
        }
        this.chart = this.charter.chart(this.chartContainer, this.chartOptions);
        return this.chart;
    };
    ChartComponent.prototype.toJSON = function () {
        var chartOptions = JSON.stringify(this.options.chartOptions), Highcharts = this.options.Highcharts, chartConstructor = this.options.chartConstructor;
        var base = _super.prototype.toJSON.call(this);
        return __assign(__assign({}, base), { options: __assign(__assign({}, base.options), { chartOptions: chartOptions, Highcharts: Highcharts.product, chartConstructor: chartConstructor }) });
    };
    /* *
     *
     *  Static properties
     *
     * */
    ChartComponent.defaultOptions = merge(Component.defaultOptions, {
        chartClassName: 'chart-container',
        chartID: 'chart-' + uniqueKey(),
        chartOptions: {
            series: []
        },
        Highcharts: H,
        chartConstructor: ''
    });
    return ChartComponent;
}(Component));
/* *
 *
 *  Default export
 *
 * */
export default ChartComponent;
