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
import Axis from '../Axis/Axis.js';
import H from '../Globals.js';
var charts = H.charts, doc = H.doc, seriesTypes = H.seriesTypes, win = H.win;
import Legend from '../Legend.js';
import MSPointer from '../MSPointer.js';
import O from '../Options.js';
var defaultOptions = O.defaultOptions;
import Pointer from '../Pointer.js';
import Time from '../Time.js';
import U from '../Utilities.js';
var addEvent = U.addEvent, animate = U.animate, animObject = U.animObject, attr = U.attr, createElement = U.createElement, css = U.css, defined = U.defined, discardElement = U.discardElement, erase = U.erase, error = U.error, extend = U.extend, find = U.find, fireEvent = U.fireEvent, getStyle = U.getStyle, isArray = U.isArray, isFunction = U.isFunction, isNumber = U.isNumber, isObject = U.isObject, isString = U.isString, merge = U.merge, numberFormat = U.numberFormat, objectEach = U.objectEach, pick = U.pick, pInt = U.pInt, relativeLength = U.relativeLength, removeEvent = U.removeEvent, setAnimation = U.setAnimation, splat = U.splat, syncTimeout = U.syncTimeout, uniqueKey = U.uniqueKey;
/**
 * Callback for chart constructors.
 *
 * @callback Highcharts.ChartCallbackFunction
 *
 * @param {Highcharts.Chart} chart
 *        Created chart.
 */
/**
 * Format a number and return a string based on input settings.
 *
 * @callback Highcharts.NumberFormatterCallbackFunction
 *
 * @param {number} number
 *        The input number to format.
 *
 * @param {number} decimals
 *        The amount of decimals. A value of -1 preserves the amount in the
 *        input number.
 *
 * @param {string} [decimalPoint]
 *        The decimal point, defaults to the one given in the lang options, or
 *        a dot.
 *
 * @param {string} [thousandsSep]
 *        The thousands separator, defaults to the one given in the lang
 *        options, or a space character.
 *
 * @return {string} The formatted number.
 */
/**
 * The chart title. The title has an `update` method that allows modifying the
 * options directly or indirectly via `chart.update`.
 *
 * @interface Highcharts.TitleObject
 * @extends Highcharts.SVGElement
 */ /**
* Modify options for the title.
*
* @function Highcharts.TitleObject#update
*
* @param {Highcharts.TitleOptions} titleOptions
*        Options to modify.
*
* @param {boolean} [redraw=true]
*        Whether to redraw the chart after the title is altered. If doing more
*        operations on the chart, it is a good idea to set redraw to false and
*        call {@link Chart#redraw} after.
*/
/**
 * The chart subtitle. The subtitle has an `update` method that
 * allows modifying the options directly or indirectly via
 * `chart.update`.
 *
 * @interface Highcharts.SubtitleObject
 * @extends Highcharts.SVGElement
 */ /**
* Modify options for the subtitle.
*
* @function Highcharts.SubtitleObject#update
*
* @param {Highcharts.SubtitleOptions} subtitleOptions
*        Options to modify.
*
* @param {boolean} [redraw=true]
*        Whether to redraw the chart after the subtitle is altered. If doing
*        more operations on the chart, it is a good idea to set redraw to false
*        and call {@link Chart#redraw} after.
*/
/**
 * The chart caption. The caption has an `update` method that
 * allows modifying the options directly or indirectly via
 * `chart.update`.
 *
 * @interface Highcharts.CaptionObject
 * @extends Highcharts.SVGElement
 */ /**
* Modify options for the caption.
*
* @function Highcharts.CaptionObject#update
*
* @param {Highcharts.CaptionOptions} captionOptions
*        Options to modify.
*
* @param {boolean} [redraw=true]
*        Whether to redraw the chart after the caption is altered. If doing
*        more operations on the chart, it is a good idea to set redraw to false
*        and call {@link Chart#redraw} after.
*/
var marginNames = H.marginNames;
/* eslint-disable no-invalid-this, valid-jsdoc */
/**
 * The Chart class. The recommended constructor is {@link Highcharts#chart}.
 *
 * @example
 * var chart = Highcharts.chart('container', {
 *        title: {
 *               text: 'My chart'
 *        },
 *        series: [{
 *            data: [1, 3, 2, 4]
 *        }]
 * })
 *
 * @class
 * @name Highcharts.Chart
 *
 * @param {string|Highcharts.HTMLDOMElement} [renderTo]
 *        The DOM element to render to, or its id.
 *
 * @param {Highcharts.Options} options
 *        The chart options structure.
 *
 * @param {Highcharts.ChartCallbackFunction} [callback]
 *        Function to run when the chart has loaded and and all external images
 *        are loaded. Defining a
 *        [chart.events.load](https://api.highcharts.com/highcharts/chart.events.load)
 *        handler is equivalent.
 */
