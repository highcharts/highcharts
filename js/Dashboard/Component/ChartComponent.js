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
import Component from './Component.js';
import DataSeriesConverter from '../../Data/DataSeriesConverter.js';
// eslint-disable-next-line
// @ts-ignore
import Highcharts from 'https://code.highcharts.com/es-modules/masters/highcharts.src.js';
import 'https://code.highcharts.com/es-modules/Extensions/DraggablePoints.js';
import 'https://code.highcharts.com/es-modules/Extensions/Exporting.js';
import 'https://code.highcharts.com/es-modules/Extensions/ExportData.js';
import U from '../../Core/Utilities.js';
var createElement = U.createElement, merge = U.merge, uniqueKey = U.uniqueKey;
var ChartComponent = /** @class */ (function (_super) {
    __extends(ChartComponent, _super);
    function ChartComponent(options) {
        var _a;
        var _this = this;
        options = merge(ChartComponent.defaultOptions, options);
        _this = _super.call(this, options) || this;
        _this.options = options;
        _this.type = 'chart';
        _this.chartContainer = createElement('figure');
        if (_this.options.chartClassName) {
            _this.chartContainer.classList.add(_this.options.chartClassName);
        }
        if (_this.options.chartID) {
            _this.chartContainer.id = _this.options.chartID;
        }
        _this.chartOptions = _this.options.chartOptions;
        // Extend via event.
        _this.on('resize', function (e) {
            _this.chart.setSize(e.width, e.height);
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
        return this.render();
    };
    ChartComponent.prototype.update = function (options) {
        var _a;
        _super.prototype.update.call(this, options);
        this.chart.update(((_a = this.options) === null || _a === void 0 ? void 0 : _a.chartOptions) || {});
        this.emit({ type: 'afterUpdate' });
        return this;
    };
    ChartComponent.prototype.updateSeries = function () {
        var _a;
        var series = new DataSeriesConverter((_a = this.store) === null || _a === void 0 ? void 0 : _a.table, {})
            .getAllSeriesData();
        this.chart.update({ series: series }, true);
    };
    ChartComponent.prototype.initChart = function () {
        var _a;
        // Handle series
        var series = new DataSeriesConverter((_a = this.store) === null || _a === void 0 ? void 0 : _a.table, {});
        this.chartOptions.series = __spreadArrays(series.getAllSeriesData(), this.chartOptions.series);
        this.chart = Highcharts.chart(this.chartContainer, this.chartOptions);
        var _b = this.dimensions, width = _b.width, height = _b.height;
        this.chart.setSize(width, height);
    };
    ChartComponent.defaultOptions = __assign(__assign({}, Component.defaultOptions), { chartClassName: 'chart-container', chartID: 'chart-' + uniqueKey(), chartOptions: {
            series: []
        } });
    return ChartComponent;
}(Component));
export default ChartComponent;
