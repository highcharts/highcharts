/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
import H from '../Globals.js';
import Point from './Point.js';
import U from '../Utilities.js';
var error = U.error, extendClass = U.extendClass, fireEvent = U.fireEvent, getOptions = U.getOptions, isObject = U.isObject, merge = U.merge, objectEach = U.objectEach;
/**
 * @class
 * @name Highcharts.Series
 */
var BaseSeries = /** @class */ (function () {
    /* *
     *
     *  Constructor
     *
     * */
    function BaseSeries(chart, options) {
        var mergedOptions = merge(BaseSeries.defaultOptions, options);
        this.chart = chart;
        this._i = chart.series.length;
        chart.series.push(this);
        this.options = mergedOptions;
        this.userOptions = merge(options);
    }
    /* *
     *
     *  Static Functions
     *
     * */
    BaseSeries.addSeries = function (seriesName, seriesType) {
        BaseSeries.seriesTypes[seriesName] = seriesType;
    };
    BaseSeries.cleanRecursively = function (toClean, reference) {
        var clean = {};
        objectEach(toClean, function (_val, key) {
            var ob;
            // Dive into objects (except DOM nodes)
            if (isObject(toClean[key], true) &&
                !toClean.nodeType && // #10044
                reference[key]) {
                ob = BaseSeries.cleanRecursively(toClean[key], reference[key]);
                if (Object.keys(ob).length) {
                    clean[key] = ob;
                }
                // Arrays, primitives and DOM nodes are copied directly
            }
            else if (isObject(toClean[key]) ||
                toClean[key] !== reference[key]) {
                clean[key] = toClean[key];
            }
        });
        return clean;
    };
    // eslint-disable-next-line valid-jsdoc
    /**
     * Internal function to initialize an individual series.
     * @private
     */
    BaseSeries.getSeries = function (chart, options) {
        if (options === void 0) { options = {}; }
        var optionsChart = chart.options.chart, type = (options.type ||
            optionsChart.type ||
            optionsChart.defaultSeriesType ||
            ''), Series = BaseSeries.seriesTypes[type];
        // No such series type
        if (!Series) {
            error(17, true, chart, { missingModuleFor: type });
        }
        return new Series(chart, options);
    };
    /**
     * Factory to create new series prototypes.
     *
     * @function Highcharts.seriesType
     *
     * @param {string} type
     * The series type name.
     *
     * @param {string} parent
     * The parent series type name. Use `line` to inherit from the basic
     * {@link Series} object.
     *
     * @param {Highcharts.SeriesOptionsType|Highcharts.Dictionary<*>} options
     * The additional default options that are merged with the parent's options.
     *
     * @param {Highcharts.Dictionary<*>} [props]
     * The properties (functions and primitives) to set on the new prototype.
     *
     * @param {Highcharts.Dictionary<*>} [pointProps]
     * Members for a series-specific extension of the {@link Point} prototype if
     * needed.
     *
     * @return {Highcharts.Series}
     * The newly created prototype as extended from {@link Series} or its
     * derivatives.
     */
    // docs: add to API + extending Highcharts
    BaseSeries.seriesType = function (type, parent, options, seriesProto, pointProto) {
        var defaultOptions = getOptions().plotOptions || {}, seriesTypes = BaseSeries.seriesTypes;
        parent = parent || '';
        // Merge the options
        defaultOptions[type] = merge(defaultOptions[parent], options);
        // Create the class
        BaseSeries.addSeries(type, extendClass(seriesTypes[parent] || function () { }, seriesProto));
        seriesTypes[type].prototype.type = type;
        // Create the point class if needed
        if (pointProto) {
            seriesTypes[type].prototype.pointClass =
                extendClass(Point, pointProto);
        }
        return seriesTypes[type];
    };
    BaseSeries.prototype.update = function (newOptions, redraw) {
        if (redraw === void 0) { redraw = true; }
        var series = this;
        newOptions = BaseSeries.cleanRecursively(newOptions, this.userOptions);
        var newType = newOptions.type;
        if (typeof newType !== 'undefined' &&
            newType !== series.type) {
            series = BaseSeries.getSeries(series.chart, newOptions);
        }
        fireEvent(series, 'update', { newOptions: newOptions });
        series.userOptions = merge(newOptions);
        fireEvent(series, 'afterUpdate', { newOptions: newOptions });
        if (redraw) {
            series.chart.redraw();
        }
        return series;
    };
    /* *
     *
     *  Static Properties
     *
     * */
    BaseSeries.defaultOptions = {
        type: 'base'
    };
    BaseSeries.seriesTypes = {};
    return BaseSeries;
}());
BaseSeries.prototype.pointClass = Point;
// backwards compatibility
H.seriesType = BaseSeries.seriesType;
H.seriesTypes = BaseSeries.seriesTypes;
/* *
 *
 *  Export
 *
 * */
export default BaseSeries;
