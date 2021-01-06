/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from '../Globals.js';
import O from '../Options.js';
var defaultOptions = O.defaultOptions;
import Point from './Point.js';
import U from '../Utilities.js';
var error = U.error, extendClass = U.extendClass, isObject = U.isObject, merge = U.merge, objectEach = U.objectEach;
/* *
 *
 *  Namespace
 *
 * */
var Series;
(function (Series) {
    /* *
     *
     *  Static Properties
     *
     * */
    Series.seriesTypes = {};
    /* *
     *
     *  Static Functions
     *
     * */
    /* eslint-disable valid-jsdoc */
    /**
     * Internal function to initialize an individual series.
     * @private
     */
    function getSeries(chart, options) {
        if (options === void 0) { options = {}; }
        var optionsChart = chart.options.chart, type = (options.type ||
            optionsChart.type ||
            optionsChart.defaultSeriesType ||
            ''), SeriesClass = Series.seriesTypes[type];
        // No such series type
        if (!Series) {
            error(17, true, chart, { missingModuleFor: type });
        }
        var series = new SeriesClass();
        if (typeof series.init === 'function') {
            series.init(chart, options);
        }
        return series;
    }
    Series.getSeries = getSeries;
    /**
     * Registers class pattern of a series.
     *
     * @private
     */
    function registerSeriesType(seriesType, seriesClass) {
        var defaultPlotOptions = defaultOptions.plotOptions || {}, seriesOptions = seriesClass.defaultOptions;
        if (!seriesClass.prototype.pointClass) {
            seriesClass.prototype.pointClass = Point;
        }
        seriesClass.prototype.type = seriesType;
        if (seriesOptions) {
            defaultPlotOptions[seriesType] = seriesOptions;
        }
        Series.seriesTypes[seriesType] = seriesClass;
    }
    Series.registerSeriesType = registerSeriesType;
    /**
     * Old factory to create new series prototypes.
     *
     * @deprecated
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
    function seriesType(type, parent, options, seriesProto, pointProto) {
        var defaultPlotOptions = defaultOptions.plotOptions || {};
        parent = parent || '';
        // Merge the options
        defaultPlotOptions[type] = merge(defaultPlotOptions[parent], options);
        // Create the class
        registerSeriesType(type, extendClass(Series.seriesTypes[parent] || function () { }, seriesProto));
        Series.seriesTypes[type].prototype.type = type;
        // Create the point class if needed
        if (pointProto) {
            Series.seriesTypes[type].prototype.pointClass =
                extendClass(Point, pointProto);
        }
        return Series.seriesTypes[type];
    }
    Series.seriesType = seriesType;
    /* eslint-enable valid-jsdoc */
})(Series || (Series = {}));
/* *
 *
 *  Compatibility
 *
 * */
H.seriesType = Series.seriesType;
H.seriesTypes = Series.seriesTypes;
/* *
 *
 *  Export
 *
 * */
export default Series;
