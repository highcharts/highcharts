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
import '../Options.js';
/**
 * @class
 * @name Highcharts.Series
 */
var Series = /** @class */ (function () {
    /* *
     *
     *  Constructor
     *
     * */
    function Series(chart, options) {
        var mergedOptions = merge(Series.defaultOptions, options);
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
    Series.addSeries = function (seriesName, seriesType) {
        Series.seriesTypes[seriesName] = seriesType;
    };
    Series.cleanRecursively = function (toClean, reference) {
        var clean = {};
        objectEach(toClean, function (_val, key) {
            var ob;
            // Dive into objects (except DOM nodes)
            if (isObject(toClean[key], true) &&
                !toClean.nodeType && // #10044
                reference[key]) {
                ob = Series.cleanRecursively(toClean[key], reference[key]);
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
    Series.getSeries = function (chart, options) {
        if (options === void 0) { options = {}; }
        var optionsChart = chart.options.chart, type = (options.type ||
            optionsChart.type ||
            optionsChart.defaultSeriesType ||
            ''), SeriesClass = Series.seriesTypes[type];
        // No such series type
        if (!SeriesClass) {
            error(17, true, chart, { missingModuleFor: type });
        }
        return new SeriesClass(chart, options);
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
    Series.seriesType = function (type, parent, options, seriesProto, pointProto) {
        var defaultOptions = getOptions().plotOptions || {}, seriesTypes = Series.seriesTypes;
        parent = parent || '';
        // Merge the options
        defaultOptions[type] = merge(defaultOptions[parent], options);
        // Create the class
        Series.addSeries(type, extendClass(seriesTypes[parent] || function () { }, seriesProto));
        seriesTypes[type].prototype.type = type;
        // Create the point class if needed
        if (pointProto) {
            seriesTypes[type].prototype.pointClass =
                extendClass(Point, pointProto);
        }
        return seriesTypes[type];
    };
    Series.prototype.update = function (newOptions, redraw) {
        if (redraw === void 0) { redraw = true; }
        var series = this;
        newOptions = Series.cleanRecursively(newOptions, this.userOptions);
        var newType = newOptions.type;
        if (typeof newType !== 'undefined' &&
            newType !== series.type) {
            series = Series.getSeries(series.chart, newOptions);
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
    Series.defaultOptions = {
        type: 'base'
    };
    Series.seriesTypes = {};
    return Series;
}());
Series.prototype.pointClass = Point;
// backwards compatibility
H.seriesType = Series.seriesType;
H.seriesTypes = Series.seriesTypes;
/* *
 *
 *  Export
 *
 * */
export default Series;