var Chart = /** @class */ (function () {
    function Chart(a, b, c) {
        this.axes = void 0;
        this.axisOffset = void 0;
        this.bounds = void 0;
        this.chartHeight = void 0;
        this.chartWidth = void 0;
        this.clipBox = void 0;
        this.colorCounter = void 0;
        this.container = void 0;
        this.index = void 0;
        this.isResizing = void 0;
        this.labelCollectors = void 0;
        this.legend = void 0;
        this.margin = void 0;
        this.numberFormatter = void 0;
        this.options = void 0;
        this.plotBox = void 0;
        this.plotHeight = void 0;
        this.plotLeft = void 0;
        this.plotTop = void 0;
        this.plotWidth = void 0;
        this.pointCount = void 0;
        this.pointer = void 0;
        this.renderer = void 0;
        this.renderTo = void 0;
        this.series = void 0;
        this.spacing = void 0;
        this.spacingBox = void 0;
        this.symbolCounter = void 0;
        this.time = void 0;
        this.titleOffset = void 0;
        this.userOptions = void 0;
        this.xAxis = void 0;
        this.yAxis = void 0;
        this.getArgs(a, b, c);
    }
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Handle the arguments passed to the constructor.
     *
     * @private
     * @function Highcharts.Chart#getArgs
     *
     * @param {...Array<*>} arguments
     * All arguments for the constructor.
     *
     * @fires Highcharts.Chart#event:init
     * @fires Highcharts.Chart#event:afterInit
     */
    Chart.prototype.getArgs = function (a, b, c) {
        // Remove the optional first argument, renderTo, and
        // set it on this.
        if (isString(a) || a.nodeName) {
            this.renderTo = a;
            this.init(b, c);
        }
        else {
            this.init(a, b);
        }
    };
    /**
     * Overridable function that initializes the chart. The constructor's
     * arguments are passed on directly.
     *
     * @function Highcharts.Chart#init
     *
     * @param {Highcharts.Options} userOptions
     *        Custom options.
     *
     * @param {Function} [callback]
     *        Function to run when the chart has loaded and and all external
     *        images are loaded.
     *
     * @return {void}
     *
     * @fires Highcharts.Chart#event:init
     * @fires Highcharts.Chart#event:afterInit
     */
    Chart.prototype.init = function (userOptions, callback) {
        // Handle regular options
        var options, 
        // skip merging data points to increase performance
        seriesOptions = userOptions.series, userPlotOptions = userOptions.plotOptions || {};
        // Fire the event with a default function
        fireEvent(this, 'init', { args: arguments }, function () {
            userOptions.series = null;
            options = merge(defaultOptions, userOptions); // do the merge
            var optionsChart = options.chart || {};
            // Override (by copy of user options) or clear tooltip options
            // in chart.options.plotOptions (#6218)
            objectEach(options.plotOptions, function (typeOptions, type) {
                if (isObject(typeOptions)) { // #8766
                    typeOptions.tooltip = (userPlotOptions[type] && // override by copy:
                        merge(userPlotOptions[type].tooltip)) || void 0; // or clear
                }
            });
            // User options have higher priority than default options
            // (#6218). In case of exporting: path is changed
            options.tooltip.userOptions = (userOptions.chart &&
                userOptions.chart.forExport &&
                userOptions.tooltip.userOptions) || userOptions.tooltip;
            // set back the series data
            options.series = userOptions.series = seriesOptions;
            /**
             * The original options given to the constructor or a chart factory
             * like {@link Highcharts.chart} and {@link Highcharts.stockChart}.
             *
             * @name Highcharts.Chart#userOptions
             * @type {Highcharts.Options}
             */
            this.userOptions = userOptions;
            var chartEvents = optionsChart.events;
            this.margin = [];
            this.spacing = [];
            // Pixel data bounds for touch zoom
            this.bounds = { h: {}, v: {} };
            // An array of functions that returns labels that should be
            // considered for anti-collision
            this.labelCollectors = [];
            this.callback = callback;
            this.isResizing = 0;
            /**
             * The options structure for the chart after merging
             * {@link #defaultOptions} and {@link #userOptions}. It contains
             * members for the sub elements like series, legend, tooltip etc.
             *
             * @name Highcharts.Chart#options
             * @type {Highcharts.Options}
             */
            this.options = options;
            /**
             * All the axes in the chart.
             *
             * @see  Highcharts.Chart.xAxis
             * @see  Highcharts.Chart.yAxis
             *
             * @name Highcharts.Chart#axes
             * @type {Array<Highcharts.Axis>}
             */
            this.axes = [];
            /**
             * All the current series in the chart.
             *
             * @name Highcharts.Chart#series
             * @type {Array<Highcharts.Series>}
             */
            this.series = [];
            /**
             * The `Time` object associated with the chart. Since v6.0.5,
             * time settings can be applied individually for each chart. If
             * no individual settings apply, the `Time` object is shared by
             * all instances.
             *
             * @name Highcharts.Chart#time
             * @type {Highcharts.Time}
             */
            this.time =
                userOptions.time && Object.keys(userOptions.time).length ?
                    new Time(userOptions.time) :
                    H.time;
            /**
             * Callback function to override the default function that formats
             * all the numbers in the chart. Returns a string with the formatted
             * number.
             *
             * @name Highcharts.Chart#numberFormatter
             * @type {Highcharts.NumberFormatterCallbackFunction}
             */
            this.numberFormatter = optionsChart.numberFormatter || numberFormat;
            /**
             * Whether the chart is in styled mode, meaning all presentatinoal
             * attributes are avoided.
             *
             * @name Highcharts.Chart#styledMode
             * @type {boolean}
             */
            this.styledMode = optionsChart.styledMode;
            this.hasCartesianSeries = optionsChart.showAxes;
            var chart = this;
            /**
             * Index position of the chart in the {@link Highcharts#charts}
             * property.
             *
             * @name Highcharts.Chart#index
             * @type {number}
             * @readonly
             */
            chart.index = charts.length; // Add the chart to the global lookup
            charts.push(chart);
            H.chartCount++;
            // Chart event handlers
            if (chartEvents) {
                objectEach(chartEvents, function (event, eventType) {
                    if (isFunction(event)) {
                        addEvent(chart, eventType, event);
                    }
                });
            }
            /**
             * A collection of the X axes in the chart.
             *
             * @name Highcharts.Chart#xAxis
             * @type {Array<Highcharts.Axis>}
             */
            chart.xAxis = [];
            /**
             * A collection of the Y axes in the chart.
             *
             * @name Highcharts.Chart#yAxis
             * @type {Array<Highcharts.Axis>}
             *
             * @todo
             * Make events official: Fire the event `afterInit`.
             */
            chart.yAxis = [];
            chart.pointCount = chart.colorCounter = chart.symbolCounter = 0;
            // Fire after init but before first render, before axes and series
            // have been initialized.
            fireEvent(chart, 'afterInit');
            chart.firstRender();
        });
    };
    /**
     * Internal function to unitialize an individual series.
     *
     * @private
     * @function Highcharts.Chart#initSeries
     */
    Chart.prototype.initSeries = function (options) {
        var chart = this, optionsChart = chart.options.chart, type = (options.type ||
            optionsChart.type ||
            optionsChart.defaultSeriesType), series, Constr = seriesTypes[type];
        // No such series type
        if (!Constr) {
            error(17, true, chart, { missingModuleFor: type });
        }
        series = new Constr();
        series.init(this, options);
        return series;
    };
    /**
     * Internal function to set data for all series with enabled sorting.
     *
     * @private
     * @function Highcharts.Chart#setSeriesData
     */
    Chart.prototype.setSeriesData = function () {
        this.getSeriesOrderByLinks().forEach(function (series) {
            // We need to set data for series with sorting after series init
            if (!series.points && !series.data && series.enabledDataSorting) {
                series.setData(series.options.data, false);
            }
        });
    };
    /**
     * Sort and return chart series in order depending on the number of linked
     * series.
     *
     * @private
     * @function Highcharts.Series#getSeriesOrderByLinks
     * @return {Array<Highcharts.Series>}
     */
    Chart.prototype.getSeriesOrderByLinks = function () {
        return this.series.concat().sort(function (a, b) {
            if (a.linkedSeries.length || b.linkedSeries.length) {
                return b.linkedSeries.length - a.linkedSeries.length;
            }
            return 0;
        });
    };
    /**
     * Order all series above a given index. When series are added and ordered
     * by configuration, only the last series is handled (#248, #1123, #2456,
     * #6112). This function is called on series initialization and destroy.
     *
     * @private
     * @function Highcharts.Series#orderSeries
     * @param {number} [fromIndex]
     * If this is given, only the series above this index are handled.
     */
    Chart.prototype.orderSeries = function (fromIndex) {
        var series = this.series, i = fromIndex || 0;
        for (; i < series.length; i++) {
            if (series[i]) {
                /**
                 * Contains the series' index in the `Chart.series` array.
                 *
                 * @name Highcharts.Series#index
                 * @type {number}
                 * @readonly
                 */
                series[i].index = i;
                series[i].name = series[i].getName();
            }
        }
    };
    /**
     * Check whether a given point is within the plot area.
     *
     * @function Highcharts.Chart#isInsidePlot
     *
     * @param {number} plotX
     * Pixel x relative to the plot area.
     *
     * @param {number} plotY
     * Pixel y relative to the plot area.
     *
     * @param {boolean} [inverted]
     * Whether the chart is inverted.
     *
     * @return {boolean}
     * Returns true if the given point is inside the plot area.
     */
    Chart.prototype.isInsidePlot = function (plotX, plotY, inverted) {
        var x = inverted ? plotY : plotX, y = inverted ? plotX : plotY, e = {
            x: x,
            y: y,
            isInsidePlot: x >= 0 &&
                x <= this.plotWidth &&
                y >= 0 &&
                y <= this.plotHeight
        };
        fireEvent(this, 'afterIsInsidePlot', e);
        return e.isInsidePlot;
    };
    /**
     * Redraw the chart after changes have been done to the data, axis extremes
     * chart size or chart elements. All methods for updating axes, series or
     * points have a parameter for redrawing the chart. This is `true` by
     * default. But in many cases you want to do more than one operation on the
     * chart before redrawing, for example add a number of points. In those
     * cases it is a waste of resources to redraw the chart for each new point
     * added. So you add the points and call `chart.redraw()` after.
     *
     * @function Highcharts.Chart#redraw
     *
     * @param {boolean|Partial<Highcharts.AnimationOptionsObject>} [animation]
     * If or how to apply animation to the redraw.
     *
     * @fires Highcharts.Chart#event:afterSetExtremes
     * @fires Highcharts.Chart#event:beforeRedraw
     * @fires Highcharts.Chart#event:predraw
     * @fires Highcharts.Chart#event:redraw
     * @fires Highcharts.Chart#event:render
     * @fires Highcharts.Chart#event:updatedData
     */
    Chart.prototype.redraw = function (animation) {
        fireEvent(this, 'beforeRedraw');
        var chart = this, axes = chart.axes, series = chart.series, pointer = chart.pointer, legend = chart.legend, legendUserOptions = chart.userOptions.legend, redrawLegend = chart.isDirtyLegend, hasStackedSeries, hasDirtyStacks, hasCartesianSeries = chart.hasCartesianSeries, isDirtyBox = chart.isDirtyBox, i, serie, renderer = chart.renderer, isHiddenChart = renderer.isHidden(), afterRedraw = [];
        // Handle responsive rules, not only on resize (#6130)
        if (chart.setResponsive) {
            chart.setResponsive(false);
        }
        // Set the global animation. When chart.hasRendered is not true, the
        // redraw call comes from a responsive rule and animation should not
        // occur.
        setAnimation(chart.hasRendered ? animation : false, chart);
        if (isHiddenChart) {
            chart.temporaryDisplay();
        }
        // Adjust title layout (reflow multiline text)
        chart.layOutTitles();
        // link stacked series
        i = series.length;
        while (i--) {
            serie = series[i];
            if (serie.options.stacking) {
                hasStackedSeries = true;
                if (serie.isDirty) {
                    hasDirtyStacks = true;
                    break;
                }
            }
        }
        if (hasDirtyStacks) { // mark others as dirty
            i = series.length;
            while (i--) {
                serie = series[i];
                if (serie.options.stacking) {
                    serie.isDirty = true;
                }
            }
        }
        // Handle updated data in the series
        series.forEach(function (serie) {
            if (serie.isDirty) {
                if (serie.options.legendType === 'point') {
                    if (serie.updateTotals) {
                        serie.updateTotals();
                    }
                    redrawLegend = true;
                }
                else if (legendUserOptions &&
                    (legendUserOptions.labelFormatter ||
                        legendUserOptions.labelFormat)) {
                    redrawLegend = true; // #2165
                }
            }
            if (serie.isDirtyData) {
                fireEvent(serie, 'updatedData');
            }
        });
        // handle added or removed series
        if (redrawLegend && legend && legend.options.enabled) {
            // draw legend graphics
            legend.render();
            chart.isDirtyLegend = false;
        }
        // reset stacks
        if (hasStackedSeries) {
            chart.getStacks();
        }
        if (hasCartesianSeries) {
            // set axes scales
            axes.forEach(function (axis) {
                // Don't do setScale again if we're only resizing. Regression
                // #13507. But we need it after chart.update (responsive), as
                // axis is initialized again (#12137).
                if (!chart.isResizing || !isNumber(axis.min)) {
                    axis.updateNames();
                    axis.setScale();
                }
            });
        }
        chart.getMargins(); // #3098
        if (hasCartesianSeries) {
            // If one axis is dirty, all axes must be redrawn (#792, #2169)
            axes.forEach(function (axis) {
                if (axis.isDirty) {
                    isDirtyBox = true;
                }
            });
            // redraw axes
            axes.forEach(function (axis) {
                // Fire 'afterSetExtremes' only if extremes are set
                var key = axis.min + ',' + axis.max;
                if (axis.extKey !== key) { // #821, #4452
                    axis.extKey = key;
                    // prevent a recursive call to chart.redraw() (#1119)
                    afterRedraw.push(function () {
                        fireEvent(axis, 'afterSetExtremes', extend(axis.eventArgs, axis.getExtremes())); // #747, #751
                        delete axis.eventArgs;
                    });
                }
                if (isDirtyBox || hasStackedSeries) {
                    axis.redraw();
                }
            });
        }
        // the plot areas size has changed
        if (isDirtyBox) {
            chart.drawChartBox();
        }
        // Fire an event before redrawing series, used by the boost module to
        // clear previous series renderings.
        fireEvent(chart, 'predraw');
        // redraw affected series
        series.forEach(function (serie) {
            if ((isDirtyBox || serie.isDirty) && serie.visible) {
                serie.redraw();
            }
            // Set it here, otherwise we will have unlimited 'updatedData' calls
            // for a hidden series after setData(). Fixes #6012
            serie.isDirtyData = false;
        });
        // move tooltip or reset
        if (pointer) {
            pointer.reset(true);
        }
        // redraw if canvas
        renderer.draw();
        // Fire the events
        fireEvent(chart, 'redraw');
        fireEvent(chart, 'render');
        if (isHiddenChart) {
            chart.temporaryDisplay(true);
        }
        // Fire callbacks that are put on hold until after the redraw
        afterRedraw.forEach(function (callback) {
            callback.call();
        });
    };
    /**
     * Get an axis, series or point object by `id` as given in the configuration
     * options. Returns `undefined` if no item is found.
     *
     * @sample highcharts/plotoptions/series-id/
     *         Get series by id
     *
     * @function Highcharts.Chart#get
     *
     * @param {string} id
     * The id as given in the configuration options.
     *
     * @return {Highcharts.Axis|Highcharts.Series|Highcharts.Point|undefined}
     * The retrieved item.
     */
    Chart.prototype.get = function (id) {
        var ret, series = this.series, i;
        /**
         * @private
         * @param {Highcharts.Axis|Highcharts.Series} item
         * @return {boolean}
         */
        function itemById(item) {
            return (item.id === id ||
                (item.options && item.options.id === id));
        }
        ret =
            // Search axes
            find(this.axes, itemById) ||
                // Search series
                find(this.series, itemById);
        // Search points
        for (i = 0; !ret && i < series.length; i++) {
            ret = find(series[i].points || [], itemById);
        }
        return ret;
    };
    /**
     * Create the Axis instances based on the config options.
     *
     * @private
     * @function Highcharts.Chart#getAxes
     * @fires Highcharts.Chart#event:afterGetAxes
     * @fires Highcharts.Chart#event:getAxes
     */
    Chart.prototype.getAxes = function () {
        var chart = this, options = this.options, xAxisOptions = options.xAxis = splat(options.xAxis || {}), yAxisOptions = options.yAxis = splat(options.yAxis || {}), optionsArray;
        fireEvent(this, 'getAxes');
        // make sure the options are arrays and add some members
        xAxisOptions.forEach(function (axis, i) {
            axis.index = i;
            axis.isX = true;
        });
        yAxisOptions.forEach(function (axis, i) {
            axis.index = i;
        });
        // concatenate all axis options into one array
        optionsArray = xAxisOptions.concat(yAxisOptions);
        optionsArray.forEach(function (axisOptions) {
            new Axis(chart, axisOptions); // eslint-disable-line no-new
        });
        fireEvent(this, 'afterGetAxes');
    };
    /**
     * Returns an array of all currently selected points in the chart. Points
     * can be selected by clicking or programmatically by the
     * {@link Highcharts.Point#select}
     * function.
     *
     * @sample highcharts/plotoptions/series-allowpointselect-line/
     *         Get selected points
     *
     * @function Highcharts.Chart#getSelectedPoints
     *
     * @return {Array<Highcharts.Point>}
     *         The currently selected points.
     */
    Chart.prototype.getSelectedPoints = function () {
        var points = [];
        this.series.forEach(function (serie) {
            // For one-to-one points inspect series.data in order to retrieve
            // points outside the visible range (#6445). For grouped data,
            // inspect the generated series.points.
            points = points.concat(serie.getPointsCollection().filter(function (point) {
                return pick(point.selectedStaging, point.selected);
            }));
        });
        return points;
    };
    /**
     * Returns an array of all currently selected series in the chart. Series
     * can be selected either programmatically by the
     * {@link Highcharts.Series#select}
     * function or by checking the checkbox next to the legend item if
     * [series.showCheckBox](https://api.highcharts.com/highcharts/plotOptions.series.showCheckbox)
     * is true.
     *
     * @sample highcharts/members/chart-getselectedseries/
     *         Get selected series
     *
     * @function Highcharts.Chart#getSelectedSeries
     *
     * @return {Array<Highcharts.Series>}
     *         The currently selected series.
     */
    Chart.prototype.getSelectedSeries = function () {
        return this.series.filter(function (serie) {
            return serie.selected;
        });
    };
    /**
     * Set a new title or subtitle for the chart.
     *
     * @sample highcharts/members/chart-settitle/
     *         Set title text and styles
     *
     * @function Highcharts.Chart#setTitle
     *
     * @param {Highcharts.TitleOptions} [titleOptions]
     *        New title options. The title text itself is set by the
     *        `titleOptions.text` property.
     *
     * @param {Highcharts.SubtitleOptions} [subtitleOptions]
     *        New subtitle options. The subtitle text itself is set by the
     *        `subtitleOptions.text` property.
     *
     * @param {boolean} [redraw]
     *        Whether to redraw the chart or wait for a later call to
     *        `chart.redraw()`.
     */
    Chart.prototype.setTitle = function (titleOptions, subtitleOptions, redraw) {
        this.applyDescription('title', titleOptions);
        this.applyDescription('subtitle', subtitleOptions);
        // The initial call also adds the caption. On update, chart.update will
        // relay to Chart.setCaption.
        this.applyDescription('caption', void 0);
        this.layOutTitles(redraw);
    };
    /**
     * Apply a title, subtitle or caption for the chart
     *
     * @private
     * @function Highcharts.Chart#applyDescription
     * @param name {string}
     * Either title, subtitle or caption
     * @param {Highcharts.TitleOptions|Highcharts.SubtitleOptions|Highcharts.CaptionOptions|undefined} explicitOptions
     * The options to set, will be merged with default options.
     */
    Chart.prototype.applyDescription = function (name, explicitOptions) {
        var chart = this;
        // Default style
        var style = name === 'title' ? {
            color: '${palette.neutralColor80}',
            fontSize: this.options.isStock ? '16px' : '18px' // #2944
        } : {
            color: '${palette.neutralColor60}'
        };
        // Merge default options with explicit options
        var options = this.options[name] = merge(
        // Default styles
        (!this.styledMode && { style: style }), this.options[name], explicitOptions);
        var elem = this[name];
        if (elem && explicitOptions) {
            this[name] = elem = elem.destroy(); // remove old
        }
        if (options && !elem) {
            elem = this.renderer.text(options.text, 0, 0, options.useHTML)
                .attr({
                align: options.align,
                'class': 'highcharts-' + name,
                zIndex: options.zIndex || 4
            })
                .add();
            // Update methods, shortcut to Chart.setTitle, Chart.setSubtitle and
            // Chart.setCaption
            elem.update = function (updateOptions) {
                var fn = {
                    title: 'setTitle',
                    subtitle: 'setSubtitle',
                    caption: 'setCaption'
                }[name];
                chart[fn](updateOptions);
            };
            // Presentational
            if (!this.styledMode) {
                elem.css(options.style);
            }
            /**
             * The chart title. The title has an `update` method that allows
             * modifying the options directly or indirectly via
             * `chart.update`.
             *
             * @sample highcharts/members/title-update/
             *         Updating titles
             *
             * @name Highcharts.Chart#title
             * @type {Highcharts.TitleObject}
             */
            /**
             * The chart subtitle. The subtitle has an `update` method that
             * allows modifying the options directly or indirectly via
             * `chart.update`.
             *
             * @name Highcharts.Chart#subtitle
             * @type {Highcharts.SubtitleObject}
             */
            this[name] = elem;
        }
    };
    /**
     * Internal function to lay out the chart title, subtitle and caption, and
     * cache the full offset height for use in `getMargins`. The result is
     * stored in `this.titleOffset`.
     *
     * @private
     * @function Highcharts.Chart#layOutTitles
     *
     * @param {boolean} [redraw=true]
     * @fires Highcharts.Chart#event:afterLayOutTitles
     */
    Chart.prototype.layOutTitles = function (redraw) {
        var titleOffset = [0, 0, 0], requiresDirtyBox, renderer = this.renderer, spacingBox = this.spacingBox;
        // Lay out the title and the subtitle respectively
        ['title', 'subtitle', 'caption'].forEach(function (key) {
            var title = this[key], titleOptions = this.options[key], verticalAlign = titleOptions.verticalAlign || 'top', offset = key === 'title' ? -3 :
                // Floating subtitle (#6574)
                verticalAlign === 'top' ? titleOffset[0] + 2 : 0, titleSize, height;
            if (title) {
                if (!this.styledMode) {
                    titleSize = titleOptions.style.fontSize;
                }
                titleSize = renderer.fontMetrics(titleSize, title).b;
                title
                    .css({
                    width: (titleOptions.width ||
                        spacingBox.width + (titleOptions.widthAdjust || 0)) + 'px'
                });
                // Skip the cache for HTML (#3481, #11666)
                height = Math.round(title.getBBox(titleOptions.useHTML).height);
                title.align(extend({
                    y: verticalAlign === 'bottom' ?
                        titleSize :
                        offset + titleSize,
                    height: height
                }, titleOptions), false, 'spacingBox');
                if (!titleOptions.floating) {
                    if (verticalAlign === 'top') {
                        titleOffset[0] = Math.ceil(titleOffset[0] +
                            height);
                    }
                    else if (verticalAlign === 'bottom') {
                        titleOffset[2] = Math.ceil(titleOffset[2] +
                            height);
                    }
                }
            }
        }, this);
        // Handle title.margin and caption.margin
        if (titleOffset[0] &&
            (this.options.title.verticalAlign || 'top') === 'top') {
            titleOffset[0] += this.options.title.margin;
        }
        if (titleOffset[2] &&
            this.options.caption.verticalAlign === 'bottom') {
            titleOffset[2] += this.options.caption.margin;
        }
        requiresDirtyBox = (!this.titleOffset ||
            this.titleOffset.join(',') !== titleOffset.join(','));
        // Used in getMargins
        this.titleOffset = titleOffset;
        fireEvent(this, 'afterLayOutTitles');
        if (!this.isDirtyBox && requiresDirtyBox) {
            this.isDirtyBox = this.isDirtyLegend = requiresDirtyBox;
            // Redraw if necessary (#2719, #2744)
            if (this.hasRendered && pick(redraw, true) && this.isDirtyBox) {
                this.redraw();
            }
        }
    };
    /**
     * Internal function to get the chart width and height according to options
     * and container size. Sets {@link Chart.chartWidth} and
     * {@link Chart.chartHeight}.
     *
     * @private
     * @function Highcharts.Chart#getChartSize
     */
    Chart.prototype.getChartSize = function () {
        var chart = this, optionsChart = chart.options.chart, widthOption = optionsChart.width, heightOption = optionsChart.height, renderTo = chart.renderTo;
        // Get inner width and height
        if (!defined(widthOption)) {
            chart.containerWidth = getStyle(renderTo, 'width');
        }
        if (!defined(heightOption)) {
            chart.containerHeight = getStyle(renderTo, 'height');
        }
        /**
         * The current pixel width of the chart.
         *
         * @name Highcharts.Chart#chartWidth
         * @type {number}
         */
        chart.chartWidth = Math.max(// #1393
        0, widthOption || chart.containerWidth || 600 // #1460
        );
        /**
         * The current pixel height of the chart.
         *
         * @name Highcharts.Chart#chartHeight
         * @type {number}
         */
        chart.chartHeight = Math.max(0, relativeLength(heightOption, chart.chartWidth) ||
            (chart.containerHeight > 1 ?
                chart.containerHeight :
                400));
    };
    /**
     * If the renderTo element has no offsetWidth, most likely one or more of
     * its parents are hidden. Loop up the DOM tree to temporarily display the
     * parents, then save the original display properties, and when the true
     * size is retrieved, reset them. Used on first render and on redraws.
     *
     * @private
     * @function Highcharts.Chart#temporaryDisplay
     *
     * @param {boolean} [revert]
     * Revert to the saved original styles.
     */
    Chart.prototype.temporaryDisplay = function (revert) {
        var node = this.renderTo, tempStyle;
        if (!revert) {
            while (node && node.style) {
                // When rendering to a detached node, it needs to be temporarily
                // attached in order to read styling and bounding boxes (#5783,
                // #7024).
                if (!doc.body.contains(node) && !node.parentNode) {
                    node.hcOrigDetached = true;
                    doc.body.appendChild(node);
                }
                if (getStyle(node, 'display', false) === 'none' ||
                    node.hcOricDetached) {
                    node.hcOrigStyle = {
                        display: node.style.display,
                        height: node.style.height,
                        overflow: node.style.overflow
                    };
                    tempStyle = {
                        display: 'block',
                        overflow: 'hidden'
                    };
                    if (node !== this.renderTo) {
                        tempStyle.height = 0;
                    }
                    css(node, tempStyle);
                    // If it still doesn't have an offset width after setting
                    // display to block, it probably has an !important priority
                    // #2631, 6803
                    if (!node.offsetWidth) {
                        node.style.setProperty('display', 'block', 'important');
                    }
                }
                node = node.parentNode;
                if (node === doc.body) {
                    break;
                }
            }
        }
        else {
            while (node && node.style) {
                if (node.hcOrigStyle) {
                    css(node, node.hcOrigStyle);
                    delete node.hcOrigStyle;
                }
                if (node.hcOrigDetached) {
                    doc.body.removeChild(node);
                    node.hcOrigDetached = false;
                }
                node = node.parentNode;
            }
        }
    };
    /**
     * Set the {@link Chart.container|chart container's} class name, in
     * addition to `highcharts-container`.
     *
     * @function Highcharts.Chart#setClassName
     *
     * @param {string} [className]
     * The additional class name.
     */
    Chart.prototype.setClassName = function (className) {
        this.container.className = 'highcharts-container ' + (className || '');
    };
    /**
     * Get the containing element, determine the size and create the inner
     * container div to hold the chart.
     *
     * @private
     * @function Highcharts.Chart#afterGetContainer
     * @fires Highcharts.Chart#event:afterGetContainer
     */
    Chart.prototype.getContainer = function () {
        var chart = this, container, options = chart.options, optionsChart = options.chart, chartWidth, chartHeight, renderTo = chart.renderTo, indexAttrName = 'data-highcharts-chart', oldChartIndex, Ren, containerId = uniqueKey(), containerStyle, key;
        if (!renderTo) {
            chart.renderTo = renderTo =
                optionsChart.renderTo;
        }
        if (isString(renderTo)) {
            chart.renderTo = renderTo =
                doc.getElementById(renderTo);
        }
        // Display an error if the renderTo is wrong
        if (!renderTo) {
            error(13, true, chart);
        }
        // If the container already holds a chart, destroy it. The check for
        // hasRendered is there because web pages that are saved to disk from
        // the browser, will preserve the data-highcharts-chart attribute and
        // the SVG contents, but not an interactive chart. So in this case,
        // charts[oldChartIndex] will point to the wrong chart if any (#2609).
        oldChartIndex = pInt(attr(renderTo, indexAttrName));
        if (isNumber(oldChartIndex) &&
            charts[oldChartIndex] &&
            charts[oldChartIndex].hasRendered) {
            charts[oldChartIndex].destroy();
        }
        // Make a reference to the chart from the div
        attr(renderTo, indexAttrName, chart.index);
        // remove previous chart
        renderTo.innerHTML = '';
        // If the container doesn't have an offsetWidth, it has or is a child of
        // a node that has display:none. We need to temporarily move it out to a
        // visible state to determine the size, else the legend and tooltips
        // won't render properly. The skipClone option is used in sparklines as
        // a micro optimization, saving about 1-2 ms each chart.
        if (!optionsChart.skipClone && !renderTo.offsetWidth) {
            chart.temporaryDisplay();
        }
        // get the width and height
        chart.getChartSize();
        chartWidth = chart.chartWidth;
        chartHeight = chart.chartHeight;
        // Allow table cells and flex-boxes to shrink without the chart blocking
        // them out (#6427)
        css(renderTo, { overflow: 'hidden' });
        // Create the inner container
        if (!chart.styledMode) {
            containerStyle = extend({
                position: 'relative',
                // needed for context menu (avoidscrollbars) and content
                // overflow in IE
                overflow: 'hidden',
                width: chartWidth + 'px',
                height: chartHeight + 'px',
                textAlign: 'left',
                lineHeight: 'normal',
                zIndex: 0,
                '-webkit-tap-highlight-color': 'rgba(0,0,0,0)',
                userSelect: 'none' // #13503
            }, optionsChart.style);
        }
        /**
         * The containing HTML element of the chart. The container is
         * dynamically inserted into the element given as the `renderTo`
         * parameter in the {@link Highcharts#chart} constructor.
         *
         * @name Highcharts.Chart#container
         * @type {Highcharts.HTMLDOMElement}
         */
        container = createElement('div', {
            id: containerId
        }, containerStyle, renderTo);
        chart.container = container;
        // cache the cursor (#1650)
        chart._cursor = container.style.cursor;
        // Initialize the renderer
        Ren = H[optionsChart.renderer] || H.Renderer;
        /**
         * The renderer instance of the chart. Each chart instance has only one
         * associated renderer.
         *
         * @name Highcharts.Chart#renderer
         * @type {Highcharts.SVGRenderer}
         */
        chart.renderer = new Ren(container, chartWidth, chartHeight, null, optionsChart.forExport, options.exporting && options.exporting.allowHTML, chart.styledMode);
        // Set the initial animation from the options
        setAnimation(void 0, chart);
        chart.setClassName(optionsChart.className);
        if (!chart.styledMode) {
            chart.renderer.setStyle(optionsChart.style);
        }
        else {
            // Initialize definitions
            for (key in options.defs) { // eslint-disable-line guard-for-in
                this.renderer.definition(options.defs[key]);
            }
        }
        // Add a reference to the charts index
        chart.renderer.chartIndex = chart.index;
        fireEvent(this, 'afterGetContainer');
    };
    /**
     * Calculate margins by rendering axis labels in a preliminary position.
     * Title, subtitle and legend have already been rendered at this stage, but
     * will be moved into their final positions.
     *
     * @private
     * @function Highcharts.Chart#getMargins
     * @fires Highcharts.Chart#event:getMargins
     */
    Chart.prototype.getMargins = function (skipAxes) {
        var _a = this, spacing = _a.spacing, margin = _a.margin, titleOffset = _a.titleOffset;
        this.resetMargins();
        // Adjust for title and subtitle
        if (titleOffset[0] && !defined(margin[0])) {
            this.plotTop = Math.max(this.plotTop, titleOffset[0] + spacing[0]);
        }
        if (titleOffset[2] && !defined(margin[2])) {
            this.marginBottom = Math.max(this.marginBottom, titleOffset[2] + spacing[2]);
        }
        // Adjust for legend
        if (this.legend && this.legend.display) {
            this.legend.adjustMargins(margin, spacing);
        }
        fireEvent(this, 'getMargins');
        if (!skipAxes) {
            this.getAxisMargins();
        }
    };
    /**
     * @private
     * @function Highcharts.Chart#getAxisMargins
     */
    Chart.prototype.getAxisMargins = function () {
        var chart = this, 
        // [top, right, bottom, left]
        axisOffset = chart.axisOffset = [0, 0, 0, 0], colorAxis = chart.colorAxis, margin = chart.margin, getOffset = function (axes) {
            axes.forEach(function (axis) {
                if (axis.visible) {
                    axis.getOffset();
                }
            });
        };
        // pre-render axes to get labels offset width
        if (chart.hasCartesianSeries) {
            getOffset(chart.axes);
        }
        else if (colorAxis && colorAxis.length) {
            getOffset(colorAxis);
        }
        // Add the axis offsets
        marginNames.forEach(function (m, side) {
            if (!defined(margin[side])) {
                chart[m] += axisOffset[side];
            }
        });
        chart.setChartSize();
    };
    /**
     * Reflows the chart to its container. By default, the chart reflows
     * automatically to its container following a `window.resize` event, as per
     * the [chart.reflow](https://api.highcharts.com/highcharts/chart.reflow)
     * option. However, there are no reliable events for div resize, so if the
     * container is resized without a window resize event, this must be called
     * explicitly.
     *
     * @sample highcharts/members/chart-reflow/
     *         Resize div and reflow
     * @sample highcharts/chart/events-container/
     *         Pop up and reflow
     *
     * @function Highcharts.Chart#reflow
     *
     * @param {global.Event} [e]
     *        Event arguments. Used primarily when the function is called
     *        internally as a response to window resize.
     */
    Chart.prototype.reflow = function (e) {
        var chart = this, optionsChart = chart.options.chart, renderTo = chart.renderTo, hasUserSize = (defined(optionsChart.width) &&
            defined(optionsChart.height)), width = optionsChart.width || getStyle(renderTo, 'width'), height = optionsChart.height || getStyle(renderTo, 'height'), target = e ? e.target : win;
        // Width and height checks for display:none. Target is doc in IE8 and
        // Opera, win in Firefox, Chrome and IE9.
        if (!hasUserSize &&
            !chart.isPrinting &&
            width &&
            height &&
            (target === win || target === doc)) {
            if (width !== chart.containerWidth ||
                height !== chart.containerHeight) {
                U.clearTimeout(chart.reflowTimeout);
                // When called from window.resize, e is set, else it's called
                // directly (#2224)
                chart.reflowTimeout = syncTimeout(function () {
                    // Set size, it may have been destroyed in the meantime
                    // (#1257)
                    if (chart.container) {
                        chart.setSize(void 0, void 0, false);
                    }
                }, e ? 100 : 0);
            }
            chart.containerWidth = width;
            chart.containerHeight = height;
        }
    };
    /**
     * Toggle the event handlers necessary for auto resizing, depending on the
     * `chart.reflow` option.
     *
     * @private
     * @function Highcharts.Chart#setReflow
     */
    Chart.prototype.setReflow = function (reflow) {
        var chart = this;
        if (reflow !== false && !this.unbindReflow) {
            this.unbindReflow = addEvent(win, 'resize', function (e) {
                // a removed event listener still runs in Edge and IE if the
                // listener was removed while the event runs, so check if the
                // chart is not destroyed (#11609)
                if (chart.options) {
                    chart.reflow(e);
                }
            });
            addEvent(this, 'destroy', this.unbindReflow);
        }
        else if (reflow === false && this.unbindReflow) {
            // Unbind and unset
            this.unbindReflow = this.unbindReflow();
        }
        // The following will add listeners to re-fit the chart before and after
        // printing (#2284). However it only works in WebKit. Should have worked
        // in Firefox, but not supported in IE.
        /*
        if (win.matchMedia) {
            win.matchMedia('print').addListener(function reflow() {
                chart.reflow();
            });
        }
        //*/
    };
    /**
     * Resize the chart to a given width and height. In order to set the width
     * only, the height argument may be skipped. To set the height only, pass
     * `undefined` for the width.
     *
     * @sample highcharts/members/chart-setsize-button/
     *         Test resizing from buttons
     * @sample highcharts/members/chart-setsize-jquery-resizable/
     *         Add a jQuery UI resizable
     * @sample stock/members/chart-setsize/
     *         Highstock with UI resizable
     *
     * @function Highcharts.Chart#setSize
     *
     * @param {number|null} [width]
     *        The new pixel width of the chart. Since v4.2.6, the argument can
     *        be `undefined` in order to preserve the current value (when
     *        setting height only), or `null` to adapt to the width of the
     *        containing element.
     *
     * @param {number|null} [height]
     *        The new pixel height of the chart. Since v4.2.6, the argument can
     *        be `undefined` in order to preserve the current value, or `null`
     *        in order to adapt to the height of the containing element.
     *
     * @param {boolean|Partial<Highcharts.AnimationOptionsObject>} [animation=true]
     *        Whether and how to apply animation.
     *
     * @return {void}
     *
     * @fires Highcharts.Chart#event:endResize
     * @fires Highcharts.Chart#event:resize
     */
    Chart.prototype.setSize = function (width, height, animation) {
        var chart = this, renderer = chart.renderer, globalAnimation;
        // Handle the isResizing counter
        chart.isResizing += 1;
        // set the animation for the current process
        setAnimation(animation, chart);
        globalAnimation = renderer.globalAnimation;
        chart.oldChartHeight = chart.chartHeight;
        chart.oldChartWidth = chart.chartWidth;
        if (typeof width !== 'undefined') {
            chart.options.chart.width = width;
        }
        if (typeof height !== 'undefined') {
            chart.options.chart.height = height;
        }
        chart.getChartSize();
        // Resize the container with the global animation applied if enabled
        // (#2503)
        if (!chart.styledMode) {
            (globalAnimation ? animate : css)(chart.container, {
                width: chart.chartWidth + 'px',
                height: chart.chartHeight + 'px'
            }, globalAnimation);
        }
        chart.setChartSize(true);
        renderer.setSize(chart.chartWidth, chart.chartHeight, globalAnimation);
        // handle axes
        chart.axes.forEach(function (axis) {
            axis.isDirty = true;
            axis.setScale();
        });
        chart.isDirtyLegend = true; // force legend redraw
        chart.isDirtyBox = true; // force redraw of plot and chart border
        chart.layOutTitles(); // #2857
        chart.getMargins();
        chart.redraw(globalAnimation);
        chart.oldChartHeight = null;
        fireEvent(chart, 'resize');
        // Fire endResize and set isResizing back. If animation is disabled,
        // fire without delay
        syncTimeout(function () {
            if (chart) {
                fireEvent(chart, 'endResize', null, function () {
                    chart.isResizing -= 1;
                });
            }
        }, animObject(globalAnimation).duration);
    };
    /**
     * Set the public chart properties. This is done before and after the
     * pre-render to determine margin sizes.
     *
     * @private
     * @function Highcharts.Chart#setChartSize
     * @fires Highcharts.Chart#event:afterSetChartSize
     */
    Chart.prototype.setChartSize = function (skipAxes) {
        var chart = this, inverted = chart.inverted, renderer = chart.renderer, chartWidth = chart.chartWidth, chartHeight = chart.chartHeight, optionsChart = chart.options.chart, spacing = chart.spacing, clipOffset = chart.clipOffset, clipX, clipY, plotLeft, plotTop, plotWidth, plotHeight, plotBorderWidth;
        /**
         * The current left position of the plot area in pixels.
         *
         * @name Highcharts.Chart#plotLeft
         * @type {number}
         */
        chart.plotLeft = plotLeft = Math.round(chart.plotLeft);
        /**
         * The current top position of the plot area in pixels.
         *
         * @name Highcharts.Chart#plotTop
         * @type {number}
         */
        chart.plotTop = plotTop = Math.round(chart.plotTop);
        /**
         * The current width of the plot area in pixels.
         *
         * @name Highcharts.Chart#plotWidth
         * @type {number}
         */
        chart.plotWidth = plotWidth = Math.max(0, Math.round(chartWidth - plotLeft - chart.marginRight));
        /**
         * The current height of the plot area in pixels.
         *
         * @name Highcharts.Chart#plotHeight
         * @type {number}
         */
        chart.plotHeight = plotHeight = Math.max(0, Math.round(chartHeight - plotTop - chart.marginBottom));
        chart.plotSizeX = inverted ? plotHeight : plotWidth;
        chart.plotSizeY = inverted ? plotWidth : plotHeight;
        chart.plotBorderWidth = optionsChart.plotBorderWidth || 0;
        // Set boxes used for alignment
        chart.spacingBox = renderer.spacingBox = {
            x: spacing[3],
            y: spacing[0],
            width: chartWidth - spacing[3] - spacing[1],
            height: chartHeight - spacing[0] - spacing[2]
        };
        chart.plotBox = renderer.plotBox = {
            x: plotLeft,
            y: plotTop,
            width: plotWidth,
            height: plotHeight
        };
        plotBorderWidth = 2 * Math.floor(chart.plotBorderWidth / 2);
        clipX = Math.ceil(Math.max(plotBorderWidth, clipOffset[3]) / 2);
        clipY = Math.ceil(Math.max(plotBorderWidth, clipOffset[0]) / 2);
        chart.clipBox = {
            x: clipX,
            y: clipY,
            width: Math.floor(chart.plotSizeX -
                Math.max(plotBorderWidth, clipOffset[1]) / 2 -
                clipX),
            height: Math.max(0, Math.floor(chart.plotSizeY -
                Math.max(plotBorderWidth, clipOffset[2]) / 2 -
                clipY))
        };
        if (!skipAxes) {
            chart.axes.forEach(function (axis) {
                axis.setAxisSize();
                axis.setAxisTranslation();
            });
        }
        fireEvent(chart, 'afterSetChartSize', { skipAxes: skipAxes });
    };
    /**
     * Initial margins before auto size margins are applied.
     *
     * @private
     * @function Highcharts.Chart#resetMargins
     */
    Chart.prototype.resetMargins = function () {
        fireEvent(this, 'resetMargins');
        var chart = this, chartOptions = chart.options.chart;
        // Create margin and spacing array
        ['margin', 'spacing'].forEach(function splashArrays(target) {
            var value = chartOptions[target], values = isObject(value) ? value : [value, value, value, value];
            [
                'Top',
                'Right',
                'Bottom',
                'Left'
            ].forEach(function (sideName, side) {
                chart[target][side] = pick(chartOptions[target + sideName], values[side]);
            });
        });
        // Set margin names like chart.plotTop, chart.plotLeft,
        // chart.marginRight, chart.marginBottom.
        marginNames.forEach(function (m, side) {
            chart[m] = pick(chart.margin[side], chart.spacing[side]);
        });
        chart.axisOffset = [0, 0, 0, 0]; // top, right, bottom, left
        chart.clipOffset = [0, 0, 0, 0];
    };
    /**
     * Internal function to draw or redraw the borders and backgrounds for chart
     * and plot area.
     *
     * @private
     * @function Highcharts.Chart#drawChartBox
     * @fires Highcharts.Chart#event:afterDrawChartBox
     */
    Chart.prototype.drawChartBox = function () {
        var chart = this, optionsChart = chart.options.chart, renderer = chart.renderer, chartWidth = chart.chartWidth, chartHeight = chart.chartHeight, chartBackground = chart.chartBackground, plotBackground = chart.plotBackground, plotBorder = chart.plotBorder, chartBorderWidth, styledMode = chart.styledMode, plotBGImage = chart.plotBGImage, chartBackgroundColor = optionsChart.backgroundColor, plotBackgroundColor = optionsChart.plotBackgroundColor, plotBackgroundImage = optionsChart.plotBackgroundImage, mgn, bgAttr, plotLeft = chart.plotLeft, plotTop = chart.plotTop, plotWidth = chart.plotWidth, plotHeight = chart.plotHeight, plotBox = chart.plotBox, clipRect = chart.clipRect, clipBox = chart.clipBox, verb = 'animate';
        // Chart area
        if (!chartBackground) {
            chart.chartBackground = chartBackground = renderer.rect()
                .addClass('highcharts-background')
                .add();
            verb = 'attr';
        }
        if (!styledMode) {
            // Presentational
            chartBorderWidth = optionsChart.borderWidth || 0;
            mgn = chartBorderWidth + (optionsChart.shadow ? 8 : 0);
            bgAttr = {
                fill: chartBackgroundColor || 'none'
            };
            if (chartBorderWidth || chartBackground['stroke-width']) { // #980
                bgAttr.stroke = optionsChart.borderColor;
                bgAttr['stroke-width'] = chartBorderWidth;
            }
            chartBackground
                .attr(bgAttr)
                .shadow(optionsChart.shadow);
        }
        else {
            chartBorderWidth = mgn = chartBackground.strokeWidth();
        }
        chartBackground[verb]({
            x: mgn / 2,
            y: mgn / 2,
            width: chartWidth - mgn - chartBorderWidth % 2,
            height: chartHeight - mgn - chartBorderWidth % 2,
            r: optionsChart.borderRadius
        });
        // Plot background
        verb = 'animate';
        if (!plotBackground) {
            verb = 'attr';
            chart.plotBackground = plotBackground = renderer.rect()
                .addClass('highcharts-plot-background')
                .add();
        }
        plotBackground[verb](plotBox);
        if (!styledMode) {
            // Presentational attributes for the background
            plotBackground
                .attr({
                fill: plotBackgroundColor || 'none'
            })
                .shadow(optionsChart.plotShadow);
            // Create the background image
            if (plotBackgroundImage) {
                if (!plotBGImage) {
                    chart.plotBGImage = renderer.image(plotBackgroundImage, plotLeft, plotTop, plotWidth, plotHeight).add();
                }
                else {
                    if (plotBackgroundImage !== plotBGImage.attr('href')) {
                        plotBGImage.attr('href', plotBackgroundImage);
                    }
                    plotBGImage.animate(plotBox);
                }
            }
        }
        // Plot clip
        if (!clipRect) {
            chart.clipRect = renderer.clipRect(clipBox);
        }
        else {
            clipRect.animate({
                width: clipBox.width,
                height: clipBox.height
            });
        }
        // Plot area border
        verb = 'animate';
        if (!plotBorder) {
            verb = 'attr';
            chart.plotBorder = plotBorder = renderer.rect()
                .addClass('highcharts-plot-border')
                .attr({
                zIndex: 1 // Above the grid
            })
                .add();
        }
        if (!styledMode) {
            // Presentational
            plotBorder.attr({
                stroke: optionsChart.plotBorderColor,
                'stroke-width': optionsChart.plotBorderWidth || 0,
                fill: 'none'
            });
        }
        plotBorder[verb](plotBorder.crisp({
            x: plotLeft,
            y: plotTop,
            width: plotWidth,
            height: plotHeight
        }, -plotBorder.strokeWidth())); // #3282 plotBorder should be negative;
        // reset
        chart.isDirtyBox = false;
        fireEvent(this, 'afterDrawChartBox');
    };
    /**
     * Detect whether a certain chart property is needed based on inspecting its
     * options and series. This mainly applies to the chart.inverted property,
     * and in extensions to the chart.angular and chart.polar properties.
     *
     * @private
     * @function Highcharts.Chart#propFromSeries
     * @return {void}
     */
    Chart.prototype.propFromSeries = function () {
        var chart = this, optionsChart = chart.options.chart, klass, seriesOptions = chart.options.series, i, value;
        /**
         * The flag is set to `true` if a series of the chart is inverted.
         *
         * @name Highcharts.Chart#inverted
         * @type {boolean|undefined}
         */
        ['inverted', 'angular', 'polar'].forEach(function (key) {
            // The default series type's class
            klass = seriesTypes[(optionsChart.type ||
                optionsChart.defaultSeriesType)];
            // Get the value from available chart-wide properties
            value =
                // It is set in the options:
                optionsChart[key] ||
                    // The default series class:
                    (klass && klass.prototype[key]);
            // requires it
            // 4. Check if any the chart's series require it
            i = seriesOptions && seriesOptions.length;
            while (!value && i--) {
                klass = seriesTypes[seriesOptions[i].type];
                if (klass && klass.prototype[key]) {
                    value = true;
                }
            }
            // Set the chart property
            chart[key] = value;
        });
    };
    /**
     * Internal function to link two or more series together, based on the
     * `linkedTo` option. This is done from `Chart.render`, and after
     * `Chart.addSeries` and `Series.remove`.
     *
     * @private
     * @function Highcharts.Chart#linkSeries
     * @fires Highcharts.Chart#event:afterLinkSeries
     */
    Chart.prototype.linkSeries = function () {
        var chart = this, chartSeries = chart.series;
        // Reset links
        chartSeries.forEach(function (series) {
            series.linkedSeries.length = 0;
        });
        // Apply new links
        chartSeries.forEach(function (series) {
            var linkedTo = series.options.linkedTo;
            if (isString(linkedTo)) {
                if (linkedTo === ':previous') {
                    linkedTo = chart.series[series.index - 1];
                }
                else {
                    linkedTo = chart.get(linkedTo);
                }
                // #3341 avoid mutual linking
                if (linkedTo && linkedTo.linkedParent !== series) {
                    linkedTo.linkedSeries.push(series);
                    series.linkedParent = linkedTo;
                    if (linkedTo.enabledDataSorting) {
                        series.setDataSortingOptions();
                    }
                    series.visible = pick(series.options.visible, linkedTo.options.visible, series.visible); // #3879
                }
            }
        });
        fireEvent(this, 'afterLinkSeries');
    };
    /**
     * Render series for the chart.
     *
     * @private
     * @function Highcharts.Chart#renderSeries
     */
    Chart.prototype.renderSeries = function () {
        this.series.forEach(function (serie) {
            serie.translate();
            serie.render();
        });
    };
    /**
     * Render labels for the chart.
     *
     * @private
     * @function Highcharts.Chart#renderLabels
     */
    Chart.prototype.renderLabels = function () {
        var chart = this, labels = chart.options.labels;
        if (labels.items) {
            labels.items.forEach(function (label) {
                var style = extend(labels.style, label.style), x = pInt(style.left) + chart.plotLeft, y = pInt(style.top) + chart.plotTop + 12;
                // delete to prevent rewriting in IE
                delete style.left;
                delete style.top;
                chart.renderer.text(label.html, x, y)
                    .attr({ zIndex: 2 })
                    .css(style)
                    .add();
            });
        }
    };
    /**
     * Render all graphics for the chart. Runs internally on initialization.
     *
     * @private
     * @function Highcharts.Chart#render
     */
    Chart.prototype.render = function () {
        var chart = this, axes = chart.axes, colorAxis = chart.colorAxis, renderer = chart.renderer, options = chart.options, correction = 0, // correction for X axis labels
        tempWidth, tempHeight, redoHorizontal, redoVertical, renderAxes = function (axes) {
            axes.forEach(function (axis) {
                if (axis.visible) {
                    axis.render();
                }
            });
        };
        // Title
        chart.setTitle();
        /**
         * The overview of the chart's series.
         *
         * @name Highcharts.Chart#legend
         * @type {Highcharts.Legend}
         */
        chart.legend = new Legend(chart, options.legend);
        // Get stacks
        if (chart.getStacks) {
            chart.getStacks();
        }
        // Get chart margins
        chart.getMargins(true);
        chart.setChartSize();
        // Record preliminary dimensions for later comparison
        tempWidth = chart.plotWidth;
        axes.some(function (axis) {
            if (axis.horiz &&
                axis.visible &&
                axis.options.labels.enabled &&
                axis.series.length) {
                // 21 is the most common correction for X axis labels
                correction = 21;
                return true;
            }
        });
        // use Math.max to prevent negative plotHeight
        chart.plotHeight = Math.max(chart.plotHeight - correction, 0);
        tempHeight = chart.plotHeight;
        // Get margins by pre-rendering axes
        axes.forEach(function (axis) {
            axis.setScale();
        });
        chart.getAxisMargins();
        // If the plot area size has changed significantly, calculate tick
        // positions again
        redoHorizontal = tempWidth / chart.plotWidth > 1.1;
        // Height is more sensitive, use lower threshold
        redoVertical = tempHeight / chart.plotHeight > 1.05;
        if (redoHorizontal || redoVertical) {
            axes.forEach(function (axis) {
                if ((axis.horiz && redoHorizontal) ||
                    (!axis.horiz && redoVertical)) {
                    // update to reflect the new margins
                    axis.setTickInterval(true);
                }
            });
            chart.getMargins(); // second pass to check for new labels
        }
        // Draw the borders and backgrounds
        chart.drawChartBox();
        // Axes
        if (chart.hasCartesianSeries) {
            renderAxes(axes);
        }
        else if (colorAxis && colorAxis.length) {
            renderAxes(colorAxis);
        }
        // The series
        if (!chart.seriesGroup) {
            chart.seriesGroup = renderer.g('series-group')
                .attr({ zIndex: 3 })
                .add();
        }
        chart.renderSeries();
        // Labels
        chart.renderLabels();
        // Credits
        chart.addCredits();
        // Handle responsiveness
        if (chart.setResponsive) {
            chart.setResponsive();
        }
        // Handle scaling
        chart.updateContainerScaling();
        // Set flag
        chart.hasRendered = true;
    };
    /**
     * Set a new credits label for the chart.
     *
     * @sample highcharts/credits/credits-update/
     *         Add and update credits
     *
     * @function Highcharts.Chart#addCredits
     *
     * @param {Highcharts.CreditsOptions} [credits]
     * A configuration object for the new credits.
     */
    Chart.prototype.addCredits = function (credits) {
        var chart = this, creds = merge(true, this.options.credits, credits);
        if (creds.enabled && !this.credits) {
            /**
             * The chart's credits label. The label has an `update` method that
             * allows setting new options as per the
             * [credits options set](https://api.highcharts.com/highcharts/credits).
             *
             * @name Highcharts.Chart#credits
             * @type {Highcharts.SVGElement}
             */
            this.credits = this.renderer.text(creds.text + (this.mapCredits || ''), 0, 0)
                .addClass('highcharts-credits')
                .on('click', function () {
                if (creds.href) {
                    win.location.href = creds.href;
                }
            })
                .attr({
                align: creds.position.align,
                zIndex: 8
            });
            if (!chart.styledMode) {
                this.credits.css(creds.style);
            }
            this.credits
                .add()
                .align(creds.position);
            // Dynamically update
            this.credits.update = function (options) {
                chart.credits = chart.credits.destroy();
                chart.addCredits(options);
            };
        }
    };
    /**
     * Handle scaling, #11329 - when there is scaling/transform on the container
     * or on a parent element, we need to take this into account. We calculate
     * the scaling once here and it is picked up where we need to use it
     * (Pointer, Tooltip).
     *
     * @private
     * @function Highcharts.Chart#updateContainerScaling
     */
    Chart.prototype.updateContainerScaling = function () {
        var container = this.container;
        // #13342 - tooltip was not visible in Chrome, when chart
        // updates height.
        if (container.offsetWidth > 2 && // #13342
            container.offsetHeight > 2 && // #13342
            container.getBoundingClientRect) {
            var bb = container.getBoundingClientRect(), scaleX = bb.width / container.offsetWidth, scaleY = bb.height / container.offsetHeight;
            if (scaleX !== 1 || scaleY !== 1) {
                this.containerScaling = { scaleX: scaleX, scaleY: scaleY };
            }
            else {
                delete this.containerScaling;
            }
        }
    };
    /**
     * Remove the chart and purge memory. This method is called internally
     * before adding a second chart into the same container, as well as on
     * window unload to prevent leaks.
     *
     * @sample highcharts/members/chart-destroy/
     *         Destroy the chart from a button
     * @sample stock/members/chart-destroy/
     *         Destroy with Highstock
     *
     * @function Highcharts.Chart#destroy
     *
     * @fires Highcharts.Chart#event:destroy
     */
    Chart.prototype.destroy = function () {
        var chart = this, axes = chart.axes, series = chart.series, container = chart.container, i, parentNode = container && container.parentNode;
        // fire the chart.destoy event
        fireEvent(chart, 'destroy');
        // Delete the chart from charts lookup array
        if (chart.renderer.forExport) {
            erase(charts, chart); // #6569
        }
        else {
            charts[chart.index] = void 0;
        }
        H.chartCount--;
        chart.renderTo.removeAttribute('data-highcharts-chart');
        // remove events
        removeEvent(chart);
        // ==== Destroy collections:
        // Destroy axes
        i = axes.length;
        while (i--) {
            axes[i] = axes[i].destroy();
        }
        // Destroy scroller & scroller series before destroying base series
        if (this.scroller && this.scroller.destroy) {
            this.scroller.destroy();
        }
        // Destroy each series
        i = series.length;
        while (i--) {
            series[i] = series[i].destroy();
        }
        // ==== Destroy chart properties:
        [
            'title', 'subtitle', 'chartBackground', 'plotBackground',
            'plotBGImage', 'plotBorder', 'seriesGroup', 'clipRect', 'credits',
            'pointer', 'rangeSelector', 'legend', 'resetZoomButton', 'tooltip',
            'renderer'
        ].forEach(function (name) {
            var prop = chart[name];
            if (prop && prop.destroy) {
                chart[name] = prop.destroy();
            }
        });
        // Remove container and all SVG, check container as it can break in IE
        // when destroyed before finished loading
        if (container) {
            container.innerHTML = '';
            removeEvent(container);
            if (parentNode) {
                discardElement(container);
            }
        }
        // clean it all up
        objectEach(chart, function (val, key) {
            delete chart[key];
        });
    };
    /**
     * Prepare for first rendering after all data are loaded.
     *
     * @private
     * @function Highcharts.Chart#firstRender
     * @fires Highcharts.Chart#event:beforeRender
     */
    Chart.prototype.firstRender = function () {
        var chart = this, options = chart.options;
        // Hook for oldIE to check whether the chart is ready to render
        if (chart.isReadyToRender && !chart.isReadyToRender()) {
            return;
        }
        // Create the container
        chart.getContainer();
        chart.resetMargins();
        chart.setChartSize();
        // Set the common chart properties (mainly invert) from the given series
        chart.propFromSeries();
        // get axes
        chart.getAxes();
        // Initialize the series
        (isArray(options.series) ? options.series : []).forEach(
        // #9680
        function (serieOptions) {
            chart.initSeries(serieOptions);
        });
        chart.linkSeries();
        chart.setSeriesData();
        // Run an event after axes and series are initialized, but before
        // render. At this stage, the series data is indexed and cached in the
        // xData and yData arrays, so we can access those before rendering. Used
        // in Highstock.
        fireEvent(chart, 'beforeRender');
        // depends on inverted and on margins being set
        if (Pointer) {
            if (!H.hasTouch && (win.PointerEvent || win.MSPointerEvent)) {
                chart.pointer = new MSPointer(chart, options);
            }
            else {
                /**
                 * The Pointer that keeps track of mouse and touch interaction.
                 *
                 * @memberof Highcharts.Chart
                 * @name pointer
                 * @type {Highcharts.Pointer}
                 * @instance
                 */
                chart.pointer = new Pointer(chart, options);
            }
        }
        chart.render();
        // Fire the load event if there are no external images
        if (!chart.renderer.imgCount && !chart.hasLoaded) {
            chart.onload();
        }
        // If the chart was rendered outside the top container, put it back in
        // (#3679)
        chart.temporaryDisplay(true);
    };
    /**
     * Internal function that runs on chart load, async if any images are loaded
     * in the chart. Runs the callbacks and triggers the `load` and `render`
     * events.
     *
     * @private
     * @function Highcharts.Chart#onload
     * @fires Highcharts.Chart#event:load
     * @fires Highcharts.Chart#event:render
     */
    Chart.prototype.onload = function () {
        // Run callbacks, first the ones registered by modules, then user's one
        this.callbacks.concat([this.callback]).forEach(function (fn) {
            // Chart destroyed in its own callback (#3600)
            if (fn && typeof this.index !== 'undefined') {
                fn.apply(this, [this]);
            }
        }, this);
        fireEvent(this, 'load');
        fireEvent(this, 'render');
        // Set up auto resize, check for not destroyed (#6068)
        if (defined(this.index)) {
            this.setReflow(this.options.chart.reflow);
        }
        // Don't run again
        this.hasLoaded = true;
    };
    return Chart;
}());
// Hook for adding callbacks in modules
Chart.prototype.callbacks = [];
/**
 * Factory function for basic charts.
 *
 * @example
 * // Render a chart in to div#container
 * var chart = Highcharts.chart('container', {
 *     title: {
 *         text: 'My chart'
 *     },
 *     series: [{
 *         data: [1, 3, 2, 4]
 *     }]
 * });
 *
 * @function Highcharts.chart
 *
 * @param {string|Highcharts.HTMLDOMElement} [renderTo]
 *        The DOM element to render to, or its id.
 *
 * @param {Highcharts.Options} options
 *        The chart options structure.
 *
 * @param {Highcharts.ChartCallbackFunction} [callback]
 *        Function to run when the chart has loaded and and all external images
 *        are loaded. Defining a
 *        [chart.events.load](https://api.highcharts.com/highcharts/chart.events.load)
 *        handler is equivalent.
 *
 * @return {Highcharts.Chart}
 *         Returns the Chart object.
 */
function chart(a, b, c) {
    return new Chart(a, b, c);
}
H.chart = chart;
H.Chart = Chart;
export default Chart;
