/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import A from '../Animation/AnimationUtilities.js';
var animObject = A.animObject, setAnimation = A.setAnimation;
import D from '../DefaultOptions.js';
var defaultOptions = D.defaultOptions;
import F from '../Foundation.js';
var registerEventOptions = F.registerEventOptions;
import H from '../Globals.js';
var hasTouch = H.hasTouch, svg = H.svg, win = H.win;
import LegendSymbol from '../Legend/LegendSymbol.js';
import Point from './Point.js';
import SeriesDefaults from './SeriesDefaults.js';
import SeriesRegistry from './SeriesRegistry.js';
var seriesTypes = SeriesRegistry.seriesTypes;
import SVGElement from '../Renderer/SVG/SVGElement.js';
import U from '../Utilities.js';
var addEvent = U.addEvent, arrayMax = U.arrayMax, arrayMin = U.arrayMin, clamp = U.clamp, cleanRecursively = U.cleanRecursively, correctFloat = U.correctFloat, defined = U.defined, erase = U.erase, error = U.error, extend = U.extend, find = U.find, fireEvent = U.fireEvent, getNestedProperty = U.getNestedProperty, isArray = U.isArray, isNumber = U.isNumber, isString = U.isString, merge = U.merge, objectEach = U.objectEach, pick = U.pick, removeEvent = U.removeEvent, splat = U.splat, syncTimeout = U.syncTimeout;
/* *
 *
 *  Class
 *
 * */
/**
 * This is the base series prototype that all other series types inherit from.
 * A new series is initialized either through the
 * [series](https://api.highcharts.com/highcharts/series)
 * option structure, or after the chart is initialized, through
 * {@link Highcharts.Chart#addSeries}.
 *
 * The object can be accessed in a number of ways. All series and point event
 * handlers give a reference to the `series` object. The chart object has a
 * {@link Highcharts.Chart#series|series} property that is a collection of all
 * the chart's series. The point objects and axis objects also have the same
 * reference.
 *
 * Another way to reference the series programmatically is by `id`. Add an id
 * in the series configuration options, and get the series object by
 * {@link Highcharts.Chart#get}.
 *
 * Configuration options for the series are given in three levels. Options for
 * all series in a chart are given in the
 * [plotOptions.series](https://api.highcharts.com/highcharts/plotOptions.series)
 * object. Then options for all series of a specific type
 * are given in the plotOptions of that type, for example `plotOptions.line`.
 * Next, options for one single series are given in the series array, or as
 * arguments to `chart.addSeries`.
 *
 * The data in the series is stored in various arrays.
 *
 * - First, `series.options.data` contains all the original config options for
 *   each point whether added by options or methods like `series.addPoint`.
 *
 * - Next, `series.data` contains those values converted to points, but in case
 *   the series data length exceeds the `cropThreshold`, or if the data is
 *   grouped, `series.data` doesn't contain all the points. It only contains the
 *   points that have been created on demand.
 *
 * - Then there's `series.points` that contains all currently visible point
 *   objects. In case of cropping, the cropped-away points are not part of this
 *   array. The `series.points` array starts at `series.cropStart` compared to
 *   `series.data` and `series.options.data`. If however the series data is
 *   grouped, these can't be correlated one to one.
 *
 * - `series.xData` and `series.processedXData` contain clean x values,
 *   equivalent to `series.data` and `series.points`.
 *
 * - `series.yData` and `series.processedYData` contain clean y values,
 *   equivalent to `series.data` and `series.points`.
 *
 * @class
 * @name Highcharts.Series
 *
 * @param {Highcharts.Chart} chart
 * The chart instance.
 *
 * @param {Highcharts.SeriesOptionsType|object} options
 * The series options.
 */
var Series = /** @class */ (function () {
    function Series() {
        /* *
         *
         *  Static Properties
         *
         * */
        this._i = void 0;
        this.chart = void 0;
        this.data = void 0;
        this.eventOptions = void 0;
        this.eventsToUnbind = void 0;
        this.index = void 0;
        this.linkedSeries = void 0;
        this.options = void 0;
        this.points = void 0;
        this.processedXData = void 0;
        this.processedYData = void 0;
        this.tooltipOptions = void 0;
        this.userOptions = void 0;
        this.xAxis = void 0;
        this.yAxis = void 0;
        this.zones = void 0;
        /** eslint-enable valid-jsdoc */
    }
    /* *
     *
     *  Functions
     *
     * */
    /* eslint-disable valid-jsdoc */
    Series.prototype.init = function (chart, userOptions) {
        fireEvent(this, 'init', { options: userOptions });
        var series = this, chartSeries = chart.series;
        // The 'eventsToUnbind' property moved from prototype into the
        // Series init to avoid reference to the same array between
        // the different series and charts. #12959, #13937
        this.eventsToUnbind = [];
        /**
         * Read only. The chart that the series belongs to.
         *
         * @name Highcharts.Series#chart
         * @type {Highcharts.Chart}
         */
        series.chart = chart;
        /**
         * Read only. The series' type, like "line", "area", "column" etc.
         * The type in the series options anc can be altered using
         * {@link Series#update}.
         *
         * @name Highcharts.Series#type
         * @type {string}
         */
        /**
         * Read only. The series' current options. To update, use
         * {@link Series#update}.
         *
         * @name Highcharts.Series#options
         * @type {Highcharts.SeriesOptionsType}
         */
        series.options = series.setOptions(userOptions);
        var options = series.options;
        series.linkedSeries = [];
        // bind the axes
        series.bindAxes();
        extend(series, {
            /**
             * The series name as given in the options. Defaults to
             * "Series {n}".
             *
             * @name Highcharts.Series#name
             * @type {string}
             */
            name: options.name,
            state: '',
            /**
             * Read only. The series' visibility state as set by {@link
             * Series#show}, {@link Series#hide}, or in the initial
             * configuration.
             *
             * @name Highcharts.Series#visible
             * @type {boolean}
             */
            visible: options.visible !== false,
            /**
             * Read only. The series' selected state as set by {@link
             * Highcharts.Series#select}.
             *
             * @name Highcharts.Series#selected
             * @type {boolean}
             */
            selected: options.selected === true // false by default
        });
        registerEventOptions(this, options);
        var events = options.events;
        if ((events && events.click) ||
            (options.point &&
                options.point.events &&
                options.point.events.click) ||
            options.allowPointSelect) {
            chart.runTrackerClick = true;
        }
        series.getColor();
        series.getSymbol();
        // Initialize the parallel data arrays
        series.parallelArrays.forEach(function (key) {
            if (!series[key + 'Data']) {
                series[key + 'Data'] = [];
            }
        });
        // Mark cartesian
        if (series.isCartesian) {
            chart.hasCartesianSeries = true;
        }
        // Get the index and register the series in the chart. The index is
        // one more than the current latest series index (#5960).
        var lastSeries;
        if (chartSeries.length) {
            lastSeries = chartSeries[chartSeries.length - 1];
        }
        series._i = pick(lastSeries && lastSeries._i, -1) + 1;
        series.opacity = series.options.opacity;
        // Insert the series and re-order all series above the insertion
        // point.
        chart.orderSeries(this.insert(chartSeries));
        // Set options for series with sorting and set data later.
        if (options.dataSorting && options.dataSorting.enabled) {
            series.setDataSortingOptions();
        }
        else if (!series.points && !series.data) {
            series.setData(options.data, false);
        }
        fireEvent(this, 'afterInit');
    };
    /**
     * Check whether the series item is itself or inherits from a certain
     * series type.
     *
     * @function Highcharts.Series#is
     * @param {string} type The type of series to check for, can be either
     *        featured or custom series types. For example `column`, `pie`,
     *        `ohlc` etc.
     *
     * @return {boolean}
     *        True if this item is or inherits from the given type.
     */
    Series.prototype.is = function (type) {
        return seriesTypes[type] && this instanceof seriesTypes[type];
    };
    /**
     * Insert the series in a collection with other series, either the chart
     * series or yAxis series, in the correct order according to the index
     * option. Used internally when adding series.
     *
     * @private
     * @function Highcharts.Series#insert
     * @param {Array<Highcharts.Series>} collection
     *        A collection of series, like `chart.series` or `xAxis.series`.
     * @return {number}
     *         The index of the series in the collection.
     */
    Series.prototype.insert = function (collection) {
        var indexOption = this.options.index;
        var i;
        // Insert by index option
        if (isNumber(indexOption)) {
            i = collection.length;
            while (i--) {
                // Loop down until the interted element has higher index
                if (indexOption >=
                    pick(collection[i].options.index, collection[i]._i)) {
                    collection.splice(i + 1, 0, this);
                    break;
                }
            }
            if (i === -1) {
                collection.unshift(this);
            }
            i = i + 1;
            // Or just push it to the end
        }
        else {
            collection.push(this);
        }
        return pick(i, collection.length - 1);
    };
    /**
     * Set the xAxis and yAxis properties of cartesian series, and register
     * the series in the `axis.series` array.
     *
     * @private
     * @function Highcharts.Series#bindAxes
     */
    Series.prototype.bindAxes = function () {
        var series = this, seriesOptions = series.options, chart = series.chart;
        var axisOptions;
        fireEvent(this, 'bindAxes', null, function () {
            // repeat for xAxis and yAxis
            (series.axisTypes || []).forEach(function (AXIS) {
                var index = 0;
                // loop through the chart's axis objects
                chart[AXIS].forEach(function (axis) {
                    axisOptions = axis.options;
                    // apply if the series xAxis or yAxis option mathches
                    // the number of the axis, or if undefined, use the
                    // first axis
                    if ((seriesOptions[AXIS] === index &&
                        !axisOptions.isInternal) ||
                        (typeof seriesOptions[AXIS] !==
                            'undefined' &&
                            seriesOptions[AXIS] === axisOptions.id) ||
                        (typeof seriesOptions[AXIS] ===
                            'undefined' &&
                            axisOptions.index === 0)) {
                        // register this series in the axis.series lookup
                        series.insert(axis.series);
                        // set this series.xAxis or series.yAxis reference
                        /**
                         * Read only. The unique xAxis object associated
                         * with the series.
                         *
                         * @name Highcharts.Series#xAxis
                         * @type {Highcharts.Axis}
                         */
                        /**
                         * Read only. The unique yAxis object associated
                         * with the series.
                         *
                         * @name Highcharts.Series#yAxis
                         * @type {Highcharts.Axis}
                         */
                        series[AXIS] = axis;
                        // mark dirty for redraw
                        axis.isDirty = true;
                    }
                    if (!axisOptions.isInternal) {
                        index++;
                    }
                });
                // The series needs an X and an Y axis
                if (!series[AXIS] &&
                    series.optionalAxis !== AXIS) {
                    error(18, true, chart);
                }
            });
        });
        fireEvent(this, 'afterBindAxes');
    };
    /**
     * For simple series types like line and column, the data values are
     * held in arrays like xData and yData for quick lookup to find extremes
     * and more. For multidimensional series like bubble and map, this can
     * be extended with arrays like zData and valueData by adding to the
     * `series.parallelArrays` array.
     *
     * @private
     * @function Highcharts.Series#updateParallelArrays
     */
    Series.prototype.updateParallelArrays = function (point, i) {
        var series = point.series, args = arguments, fn = isNumber(i) ?
            // Insert the value in the given position
            function (key) {
                var val = key === 'y' && series.toYData ?
                    series.toYData(point) :
                    point[key];
                series[key + 'Data'][i] = val;
            } :
            // Apply the method specified in i with the following
            // arguments as arguments
            function (key) {
                Array.prototype[i].apply(series[key + 'Data'], Array.prototype.slice.call(args, 2));
            };
        series.parallelArrays.forEach(fn);
    };
    /**
     * Define hasData functions for series. These return true if there
     * are data points on this series within the plot area.
     *
     * @private
     * @function Highcharts.Series#hasData
     */
    Series.prototype.hasData = function () {
        return ((this.visible &&
            typeof this.dataMax !== 'undefined' &&
            typeof this.dataMin !== 'undefined') || ( // #3703
        this.visible &&
            this.yData &&
            this.yData.length > 0) // #9758
        );
    };
    /**
     * Return an auto incremented x value based on the pointStart and
     * pointInterval options. This is only used if an x value is not given
     * for the point that calls autoIncrement.
     *
     * @private
     * @function Highcharts.Series#autoIncrement
     */
    Series.prototype.autoIncrement = function (x) {
        var options = this.options, pointIntervalUnit = options.pointIntervalUnit, relativeXValue = options.relativeXValue, time = this.chart.time;
        var xIncrement = this.xIncrement, date, pointInterval;
        xIncrement = pick(xIncrement, options.pointStart, 0);
        this.pointInterval = pointInterval = pick(this.pointInterval, options.pointInterval, 1);
        if (relativeXValue && isNumber(x)) {
            pointInterval *= x;
        }
        // Added code for pointInterval strings
        if (pointIntervalUnit) {
            date = new time.Date(xIncrement);
            if (pointIntervalUnit === 'day') {
                time.set('Date', date, time.get('Date', date) + pointInterval);
            }
            else if (pointIntervalUnit === 'month') {
                time.set('Month', date, time.get('Month', date) + pointInterval);
            }
            else if (pointIntervalUnit === 'year') {
                time.set('FullYear', date, time.get('FullYear', date) + pointInterval);
            }
            pointInterval = date.getTime() - xIncrement;
        }
        if (relativeXValue && isNumber(x)) {
            return xIncrement + pointInterval;
        }
        this.xIncrement = xIncrement + pointInterval;
        return xIncrement;
    };
    /**
     * Internal function to set properties for series if data sorting is
     * enabled.
     *
     * @private
     * @function Highcharts.Series#setDataSortingOptions
     */
    Series.prototype.setDataSortingOptions = function () {
        var options = this.options;
        extend(this, {
            requireSorting: false,
            sorted: false,
            enabledDataSorting: true,
            allowDG: false
        });
        // To allow unsorted data for column series.
        if (!defined(options.pointRange)) {
            options.pointRange = 1;
        }
    };
    /**
     * Set the series options by merging from the options tree. Called
     * internally on initializing and updating series. This function will
     * not redraw the series. For API usage, use {@link Series#update}.
     * @private
     * @function Highcharts.Series#setOptions
     * @param {Highcharts.SeriesOptionsType} itemOptions
     * The series options.
     * @emits Highcharts.Series#event:afterSetOptions
     */
    Series.prototype.setOptions = function (itemOptions) {
        var chart = this.chart, chartOptions = chart.options, plotOptions = chartOptions.plotOptions, userOptions = chart.userOptions || {}, seriesUserOptions = merge(itemOptions), styledMode = chart.styledMode, e = {
            plotOptions: plotOptions,
            userOptions: seriesUserOptions
        };
        var zone;
        fireEvent(this, 'setOptions', e);
        // These may be modified by the event
        var typeOptions = e.plotOptions[this.type], userPlotOptions = (userOptions.plotOptions || {});
        // use copy to prevent undetected changes (#9762)
        /**
         * Contains series options by the user without defaults.
         * @name Highcharts.Series#userOptions
         * @type {Highcharts.SeriesOptionsType}
         */
        this.userOptions = e.userOptions;
        var options = merge(typeOptions, plotOptions.series, 
        // #3881, chart instance plotOptions[type] should trump
        // plotOptions.series
        userOptions.plotOptions &&
            userOptions.plotOptions[this.type], seriesUserOptions);
        // The tooltip options are merged between global and series specific
        // options. Importance order asscendingly:
        // globals: (1)tooltip, (2)plotOptions.series,
        // (3)plotOptions[this.type]
        // init userOptions with possible later updates: 4-6 like 1-3 and
        // (7)this series options
        this.tooltipOptions = merge(defaultOptions.tooltip, // 1
        defaultOptions.plotOptions.series &&
            defaultOptions.plotOptions.series.tooltip, // 2
        defaultOptions.plotOptions[this.type].tooltip, // 3
        chartOptions.tooltip.userOptions, // 4
        plotOptions.series &&
            plotOptions.series.tooltip, // 5
        plotOptions[this.type].tooltip, // 6
        seriesUserOptions.tooltip // 7
        );
        // When shared tooltip, stickyTracking is true by default,
        // unless user says otherwise.
        this.stickyTracking = pick(seriesUserOptions.stickyTracking, userPlotOptions[this.type] &&
            userPlotOptions[this.type].stickyTracking, userPlotOptions.series && userPlotOptions.series.stickyTracking, (this.tooltipOptions.shared && !this.noSharedTooltip ?
            true :
            options.stickyTracking));
        // Delete marker object if not allowed (#1125)
        if (typeOptions.marker === null) {
            delete options.marker;
        }
        // Handle color zones
        this.zoneAxis = options.zoneAxis;
        var zones = this.zones = (options.zones || []).slice();
        if ((options.negativeColor || options.negativeFillColor) &&
            !options.zones) {
            zone = {
                value: options[this.zoneAxis + 'Threshold'] ||
                    options.threshold ||
                    0,
                className: 'highcharts-negative'
            };
            if (!styledMode) {
                zone.color = options.negativeColor;
                zone.fillColor = options.negativeFillColor;
            }
            zones.push(zone);
        }
        if (zones.length) { // Push one extra zone for the rest
            if (defined(zones[zones.length - 1].value)) {
                zones.push(styledMode ? {} : {
                    color: this.color,
                    fillColor: this.fillColor
                });
            }
        }
        fireEvent(this, 'afterSetOptions', { options: options });
        return options;
    };
    /**
     * Return series name in "Series {Number}" format or the one defined by
     * a user. This method can be simply overridden as series name format
     * can vary (e.g. technical indicators).
     *
     * @function Highcharts.Series#getName
     *
     * @return {string}
     * The series name.
     */
    Series.prototype.getName = function () {
        // #4119
        return pick(this.options.name, 'Series ' + (this.index + 1));
    };
    /**
     * @private
     * @function Highcharts.Series#getCyclic
     */
    Series.prototype.getCyclic = function (prop, value, defaults) {
        var chart = this.chart, userOptions = this.userOptions, indexName = prop + 'Index', counterName = prop + 'Counter', len = defaults ? defaults.length : pick(chart.options.chart[prop + 'Count'], chart[prop + 'Count']);
        var i, setting;
        if (!value) {
            // Pick up either the colorIndex option, or the _colorIndex
            // after Series.update()
            setting = pick(userOptions[indexName], userOptions['_' + indexName]);
            if (defined(setting)) { // after Series.update()
                i = setting;
            }
            else {
                // #6138
                if (!chart.series.length) {
                    chart[counterName] = 0;
                }
                userOptions['_' + indexName] = i =
                    chart[counterName] % len;
                chart[counterName] += 1;
            }
            if (defaults) {
                value = defaults[i];
            }
        }
        // Set the colorIndex
        if (typeof i !== 'undefined') {
            this[indexName] = i;
        }
        this[prop] = value;
    };
    /**
     * Get the series' color based on either the options or pulled from
     * global options.
     *
     * @private
     * @function Highcharts.Series#getColor
     */
    Series.prototype.getColor = function () {
        if (this.chart.styledMode) {
            this.getCyclic('color');
        }
        else if (this.options.colorByPoint) {
            this.color = "#cccccc" /* neutralColor20 */;
        }
        else {
            this.getCyclic('color', this.options.color ||
                defaultOptions.plotOptions[this.type].color, this.chart.options.colors);
        }
    };
    /**
     * Get all points' instances created for this series.
     *
     * @private
     * @function Highcharts.Series#getPointsCollection
     */
    Series.prototype.getPointsCollection = function () {
        return (this.hasGroupedData ? this.points : this.data) || [];
    };
    /**
     * Get the series' symbol based on either the options or pulled from
     * global options.
     *
     * @private
     * @function Highcharts.Series#getSymbol
     */
    Series.prototype.getSymbol = function () {
        var seriesMarkerOption = this.options.marker;
        this.getCyclic('symbol', seriesMarkerOption.symbol, this.chart.options.symbols);
    };
    /**
     * Finds the index of an existing point that matches the given point
     * options.
     *
     * @private
     * @function Highcharts.Series#findPointIndex
     * @param {Highcharts.PointOptionsObject} optionsObject
     * The options of the point.
     * @param {number} fromIndex
     * The index to start searching from, used for optimizing series with
     * required sorting.
     * @return {number|undefined}
     * Returns the index of a matching point, or undefined if no match is found.
     */
    Series.prototype.findPointIndex = function (optionsObject, fromIndex) {
        var id = optionsObject.id, x = optionsObject.x, oldData = this.points, dataSorting = this.options.dataSorting;
        var matchingPoint, matchedById, pointIndex;
        if (id) {
            var item = this.chart.get(id);
            if (item instanceof Point) {
                matchingPoint = item;
            }
        }
        else if (this.linkedParent ||
            this.enabledDataSorting ||
            this.options.relativeXValue) {
            var matcher = function (oldPoint) { return !oldPoint.touched &&
                oldPoint.index === optionsObject.index; };
            if (dataSorting && dataSorting.matchByName) {
                matcher = function (oldPoint) { return !oldPoint.touched &&
                    oldPoint.name === optionsObject.name; };
            }
            else if (this.options.relativeXValue) {
                matcher = function (oldPoint) { return !oldPoint.touched &&
                    oldPoint.options.x === optionsObject.x; };
            }
            matchingPoint = find(oldData, matcher);
            // Add unmatched point as a new point
            if (!matchingPoint) {
                return void 0;
            }
        }
        if (matchingPoint) {
            pointIndex = matchingPoint && matchingPoint.index;
            if (typeof pointIndex !== 'undefined') {
                matchedById = true;
            }
        }
        // Search for the same X in the existing data set
        if (typeof pointIndex === 'undefined' && isNumber(x)) {
            pointIndex = this.xData.indexOf(x, fromIndex);
        }
        // Reduce pointIndex if data is cropped
        if (pointIndex !== -1 &&
            typeof pointIndex !== 'undefined' &&
            this.cropped) {
            pointIndex = (pointIndex >= this.cropStart) ?
                pointIndex - this.cropStart : pointIndex;
        }
        if (!matchedById &&
            isNumber(pointIndex) &&
            oldData[pointIndex] && oldData[pointIndex].touched) {
            pointIndex = void 0;
        }
        return pointIndex;
    };
    /**
     * Internal function called from setData. If the point count is the same
     * as is was, or if there are overlapping X values, just run
     * Point.update which is cheaper, allows animation, and keeps references
     * to points. This also allows adding or removing points if the X-es
     * don't match.
     *
     * @private
     * @function Highcharts.Series#updateData
     */
    Series.prototype.updateData = function (data, animation) {
        var options = this.options, dataSorting = options.dataSorting, oldData = this.points, pointsToAdd = [], requireSorting = this.requireSorting, equalLength = data.length === oldData.length;
        var hasUpdatedByKey, i, point, lastIndex, succeeded = true;
        this.xIncrement = null;
        // Iterate the new data
        data.forEach(function (pointOptions, i) {
            var optionsObject = (defined(pointOptions) &&
                this.pointClass.prototype.optionsToObject.call({ series: this }, pointOptions)) || {};
            var pointIndex;
            // Get the x of the new data point
            var x = optionsObject.x, id = optionsObject.id;
            if (id || isNumber(x)) {
                pointIndex = this.findPointIndex(optionsObject, lastIndex);
                // Matching X not found
                // or used already due to ununique x values (#8995),
                // add point (but later)
                if (pointIndex === -1 ||
                    typeof pointIndex === 'undefined') {
                    pointsToAdd.push(pointOptions);
                    // Matching X found, update
                }
                else if (oldData[pointIndex] &&
                    pointOptions !== options.data[pointIndex]) {
                    oldData[pointIndex].update(pointOptions, false, null, false);
                    // Mark it touched, below we will remove all points that
                    // are not touched.
                    oldData[pointIndex].touched = true;
                    // Speed optimize by only searching after last known
                    // index. Performs ~20% bettor on large data sets.
                    if (requireSorting) {
                        lastIndex = pointIndex + 1;
                    }
                    // Point exists, no changes, don't remove it
                }
                else if (oldData[pointIndex]) {
                    oldData[pointIndex].touched = true;
                }
                // If the length is equal and some of the nodes had a
                // match in the same position, we don't want to remove
                // non-matches.
                if (!equalLength ||
                    i !== pointIndex ||
                    (dataSorting && dataSorting.enabled) ||
                    this.hasDerivedData) {
                    hasUpdatedByKey = true;
                }
            }
            else {
                // Gather all points that are not matched
                pointsToAdd.push(pointOptions);
            }
        }, this);
        // Remove points that don't exist in the updated data set
        if (hasUpdatedByKey) {
            i = oldData.length;
            while (i--) {
                point = oldData[i];
                if (point && !point.touched && point.remove) {
                    point.remove(false, animation);
                }
            }
            // If we did not find keys (ids or x-values), and the length is the
            // same, update one-to-one
        }
        else if (equalLength && (!dataSorting || !dataSorting.enabled)) {
            data.forEach(function (point, i) {
                // .update doesn't exist on a linked, hidden series (#3709)
                // (#10187)
                if (point !== oldData[i].y && oldData[i].update) {
                    oldData[i].update(point, false, null, false);
                }
            });
            // Don't add new points since those configs are used above
            pointsToAdd.length = 0;
            // Did not succeed in updating data
        }
        else {
            succeeded = false;
        }
        oldData.forEach(function (point) {
            if (point) {
                point.touched = false;
            }
        });
        if (!succeeded) {
            return false;
        }
        // Add new points
        pointsToAdd.forEach(function (point) {
            this.addPoint(point, false, null, null, false);
        }, this);
        if (this.xIncrement === null &&
            this.xData &&
            this.xData.length) {
            this.xIncrement = arrayMax(this.xData);
            this.autoIncrement();
        }
        return true;
    };
    /**
     * Apply a new set of data to the series and optionally redraw it. The
     * new data array is passed by reference (except in case of
     * `updatePoints`), and may later be mutated when updating the chart
     * data.
     *
     * Note the difference in behaviour when setting the same amount of
     * points, or a different amount of points, as handled by the
     * `updatePoints` parameter.
     *
     * @sample highcharts/members/series-setdata/
     *         Set new data from a button
     * @sample highcharts/members/series-setdata-pie/
     *         Set data in a pie
     * @sample stock/members/series-setdata/
     *         Set new data in Highcharts Stock
     * @sample maps/members/series-setdata/
     *         Set new data in Highmaps
     *
     * @function Highcharts.Series#setData
     *
     * @param {Array<Highcharts.PointOptionsType>} data
     *        Takes an array of data in the same format as described under
     *        `series.{type}.data` for the given series type, for example a
     *        line series would take data in the form described under
     *        [series.line.data](https://api.highcharts.com/highcharts/series.line.data).
     *
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart after the series is altered. If
     *        doing more operations on the chart, it is a good idea to set
     *        redraw to false and call {@link Chart#redraw} after.
     *
     * @param {boolean|Partial<Highcharts.AnimationOptionsObject>} [animation]
     *        When the updated data is the same length as the existing data,
     *        points will be updated by default, and animation visualizes
     *        how the points are changed. Set false to disable animation, or
     *        a configuration object to set duration or easing.
     *
     * @param {boolean} [updatePoints=true]
     *        When this is true, points will be updated instead of replaced
     *        whenever possible. This occurs a) when the updated data is the
     *        same length as the existing data, b) when points are matched
     *        by their id's, or c) when points can be matched by X values.
     *        This allows updating with animation and performs better. In
     *        this case, the original array is not passed by reference. Set
     *        `false` to prevent.
     */
    Series.prototype.setData = function (data, redraw, animation, updatePoints) {
        var series = this, oldData = series.points, oldDataLength = (oldData && oldData.length) || 0, options = series.options, chart = series.chart, dataSorting = options.dataSorting, xAxis = series.xAxis, turboThreshold = options.turboThreshold, xData = this.xData, yData = this.yData, pointArrayMap = series.pointArrayMap, valueCount = pointArrayMap && pointArrayMap.length, keys = options.keys;
        var i, pt, updatedData, indexOfX = 0, indexOfY = 1, firstPoint = null;
        data = data || [];
        var dataLength = data.length;
        redraw = pick(redraw, true);
        if (dataSorting && dataSorting.enabled) {
            data = this.sortData(data);
        }
        // First try to run Point.update which is cheaper, allows animation,
        // and keeps references to points.
        if (updatePoints !== false &&
            dataLength &&
            oldDataLength &&
            !series.cropped &&
            !series.hasGroupedData &&
            series.visible &&
            // Soft updating has no benefit in boost, and causes JS error
            // (#8355)
            !series.isSeriesBoosting) {
            updatedData = this.updateData(data, animation);
        }
        if (!updatedData) {
            // Reset properties
            series.xIncrement = null;
            series.colorCounter = 0; // for series with colorByPoint (#1547)
            // Update parallel arrays
            this.parallelArrays.forEach(function (key) {
                series[key + 'Data'].length = 0;
            });
            // In turbo mode, only one- or twodimensional arrays of numbers
            // are allowed. The first value is tested, and we assume that
            // all the rest are defined the same way. Although the 'for'
            // loops are similar, they are repeated inside each if-else
            // conditional for max performance.
            if (turboThreshold && dataLength > turboThreshold) {
                firstPoint = series.getFirstValidPoint(data);
                if (isNumber(firstPoint)) { // assume all points are numbers
                    for (i = 0; i < dataLength; i++) {
                        xData[i] = this.autoIncrement();
                        yData[i] = data[i];
                    }
                    // Assume all points are arrays when first point is
                }
                else if (isArray(firstPoint)) {
                    if (valueCount) { // [x, low, high] or [x, o, h, l, c]
                        if (firstPoint.length === valueCount) {
                            for (i = 0; i < dataLength; i++) {
                                xData[i] = this.autoIncrement();
                                yData[i] = data[i];
                            }
                        }
                        else {
                            for (i = 0; i < dataLength; i++) {
                                pt = data[i];
                                xData[i] = pt[0];
                                yData[i] =
                                    pt.slice(1, valueCount + 1);
                            }
                        }
                    }
                    else { // [x, y]
                        if (keys) {
                            indexOfX = keys.indexOf('x');
                            indexOfY = keys.indexOf('y');
                            indexOfX = indexOfX >= 0 ? indexOfX : 0;
                            indexOfY = indexOfY >= 0 ? indexOfY : 1;
                        }
                        if (firstPoint.length === 1) {
                            indexOfY = 0;
                        }
                        if (indexOfX === indexOfY) {
                            for (i = 0; i < dataLength; i++) {
                                xData[i] = this.autoIncrement();
                                yData[i] = data[i][indexOfY];
                            }
                        }
                        else {
                            for (i = 0; i < dataLength; i++) {
                                pt = data[i];
                                xData[i] = pt[indexOfX];
                                yData[i] = pt[indexOfY];
                            }
                        }
                    }
                }
                else {
                    // Highcharts expects configs to be numbers or arrays in
                    // turbo mode
                    error(12, false, chart);
                }
            }
            else {
                for (i = 0; i < dataLength; i++) {
                    // stray commas in oldIE:
                    if (typeof data[i] !== 'undefined') {
                        pt = { series: series };
                        series.pointClass.prototype.applyOptions.apply(pt, [data[i]]);
                        series.updateParallelArrays(pt, i);
                    }
                }
            }
            // Forgetting to cast strings to numbers is a common caveat when
            // handling CSV or JSON
            if (yData && isString(yData[0])) {
                error(14, true, chart);
            }
            series.data = [];
            series.options.data = series.userOptions.data = data;
            // destroy old points
            i = oldDataLength;
            while (i--) {
                if (oldData[i] && oldData[i].destroy) {
                    oldData[i].destroy();
                }
            }
            // reset minRange (#878)
            if (xAxis) {
                xAxis.minRange = xAxis.userMinRange;
            }
            // redraw
            series.isDirty = chart.isDirtyBox = true;
            series.isDirtyData = !!oldData;
            animation = false;
        }
        // Typically for pie series, points need to be processed and
        // generated prior to rendering the legend
        if (options.legendType === 'point') {
            this.processData();
            this.generatePoints();
        }
        if (redraw) {
            chart.redraw(animation);
        }
    };
    /**
     * Internal function to sort series data
     *
     * @private
     * @function Highcharts.Series#sortData
     * @param {Array<Highcharts.PointOptionsType>} data
     * Force data grouping.
     */
    Series.prototype.sortData = function (data) {
        var series = this, options = series.options, dataSorting = options.dataSorting, sortKey = dataSorting.sortKey || 'y', getPointOptionsObject = function (series, pointOptions) {
            return (defined(pointOptions) &&
                series.pointClass.prototype.optionsToObject.call({
                    series: series
                }, pointOptions)) || {};
        };
        data.forEach(function (pointOptions, i) {
            data[i] = getPointOptionsObject(series, pointOptions);
            data[i].index = i;
        }, this);
        // Sorting
        var sortedData = data.concat().sort(function (a, b) {
            var aValue = getNestedProperty(sortKey, a);
            var bValue = getNestedProperty(sortKey, b);
            return bValue < aValue ? -1 : bValue > aValue ? 1 : 0;
        });
        // Set x value depending on the position in the array
        sortedData.forEach(function (point, i) {
            point.x = i;
        }, this);
        // Set the same x for linked series points if they don't have their
        // own sorting
        if (series.linkedSeries) {
            series.linkedSeries.forEach(function (linkedSeries) {
                var options = linkedSeries.options, seriesData = options.data;
                if ((!options.dataSorting ||
                    !options.dataSorting.enabled) &&
                    seriesData) {
                    seriesData.forEach(function (pointOptions, i) {
                        seriesData[i] = getPointOptionsObject(linkedSeries, pointOptions);
                        if (data[i]) {
                            seriesData[i].x = data[i].x;
                            seriesData[i].index = i;
                        }
                    });
                    linkedSeries.setData(seriesData, false);
                }
            });
        }
        return data;
    };
    /**
     * Internal function to process the data by cropping away unused data
     * points if the series is longer than the crop threshold. This saves
     * computing time for large series.
     *
     * @private
     * @function Highcharts.Series#getProcessedData
     * @param {boolean} [forceExtremesFromAll]
     * Force getting extremes of a total series data range.
     */
    Series.prototype.getProcessedData = function (forceExtremesFromAll) {
        var series = this, xAxis = series.xAxis, options = series.options, cropThreshold = options.cropThreshold, getExtremesFromAll = forceExtremesFromAll ||
            series.getExtremesFromAll ||
            options.getExtremesFromAll, // #4599
        isCartesian = series.isCartesian, val2lin = xAxis && xAxis.val2lin, isLog = !!(xAxis && xAxis.logarithmic);
        var croppedData, cropped, cropStart = 0, distance, closestPointRange, i, // loop variable
        xExtremes, min, max, 
        // copied during slice operation:
        processedXData = series.xData, processedYData = series.yData, throwOnUnsorted = series.requireSorting, updatingNames = false;
        var dataLength = processedXData.length;
        if (xAxis) {
            // corrected for log axis (#3053)
            xExtremes = xAxis.getExtremes();
            min = xExtremes.min;
            max = xExtremes.max;
            updatingNames = !!(xAxis.categories && !xAxis.names.length);
        }
        // optionally filter out points outside the plot area
        if (isCartesian &&
            series.sorted &&
            !getExtremesFromAll &&
            (!cropThreshold ||
                dataLength > cropThreshold ||
                series.forceCrop)) {
            // it's outside current extremes
            if (processedXData[dataLength - 1] < min ||
                processedXData[0] > max) {
                processedXData = [];
                processedYData = [];
                // only crop if it's actually spilling out
            }
            else if (series.yData && (processedXData[0] < min ||
                processedXData[dataLength - 1] > max)) {
                croppedData = this.cropData(series.xData, series.yData, min, max);
                processedXData = croppedData.xData;
                processedYData = croppedData.yData;
                cropStart = croppedData.start;
                cropped = true;
            }
        }
        // Find the closest distance between processed points
        i = processedXData.length || 1;
        while (--i) {
            distance = (isLog ?
                (val2lin(processedXData[i]) -
                    val2lin(processedXData[i - 1])) :
                (processedXData[i] -
                    processedXData[i - 1]));
            if (distance > 0 &&
                (typeof closestPointRange === 'undefined' ||
                    distance < closestPointRange)) {
                closestPointRange = distance;
                // Unsorted data is not supported by the line tooltip, as well
                // as data grouping and navigation in Stock charts (#725) and
                // width calculation of columns (#1900).
                // Avoid warning during the premature processing pass in
                // updateNames (#16104).
            }
            else if (distance < 0 && throwOnUnsorted && !updatingNames) {
                error(15, false, series.chart);
                throwOnUnsorted = false; // Only once
            }
        }
        return {
            xData: processedXData,
            yData: processedYData,
            cropped: cropped,
            cropStart: cropStart,
            closestPointRange: closestPointRange
        };
    };
    /**
     * Internal function to apply processed data.
     * In Highcharts Stock, this function is extended to provide data grouping.
     *
     * @private
     * @function Highcharts.Series#processData
     * @param {boolean} [force]
     * Force data grouping.
     */
    Series.prototype.processData = function (force) {
        var series = this, xAxis = series.xAxis;
        // If the series data or axes haven't changed, don't go through
        // this. Return false to pass the message on to override methods
        // like in data grouping.
        if (series.isCartesian &&
            !series.isDirty &&
            !xAxis.isDirty &&
            !series.yAxis.isDirty &&
            !force) {
            return false;
        }
        var processedData = series.getProcessedData();
        // Record the properties
        series.cropped = processedData.cropped; // undefined or true
        series.cropStart = processedData.cropStart;
        series.processedXData = processedData.xData;
        series.processedYData = processedData.yData;
        series.closestPointRange = (series.basePointRange = processedData.closestPointRange);
        fireEvent(series, 'afterProcessData');
    };
    /**
     * Iterate over xData and crop values between min and max. Returns
     * object containing crop start/end cropped xData with corresponding
     * part of yData, dataMin and dataMax within the cropped range.
     *
     * @private
     * @function Highcharts.Series#cropData
     */
    Series.prototype.cropData = function (xData, yData, min, max, cropShoulder) {
        var dataLength = xData.length;
        var i, j, cropStart = 0, cropEnd = dataLength;
        // line-type series need one point outside
        cropShoulder = pick(cropShoulder, this.cropShoulder);
        // iterate up to find slice start
        for (i = 0; i < dataLength; i++) {
            if (xData[i] >= min) {
                cropStart = Math.max(0, i - cropShoulder);
                break;
            }
        }
        // proceed to find slice end
        for (j = i; j < dataLength; j++) {
            if (xData[j] > max) {
                cropEnd = j + cropShoulder;
                break;
            }
        }
        return {
            xData: xData.slice(cropStart, cropEnd),
            yData: yData.slice(cropStart, cropEnd),
            start: cropStart,
            end: cropEnd
        };
    };
    /**
     * Generate the data point after the data has been processed by cropping
     * away unused points and optionally grouped in Highcharts Stock.
     *
     * @private
     * @function Highcharts.Series#generatePoints
     */
    Series.prototype.generatePoints = function () {
        var series = this, options = series.options, dataOptions = (series.processedData || options.data), processedXData = series.processedXData, processedYData = series.processedYData, PointClass = series.pointClass, processedDataLength = processedXData.length, cropStart = series.cropStart || 0, hasGroupedData = series.hasGroupedData, keys = options.keys, points = [], groupCropStartIndex = (options.dataGrouping &&
            options.dataGrouping.groupAll ?
            cropStart :
            0);
        var dataLength, cursor, point, i, data = series.data;
        if (!data && !hasGroupedData) {
            var arr = [];
            arr.length = dataOptions.length;
            data = series.data = arr;
        }
        if (keys && hasGroupedData) {
            // grouped data has already applied keys (#6590)
            series.options.keys = false;
        }
        for (i = 0; i < processedDataLength; i++) {
            cursor = cropStart + i;
            if (!hasGroupedData) {
                point = data[cursor];
                // #970:
                if (!point &&
                    typeof dataOptions[cursor] !== 'undefined') {
                    data[cursor] = point = (new PointClass()).init(series, dataOptions[cursor], processedXData[i]);
                }
            }
            else {
                // splat the y data in case of ohlc data array
                point = (new PointClass()).init(series, [processedXData[i]].concat(splat(processedYData[i])));
                /**
                 * Highcharts Stock only. If a point object is created by data
                 * grouping, it doesn't reflect actual points in the raw
                 * data. In this case, the `dataGroup` property holds
                 * information that points back to the raw data.
                 *
                 * - `dataGroup.start` is the index of the first raw data
                 *   point in the group.
                 *
                 * - `dataGroup.length` is the amount of points in the
                 *   group.
                 *
                 * @product highstock
                 *
                 * @name Highcharts.Point#dataGroup
                 * @type {Highcharts.DataGroupingInfoObject|undefined}
                 *
                 * @sample stock/members/point-datagroup
                 *         Click to inspect raw data points
                 */
                point.dataGroup = series.groupMap[groupCropStartIndex + i];
                if (point.dataGroup.options) {
                    point.options = point.dataGroup.options;
                    extend(point, point.dataGroup.options);
                    // Collision of props and options (#9770)
                    delete point.dataLabels;
                }
            }
            if (point) { // #6279
                /**
                 * Contains the point's index in the `Series.points` array.
                 *
                 * @name Highcharts.Point#index
                 * @type {number}
                 * @readonly
                 */
                // For faster access in Point.update
                point.index = hasGroupedData ?
                    (groupCropStartIndex + i) : cursor;
                points[i] = point;
            }
        }
        // restore keys options (#6590)
        series.options.keys = keys;
        // Hide cropped-away points - this only runs when the number of
        // points is above cropThreshold, or when swithching view from
        // non-grouped data to grouped data (#637)
        if (data &&
            (processedDataLength !== (dataLength = data.length) ||
                hasGroupedData)) {
            for (i = 0; i < dataLength; i++) {
                // when has grouped data, clear all points
                if (i === cropStart && !hasGroupedData) {
                    i += processedDataLength;
                }
                if (data[i]) {
                    data[i].destroyElements();
                    data[i].plotX = void 0; // #1003
                }
            }
        }
        /**
         * Read only. An array containing those values converted to points.
         * In case the series data length exceeds the `cropThreshold`, or if
         * the data is grouped, `series.data` doesn't contain all the
         * points. Also, in case a series is hidden, the `data` array may be
         * empty. To access raw values, `series.options.data` will always be
         * up to date. `Series.data` only contains the points that have been
         * created on demand. To modify the data, use
         * {@link Highcharts.Series#setData} or
         * {@link Highcharts.Point#update}.
         *
         * @see Series.points
         *
         * @name Highcharts.Series#data
         * @type {Array<Highcharts.Point>}
         */
        series.data = data;
        /**
         * An array containing all currently visible point objects. In case
         * of cropping, the cropped-away points are not part of this array.
         * The `series.points` array starts at `series.cropStart` compared
         * to `series.data` and `series.options.data`. If however the series
         * data is grouped, these can't be correlated one to one. To modify
         * the data, use {@link Highcharts.Series#setData} or
         * {@link Highcharts.Point#update}.
         *
         * @name Highcharts.Series#points
         * @type {Array<Highcharts.Point>}
         */
        series.points = points;
        fireEvent(this, 'afterGeneratePoints');
    };
    /**
     * Get current X extremes for the visible data.
     *
     * @private
     * @function Highcharts.Series#getXExtremes
     * @param {Array<number>} xData
     * The data to inspect. Defaults to the current data within the visible
     * range.
     */
    Series.prototype.getXExtremes = function (xData) {
        return {
            min: arrayMin(xData),
            max: arrayMax(xData)
        };
    };
    /**
     * Calculate Y extremes for the visible data. The result is returned
     * as an object with `dataMin` and `dataMax` properties.
     *
     * @private
     * @function Highcharts.Series#getExtremes
     * @param {Array<number>} [yData]
     * The data to inspect. Defaults to the current data within the visible
     * range.
     * @param {boolean} [forceExtremesFromAll]
     * Force getting extremes of a total series data range.
     */
    Series.prototype.getExtremes = function (yData, forceExtremesFromAll) {
        var xAxis = this.xAxis, yAxis = this.yAxis, xData = this.processedXData || this.xData, activeYData = [], 
        // Handle X outside the viewed area. This does not work with
        // non-sorted data like scatter (#7639).
        shoulder = this.requireSorting ? this.cropShoulder : 0, positiveValuesOnly = yAxis ? yAxis.positiveValuesOnly : false;
        // #2117, need to compensate for log X axis
        var xExtremes, validValue, withinRange, x, y, i, j, xMin = 0, xMax = 0, activeCounter = 0;
        yData = yData || this.stackedYData || this.processedYData || [];
        var yDataLength = yData.length;
        if (xAxis) {
            xExtremes = xAxis.getExtremes();
            xMin = xExtremes.min;
            xMax = xExtremes.max;
        }
        for (i = 0; i < yDataLength; i++) {
            x = xData[i];
            y = yData[i];
            // For points within the visible range, including the first
            // point outside the visible range (#7061), consider y extremes.
            validValue = ((isNumber(y) || isArray(y)) &&
                ((y.length || y > 0) || !positiveValuesOnly));
            withinRange = (forceExtremesFromAll ||
                this.getExtremesFromAll ||
                this.options.getExtremesFromAll ||
                this.cropped ||
                !xAxis || // for colorAxis support
                ((xData[i + shoulder] || x) >= xMin &&
                    (xData[i - shoulder] || x) <= xMax));
            if (validValue && withinRange) {
                j = y.length;
                if (j) { // array, like ohlc or range data
                    while (j--) {
                        if (isNumber(y[j])) { // #7380, #11513
                            activeYData[activeCounter++] = y[j];
                        }
                    }
                }
                else {
                    activeYData[activeCounter++] = y;
                }
            }
        }
        var dataExtremes = {
            activeYData: activeYData,
            dataMin: arrayMin(activeYData),
            dataMax: arrayMax(activeYData)
        };
        fireEvent(this, 'afterGetExtremes', { dataExtremes: dataExtremes });
        return dataExtremes;
    };
    /**
     * Set the current data extremes as `dataMin` and `dataMax` on the
     * Series item. Use this only when the series properties should be
     * updated.
     *
     * @private
     * @function Highcharts.Series#applyExtremes
     */
    Series.prototype.applyExtremes = function () {
        var dataExtremes = this.getExtremes();
        /**
         * Contains the minimum value of the series' data point. Some series
         * types like `networkgraph` do not support this property as they
         * lack a `y`-value.
         * @name Highcharts.Series#dataMin
         * @type {number|undefined}
         * @readonly
         */
        this.dataMin = dataExtremes.dataMin;
        /**
         * Contains the maximum value of the series' data point. Some series
         * types like `networkgraph` do not support this property as they
         * lack a `y`-value.
         * @name Highcharts.Series#dataMax
         * @type {number|undefined}
         * @readonly
         */
        this.dataMax = dataExtremes.dataMax;
        return dataExtremes;
    };
    /**
     * Find and return the first non null point in the data
     *
     * @private
     * @function Highcharts.Series.getFirstValidPoint
     * @param {Array<Highcharts.PointOptionsType>} data
     * Array of options for points
     */
    Series.prototype.getFirstValidPoint = function (data) {
        var dataLength = data.length;
        var i = 0, firstPoint = null;
        while (firstPoint === null && i < dataLength) {
            firstPoint = data[i];
            i++;
        }
        return firstPoint;
    };
    /**
     * Translate data points from raw data values to chart specific
     * positioning data needed later in the `drawPoints` and `drawGraph`
     * functions. This function can be overridden in plugins and custom
     * series type implementations.
     *
     * @function Highcharts.Series#translate
     *
     * @emits Highcharts.Series#events:translate
     */
    Series.prototype.translate = function () {
        if (!this.processedXData) { // hidden series
            this.processData();
        }
        this.generatePoints();
        var series = this, options = series.options, stacking = options.stacking, xAxis = series.xAxis, categories = xAxis.categories, enabledDataSorting = series.enabledDataSorting, yAxis = series.yAxis, points = series.points, dataLength = points.length, pointPlacement = series.pointPlacementToXValue(), // #7860
        dynamicallyPlaced = Boolean(pointPlacement), threshold = options.threshold, stackThreshold = options.startFromThreshold ? threshold : 0, zoneAxis = this.zoneAxis || 'y';
        var i, plotX, lastPlotX, stackIndicator, closestPointRangePx = Number.MAX_VALUE;
        /**
         * Plotted coordinates need to be within a limited range. Drawing
         * too far outside the viewport causes various rendering issues
         * (#3201, #3923, #7555).
         * @private
         */
        function limitedRange(val) {
            return clamp(val, -1e5, 1e5);
        }
        // Translate each point
        for (i = 0; i < dataLength; i++) {
            var point = points[i], xValue = point.x;
            var pointStack = void 0, stackValues = void 0, yValue = point.y, yBottom = point.low;
            var stack = stacking && yAxis.stacking && yAxis.stacking.stacks[(series.negStacks &&
                yValue <
                    (stackThreshold ? 0 : threshold) ?
                '-' :
                '') + series.stackKey];
            if (yAxis.positiveValuesOnly &&
                !yAxis.validatePositiveValue(yValue) ||
                xAxis.positiveValuesOnly &&
                    !xAxis.validatePositiveValue(xValue)) {
                point.isNull = true;
            }
            /**
             * The translated X value for the point in terms of pixels. Relative
             * to the X axis position if the series has one, otherwise relative
             * to the plot area. Depending on the series type this value might
             * not be defined.
             * @name Highcharts.Point#plotX
             * @type {number|undefined}
             */
            point.plotX = plotX = correctFloat(// #5236
            // Get the plotX translation
            limitedRange(xAxis.translate(// #3923
            xValue, 0, 0, 0, 1, pointPlacement, this.type === 'flags')) // #3923
            );
            // Calculate the bottom y value for stacked series
            if (stacking &&
                series.visible &&
                stack &&
                stack[xValue]) {
                stackIndicator = series.getStackIndicator(stackIndicator, xValue, series.index);
                if (!point.isNull) {
                    pointStack = stack[xValue];
                    stackValues =
                        pointStack.points[stackIndicator.key];
                }
            }
            if (isArray(stackValues)) {
                yBottom = stackValues[0];
                yValue = stackValues[1];
                if (yBottom === stackThreshold &&
                    stackIndicator.key ===
                        stack[xValue].base) {
                    yBottom = pick((isNumber(threshold) && threshold), yAxis.min);
                }
                // #1200, #1232
                if (yAxis.positiveValuesOnly && yBottom <= 0) {
                    yBottom = null;
                }
                point.total = point.stackTotal = pointStack.total;
                point.percentage =
                    pointStack.total &&
                        (point.y / pointStack.total * 100);
                point.stackY = yValue;
                // Place the stack label
                // in case of variwide series (where widths of points are
                // different in most cases), stack labels are positioned
                // wrongly, so the call of the setOffset is omited here and
                // labels are correctly positioned later, at the end of the
                // variwide's translate function (#10962)
                if (!series.irregularWidths) {
                    pointStack.setOffset(series.pointXOffset || 0, series.barW || 0);
                }
            }
            // Set translated yBottom or remove it
            point.yBottom = defined(yBottom) ?
                limitedRange(yAxis.translate(yBottom, 0, 1, 0, 1)) :
                null;
            // General hook, used for Highcharts Stock compare and cumulative
            if (series.dataModify) {
                yValue = series.dataModify.modifyValue(yValue, i);
            }
            // Set the the plotY value, reset it for redraws
            // #3201
            point.plotY = void 0;
            if (isNumber(yValue)) {
                var translated = yAxis.translate(yValue, false, true, false, true);
                if (typeof translated !== 'undefined') {
                    /**
                     * The translated Y value for the point in terms of pixels.
                     * Relative to the Y axis position if the series has one,
                     * otherwise relative to the plot area. Depending on the
                     * series type this value might not be defined.
                     * @name Highcharts.Point#plotY
                     * @type {number|undefined}
                     */
                    point.plotY = limitedRange(translated);
                }
            }
            point.isInside = this.isPointInside(point);
            // Set client related positions for mouse tracking
            point.clientX = dynamicallyPlaced ?
                correctFloat(xAxis.translate(xValue, 0, 0, 0, 1, pointPlacement)) :
                plotX; // #1514, #5383, #5518
            // Negative points. For bubble charts, this means negative z
            // values (#9728)
            point.negative = point[zoneAxis] < (options[zoneAxis + 'Threshold'] ||
                threshold ||
                0);
            // some API data
            point.category = pick(categories && categories[point.x], point.x);
            // Determine auto enabling of markers (#3635, #5099)
            if (!point.isNull && point.visible !== false) {
                if (typeof lastPlotX !== 'undefined') {
                    closestPointRangePx = Math.min(closestPointRangePx, Math.abs(plotX - lastPlotX));
                }
                lastPlotX = plotX;
            }
            // Find point zone
            point.zone = this.zones.length ? point.getZone() : void 0;
            // Animate new points with data sorting
            if (!point.graphic && series.group && enabledDataSorting) {
                point.isNew = true;
            }
        }
        series.closestPointRangePx = closestPointRangePx;
        fireEvent(this, 'afterTranslate');
    };
    /**
     * Return the series points with null points filtered out.
     *
     * @function Highcharts.Series#getValidPoints
     *
     * @param {Array<Highcharts.Point>} [points]
     * The points to inspect, defaults to {@link Series.points}.
     *
     * @param {boolean} [insideOnly=false]
     * Whether to inspect only the points that are inside the visible view.
     *
     * @param {boolean} [allowNull=false]
     * Whether to allow null points to pass as valid points.
     *
     * @return {Array<Highcharts.Point>}
     * The valid points.
     */
    Series.prototype.getValidPoints = function (points, insideOnly, allowNull) {
        var chart = this.chart;
        // #3916, #5029, #5085
        return (points || this.points || []).filter(function (point) {
            if (insideOnly && !chart.isInsidePlot(point.plotX, point.plotY, { inverted: chart.inverted })) {
                return false;
            }
            return point.visible !== false &&
                (allowNull || !point.isNull);
        });
    };
    /**
     * Get the clipping for the series. Could be called for a series to
     * initiate animating the clip or to set the final clip (only width
     * and x).
     *
     * @private
     * @function Highcharts.Series#getClip
     */
    Series.prototype.getClipBox = function () {
        var _a = this, chart = _a.chart, xAxis = _a.xAxis, yAxis = _a.yAxis;
        // If no axes on the series, use global clipBox
        var seriesBox = merge(chart.clipBox);
        // Otherwise, use clipBox.width which is corrected for plotBorderWidth
        // and clipOffset
        if (xAxis && xAxis.len !== chart.plotSizeX) {
            seriesBox.width = xAxis.len;
        }
        if (yAxis && yAxis.len !== chart.plotSizeY) {
            seriesBox.height = yAxis.len;
        }
        return seriesBox;
    };
    /**
     * Get the shared clip key, creating it if it doesn't exist.
     *
     * @private
     * @function Highcharts.Series#getSharedClipKey
     */
    Series.prototype.getSharedClipKey = function () {
        this.sharedClipKey = (this.options.xAxis || 0) + ',' +
            (this.options.yAxis || 0);
        return this.sharedClipKey;
    };
    /**
     * Set the clipping for the series. For animated series the clip is later
     * modified.
     *
     * @private
     * @function Highcharts.Series#setClip
     */
    Series.prototype.setClip = function () {
        var _a = this, chart = _a.chart, group = _a.group, markerGroup = _a.markerGroup, sharedClips = chart.sharedClips, renderer = chart.renderer, clipBox = this.getClipBox(), sharedClipKey = this.getSharedClipKey(); // #4526
        var clipRect = sharedClips[sharedClipKey];
        // If a clipping rectangle for the same set of axes does not exist,
        // create it
        if (!clipRect) {
            sharedClips[sharedClipKey] = clipRect = renderer.clipRect(clipBox);
            // When setting chart size, or when the series is rendered again before
            // starting animating, in compliance to a responsive rule
        }
        else {
            clipRect.animate(clipBox);
        }
        if (group) {
            // When clip is false, reset to no clip after animation
            group.clip(this.options.clip === false ? void 0 : clipRect);
        }
        // Unclip temporary animation clip
        if (markerGroup) {
            markerGroup.clip();
        }
    };
    /**
     * Animate in the series. Called internally twice. First with the `init`
     * parameter set to true, which sets up the initial state of the
     * animation. Then when ready, it is called with the `init` parameter
     * undefined, in order to perform the actual animation.
     *
     * @function Highcharts.Series#animate
     *
     * @param {boolean} [init]
     * Initialize the animation.
     */
    Series.prototype.animate = function (init) {
        var _a = this, chart = _a.chart, group = _a.group, markerGroup = _a.markerGroup, inverted = chart.inverted, animation = animObject(this.options.animation), 
        // The key for temporary animation clips
        animationClipKey = [
            this.getSharedClipKey(),
            animation.duration,
            animation.easing,
            animation.defer
        ].join(',');
        var animationClipRect = chart.sharedClips[animationClipKey], markerAnimationClipRect = chart.sharedClips[animationClipKey + 'm'];
        // Initialize the animation. Set up the clipping rectangle.
        if (init && group) {
            var clipBox = this.getClipBox();
            // Create temporary animation clips
            if (!animationClipRect) {
                clipBox.width = 0;
                if (inverted) {
                    clipBox.x = chart.plotHeight;
                }
                animationClipRect = chart.renderer.clipRect(clipBox);
                chart.sharedClips[animationClipKey] = animationClipRect;
                var markerClipBox = {
                    // Include the width of the first marker
                    x: inverted ? (chart.plotSizeX || 0) + 99 : -99,
                    y: inverted ? -chart.plotLeft : -chart.plotTop,
                    width: 99,
                    height: inverted ? chart.chartWidth : chart.chartHeight
                };
                markerAnimationClipRect = chart.renderer.clipRect(markerClipBox);
                chart.sharedClips[animationClipKey + 'm'] = markerAnimationClipRect;
            }
            else {
                // When height changes during animation, typically due to
                // responsive settings
                animationClipRect.attr('height', clipBox.height);
            }
            group.clip(animationClipRect);
            if (markerGroup) {
                markerGroup.clip(markerAnimationClipRect);
            }
            // Run the animation
        }
        else if (animationClipRect &&
            // Only first series in this pane
            !animationClipRect.hasClass('highcharts-animating')) {
            var finalBox = this.getClipBox(), step_1 = animation.step;
            // Only do this when there are actually markers
            if (markerGroup && markerGroup.element.childNodes.length) {
                // To provide as smooth animation as possible, update the marker
                // group clipping in steps of the main group animation
                animation.step = function (val, fx) {
                    if (step_1) {
                        step_1.apply(fx, arguments);
                    }
                    if (markerAnimationClipRect &&
                        markerAnimationClipRect.element) {
                        markerAnimationClipRect.attr(fx.prop, fx.prop === 'width' ? val + 99 : val);
                    }
                };
            }
            animationClipRect
                .addClass('highcharts-animating')
                .animate(finalBox, animation);
        }
    };
    /**
     * This runs after animation to land on the final plot clipping.
     *
     * @private
     * @function Highcharts.Series#afterAnimate
     *
     * @emits Highcharts.Series#event:afterAnimate
     */
    Series.prototype.afterAnimate = function () {
        var _this = this;
        this.setClip();
        // Destroy temporary clip rectangles that are no longer in use
        objectEach(this.chart.sharedClips, function (clip, key, sharedClips) {
            if (clip && !_this.chart.container.querySelector("[clip-path=\"url(#" + clip.id + ")\"]")) {
                clip.destroy();
                delete sharedClips[key];
            }
        });
        this.finishedAnimating = true;
        fireEvent(this, 'afterAnimate');
    };
    /**
     * Draw the markers for line-like series types, and columns or other
     * graphical representation for {@link Point} objects for other series
     * types. The resulting element is typically stored as
     * {@link Point.graphic}, and is created on the first call and updated
     * and moved on subsequent calls.
     *
     * @function Highcharts.Series#drawPoints
     */
    Series.prototype.drawPoints = function () {
        var series = this, points = series.points, chart = series.chart, options = series.options, seriesMarkerOptions = options.marker, markerGroup = (series[series.specialGroup] ||
            series.markerGroup), xAxis = series.xAxis, globallyEnabled = pick(seriesMarkerOptions.enabled, !xAxis || xAxis.isRadial ? true : null, 
        // Use larger or equal as radius is null in bubbles (#6321)
        series.closestPointRangePx >= (seriesMarkerOptions.enabledThreshold *
            seriesMarkerOptions.radius));
        var i, point, graphic, verb, pointMarkerOptions, hasPointMarker, markerAttribs;
        if (seriesMarkerOptions.enabled !== false ||
            series._hasPointMarkers) {
            for (i = 0; i < points.length; i++) {
                point = points[i];
                graphic = point.graphic;
                verb = graphic ? 'animate' : 'attr';
                pointMarkerOptions = point.marker || {};
                hasPointMarker = !!point.marker;
                var shouldDrawMarker = ((globallyEnabled &&
                    typeof pointMarkerOptions.enabled === 'undefined') || pointMarkerOptions.enabled) && !point.isNull && point.visible !== false;
                // only draw the point if y is defined
                if (shouldDrawMarker) {
                    // Shortcuts
                    var symbol = pick(pointMarkerOptions.symbol, series.symbol, 'rect');
                    markerAttribs = series.markerAttribs(point, (point.selected && 'select'));
                    // Set starting position for point sliding animation.
                    if (series.enabledDataSorting) {
                        point.startXPos = xAxis.reversed ?
                            -(markerAttribs.width || 0) :
                            xAxis.width;
                    }
                    var isInside = point.isInside !== false;
                    if (graphic) { // update
                        // Since the marker group isn't clipped, each
                        // individual marker must be toggled
                        graphic[isInside ? 'show' : 'hide'](isInside)
                            .animate(markerAttribs);
                    }
                    else if (isInside &&
                        ((markerAttribs.width || 0) > 0 || point.hasImage)) {
                        /**
                         * The graphic representation of the point.
                         * Typically this is a simple shape, like a `rect`
                         * for column charts or `path` for line markers, but
                         * for some complex series types like boxplot or 3D
                         * charts, the graphic may be a `g` element
                         * containing other shapes. The graphic is generated
                         * the first time {@link Series#drawPoints} runs,
                         * and updated and moved on subsequent runs.
                         *
                         * @name Point#graphic
                         * @type {SVGElement}
                         */
                        point.graphic = graphic = chart.renderer
                            .symbol(symbol, markerAttribs.x, markerAttribs.y, markerAttribs.width, markerAttribs.height, hasPointMarker ?
                            pointMarkerOptions :
                            seriesMarkerOptions)
                            .add(markerGroup);
                        // Sliding animation for new points
                        if (series.enabledDataSorting &&
                            chart.hasRendered) {
                            graphic.attr({
                                x: point.startXPos
                            });
                            verb = 'animate';
                        }
                    }
                    if (graphic && verb === 'animate') { // update
                        // Since the marker group isn't clipped, each
                        // individual marker must be toggled
                        graphic[isInside ? 'show' : 'hide'](isInside)
                            .animate(markerAttribs);
                    }
                    // Presentational attributes
                    if (graphic && !chart.styledMode) {
                        graphic[verb](series.pointAttribs(point, (point.selected && 'select')));
                    }
                    if (graphic) {
                        graphic.addClass(point.getClassName(), true);
                    }
                }
                else if (graphic) {
                    point.graphic = graphic.destroy(); // #1269
                }
            }
        }
    };
    /**
     * Get non-presentational attributes for a point. Used internally for
     * both styled mode and classic. Can be overridden for different series
     * types.
     *
     * @see Series#pointAttribs
     *
     * @function Highcharts.Series#markerAttribs
     *
     * @param {Highcharts.Point} point
     * The Point to inspect.
     *
     * @param {string} [state]
     * The state, can be either `hover`, `select` or undefined.
     *
     * @return {Highcharts.SVGAttributes}
     * A hash containing those attributes that are not settable from CSS.
     */
    Series.prototype.markerAttribs = function (point, state) {
        var seriesOptions = this.options, seriesMarkerOptions = seriesOptions.marker, pointMarkerOptions = point.marker || {}, symbol = (pointMarkerOptions.symbol ||
            seriesMarkerOptions.symbol);
        var seriesStateOptions, pointStateOptions, radius = pick(pointMarkerOptions.radius, seriesMarkerOptions.radius);
        // Handle hover and select states
        if (state) {
            seriesStateOptions = seriesMarkerOptions.states[state];
            pointStateOptions = pointMarkerOptions.states &&
                pointMarkerOptions.states[state];
            radius = pick(pointStateOptions && pointStateOptions.radius, seriesStateOptions && seriesStateOptions.radius, radius + (seriesStateOptions && seriesStateOptions.radiusPlus ||
                0));
        }
        point.hasImage = symbol && symbol.indexOf('url') === 0;
        if (point.hasImage) {
            radius = 0; // and subsequently width and height is not set
        }
        var attribs = {
            // Math.floor for #1843:
            x: seriesOptions.crisp ?
                Math.floor(point.plotX - radius) :
                point.plotX - radius,
            y: point.plotY - radius
        };
        if (radius) {
            attribs.width = attribs.height = 2 * radius;
        }
        return attribs;
    };
    /**
     * Internal function to get presentational attributes for each point.
     * Unlike {@link Series#markerAttribs}, this function should return
     * those attributes that can also be set in CSS. In styled mode,
     * `pointAttribs` won't be called.
     *
     * @private
     * @function Highcharts.Series#pointAttribs
     *
     * @param {Highcharts.Point} [point]
     * The point instance to inspect.
     *
     * @param {string} [state]
     * The point state, can be either `hover`, `select` or 'normal'. If
     * undefined, normal state is assumed.
     *
     * @return {Highcharts.SVGAttributes}
     * The presentational attributes to be set on the point.
     */
    Series.prototype.pointAttribs = function (point, state) {
        var seriesMarkerOptions = this.options.marker, pointOptions = point && point.options, pointMarkerOptions = ((pointOptions && pointOptions.marker) || {}), pointColorOption = pointOptions && pointOptions.color, pointColor = point && point.color, zoneColor = point && point.zone && point.zone.color;
        var seriesStateOptions, pointStateOptions, color = this.color, fill, stroke, strokeWidth = pick(pointMarkerOptions.lineWidth, seriesMarkerOptions.lineWidth), opacity = 1;
        color = (pointColorOption ||
            zoneColor ||
            pointColor ||
            color);
        fill = (pointMarkerOptions.fillColor ||
            seriesMarkerOptions.fillColor ||
            color);
        stroke = (pointMarkerOptions.lineColor ||
            seriesMarkerOptions.lineColor ||
            color);
        // Handle hover and select states
        state = state || 'normal';
        if (state) {
            seriesStateOptions = (seriesMarkerOptions.states[state] || {});
            pointStateOptions = (pointMarkerOptions.states &&
                pointMarkerOptions.states[state]) || {};
            strokeWidth = pick(pointStateOptions.lineWidth, seriesStateOptions.lineWidth, strokeWidth + pick(pointStateOptions.lineWidthPlus, seriesStateOptions.lineWidthPlus, 0));
            fill = (pointStateOptions.fillColor ||
                seriesStateOptions.fillColor ||
                fill);
            stroke = (pointStateOptions.lineColor ||
                seriesStateOptions.lineColor ||
                stroke);
            opacity = pick(pointStateOptions.opacity, seriesStateOptions.opacity, opacity);
        }
        return {
            'stroke': stroke,
            'stroke-width': strokeWidth,
            'fill': fill,
            'opacity': opacity
        };
    };
    /**
     * Clear DOM objects and free up memory.
     *
     * @private
     * @function Highcharts.Series#destroy
     *
     * @emits Highcharts.Series#event:destroy
     */
    Series.prototype.destroy = function (keepEventsForUpdate) {
        var series = this, chart = series.chart, issue134 = /AppleWebKit\/533/.test(win.navigator.userAgent), data = series.data || [];
        var destroy, i, point, axis;
        // add event hook
        fireEvent(series, 'destroy', { keepEventsForUpdate: keepEventsForUpdate });
        // remove events
        this.removeEvents(keepEventsForUpdate);
        // erase from axes
        (series.axisTypes || []).forEach(function (AXIS) {
            axis = series[AXIS];
            if (axis && axis.series) {
                erase(axis.series, series);
                axis.isDirty = axis.forceRedraw = true;
            }
        });
        // remove legend items
        if (series.legendItem) {
            series.chart.legend.destroyItem(series);
        }
        // destroy all points with their elements
        i = data.length;
        while (i--) {
            point = data[i];
            if (point && point.destroy) {
                point.destroy();
            }
        }
        if (series.clips) {
            series.clips.forEach(function (clip) { return clip.destroy(); });
        }
        // Clear the animation timeout if we are destroying the series
        // during initial animation
        U.clearTimeout(series.animationTimeout);
        // Destroy all SVGElements associated to the series
        objectEach(series, function (val, prop) {
            // Survive provides a hook for not destroying
            if (val instanceof SVGElement && !val.survive) {
                // issue 134 workaround
                destroy = issue134 && prop === 'group' ?
                    'hide' :
                    'destroy';
                val[destroy]();
            }
        });
        // remove from hoverSeries
        if (chart.hoverSeries === series) {
            chart.hoverSeries = void 0;
        }
        erase(chart.series, series);
        chart.orderSeries();
        // clear all members
        objectEach(series, function (val, prop) {
            if (!keepEventsForUpdate || prop !== 'hcEvents') {
                delete series[prop];
            }
        });
    };
    /**
     * Clip the graphs into zones for colors and styling.
     *
     * @private
     * @function Highcharts.Series#applyZones
     */
    Series.prototype.applyZones = function () {
        var series = this, chart = this.chart, renderer = chart.renderer, zones = this.zones, clips = (this.clips || []), graph = this.graph, area = this.area, chartSizeMax = Math.max(chart.chartWidth, chart.chartHeight), axis = this[(this.zoneAxis || 'y') + 'Axis'], inverted = chart.inverted;
        var translatedFrom, translatedTo, clipAttr, extremes, reversed, horiz, pxRange, pxPosMin, pxPosMax, zoneArea, zoneGraph, ignoreZones = false;
        if (zones.length &&
            (graph || area) &&
            axis &&
            typeof axis.min !== 'undefined') {
            reversed = axis.reversed;
            horiz = axis.horiz;
            // The use of the Color Threshold assumes there are no gaps
            // so it is safe to hide the original graph and area
            // unless it is not waterfall series, then use showLine property
            // to set lines between columns to be visible (#7862)
            if (graph && !this.showLine) {
                graph.hide();
            }
            if (area) {
                area.hide();
            }
            // Create the clips
            extremes = axis.getExtremes();
            zones.forEach(function (threshold, i) {
                translatedFrom = reversed ?
                    (horiz ? chart.plotWidth : 0) :
                    (horiz ? 0 : (axis.toPixels(extremes.min) || 0));
                translatedFrom = clamp(pick(translatedTo, translatedFrom), 0, chartSizeMax);
                translatedTo = clamp(Math.round(axis.toPixels(pick(threshold.value, extremes.max), true) || 0), 0, chartSizeMax);
                if (ignoreZones) {
                    translatedFrom = translatedTo =
                        axis.toPixels(extremes.max);
                }
                pxRange = Math.abs(translatedFrom - translatedTo);
                pxPosMin = Math.min(translatedFrom, translatedTo);
                pxPosMax = Math.max(translatedFrom, translatedTo);
                if (axis.isXAxis) {
                    clipAttr = {
                        x: inverted ? pxPosMax : pxPosMin,
                        y: 0,
                        width: pxRange,
                        height: chartSizeMax
                    };
                    if (!horiz) {
                        clipAttr.x = chart.plotHeight - clipAttr.x;
                    }
                }
                else {
                    clipAttr = {
                        x: 0,
                        y: inverted ? pxPosMax : pxPosMin,
                        width: chartSizeMax,
                        height: pxRange
                    };
                    if (horiz) {
                        clipAttr.y = chart.plotWidth - clipAttr.y;
                    }
                }
                // VML SUPPPORT
                if (inverted && renderer.isVML) {
                    if (axis.isXAxis) {
                        clipAttr = {
                            x: 0,
                            y: reversed ? pxPosMin : pxPosMax,
                            height: clipAttr.width,
                            width: chart.chartWidth
                        };
                    }
                    else {
                        clipAttr = {
                            x: (clipAttr.y -
                                chart.plotLeft -
                                chart.spacingBox.x),
                            y: 0,
                            width: clipAttr.height,
                            height: chart.chartHeight
                        };
                    }
                }
                // END OF VML SUPPORT
                if (clips[i]) {
                    clips[i].animate(clipAttr);
                }
                else {
                    clips[i] = renderer.clipRect(clipAttr);
                }
                // when no data, graph zone is not applied and after setData
                // clip was ignored. As a result, it should be applied each
                // time.
                zoneArea = series['zone-area-' + i];
                zoneGraph = series['zone-graph-' + i];
                if (graph && zoneGraph) {
                    zoneGraph.clip(clips[i]);
                }
                if (area && zoneArea) {
                    zoneArea.clip(clips[i]);
                }
                // if this zone extends out of the axis, ignore the others
                ignoreZones = threshold.value > extremes.max;
                // Clear translatedTo for indicators
                if (series.resetZones && translatedTo === 0) {
                    translatedTo = void 0;
                }
            });
            this.clips = clips;
        }
        else if (series.visible) {
            // If zones were removed, restore graph and area
            if (graph) {
                graph.show(true);
            }
            if (area) {
                area.show(true);
            }
        }
    };
    /**
     * Initialize and perform group inversion on series.group and
     * series.markerGroup.
     *
     * @private
     * @function Highcharts.Series#invertGroups
     */
    Series.prototype.invertGroups = function (inverted) {
        var series = this, chart = series.chart;
        /**
         * @private
         */
        function setInvert() {
            ['group', 'markerGroup'].forEach(function (groupName) {
                if (series[groupName]) {
                    // VML/HTML needs explicit attributes for flipping
                    if (chart.renderer.isVML) {
                        series[groupName].attr({
                            width: series.yAxis.len,
                            height: series.xAxis.len
                        });
                    }
                    series[groupName].width = series.yAxis.len;
                    series[groupName].height = series.xAxis.len;
                    // If inverted polar, don't invert series group
                    series[groupName].invert(series.isRadialSeries ? false : inverted);
                }
            });
        }
        // Pie, go away (#1736)
        if (!series.xAxis) {
            return;
        }
        // A fixed size is needed for inversion to work
        series.eventsToUnbind.push(addEvent(chart, 'resize', setInvert));
        // Do it now
        setInvert();
        // On subsequent render and redraw, just do setInvert without
        // setting up events again
        series.invertGroups = setInvert;
    };
    /**
     * General abstraction for creating plot groups like series.group,
     * series.dataLabelsGroup and series.markerGroup. On subsequent calls,
     * the group will only be adjusted to the updated plot size.
     *
     * @private
     * @function Highcharts.Series#plotGroup
     */
    Series.prototype.plotGroup = function (prop, name, visibility, zIndex, parent) {
        var group = this[prop];
        var isNew = !group, attrs = {
            visibility: visibility,
            zIndex: zIndex || 0.1 // IE8 and pointer logic use this
        };
        // Avoid setting undefined opacity, or in styled mode
        if (typeof this.opacity !== 'undefined' &&
            !this.chart.styledMode && this.state !== 'inactive' // #13719
        ) {
            attrs.opacity = this.opacity;
        }
        // Generate it on first call
        if (isNew) {
            this[prop] = group = this.chart.renderer
                .g()
                .add(parent);
        }
        // Add the class names, and replace existing ones as response to
        // Series.update (#6660)
        group.addClass(('highcharts-' + name +
            ' highcharts-series-' + this.index +
            ' highcharts-' + this.type + '-series ' +
            (defined(this.colorIndex) ?
                'highcharts-color-' + this.colorIndex + ' ' :
                '') +
            (this.options.className || '') +
            (group.hasClass('highcharts-tracker') ?
                ' highcharts-tracker' :
                '')), true);
        // Place it on first and subsequent (redraw) calls
        group.attr(attrs)[isNew ? 'attr' : 'animate'](this.getPlotBox());
        return group;
    };
    /**
     * Get the translation and scale for the plot area of this series.
     *
     * @function Highcharts.Series#getPlotBox
     */
    Series.prototype.getPlotBox = function () {
        var chart = this.chart;
        var xAxis = this.xAxis, yAxis = this.yAxis;
        // Swap axes for inverted (#2339)
        if (chart.inverted) {
            xAxis = yAxis;
            yAxis = this.xAxis;
        }
        return {
            translateX: xAxis ? xAxis.left : chart.plotLeft,
            translateY: yAxis ? yAxis.top : chart.plotTop,
            scaleX: 1,
            scaleY: 1
        };
    };
    /**
     * Removes the event handlers attached previously with addEvents.
     * @private
     * @function Highcharts.Series#removeEvents
     */
    Series.prototype.removeEvents = function (keepEventsForUpdate) {
        var series = this;
        if (!keepEventsForUpdate) {
            // remove all events
            removeEvent(series);
        }
        if (series.eventsToUnbind.length) {
            // remove only internal events for proper update
            // #12355 - solves problem with multiple destroy events
            series.eventsToUnbind.forEach(function (unbind) {
                unbind();
            });
            series.eventsToUnbind.length = 0;
        }
    };
    /**
     * Render the graph and markers. Called internally when first rendering
     * and later when redrawing the chart. This function can be extended in
     * plugins, but normally shouldn't be called directly.
     *
     * @function Highcharts.Series#render
     *
     * @emits Highcharts.Series#event:afterRender
     */
    Series.prototype.render = function () {
        var series = this, chart = series.chart, options = series.options, animOptions = animObject(options.animation), visibility = series.visible ?
            'inherit' : 'hidden', // #2597
        zIndex = options.zIndex, hasRendered = series.hasRendered, chartSeriesGroup = chart.seriesGroup, inverted = chart.inverted;
        // Animation doesn't work in IE8 quirks when the group div is
        // hidden, and looks bad in other oldIE
        var animDuration = (!series.finishedAnimating && chart.renderer.isSVG) ?
            animOptions.duration : 0;
        fireEvent(this, 'render');
        // the group
        var group = series.plotGroup('group', 'series', visibility, zIndex, chartSeriesGroup);
        series.markerGroup = series.plotGroup('markerGroup', 'markers', visibility, zIndex, chartSeriesGroup);
        // Initial clipping, applies to columns etc. (#3839).
        if (options.clip !== false) {
            series.setClip();
        }
        // Initialize the animation
        if (series.animate && animDuration) {
            series.animate(true);
        }
        // SVGRenderer needs to know this before drawing elements (#1089,
        // #1795)
        group.inverted = pick(series.invertible, series.isCartesian) ?
            inverted : false;
        // Draw the graph if any
        if (series.drawGraph) {
            series.drawGraph();
            series.applyZones();
        }
        // Draw the points
        if (series.visible) {
            series.drawPoints();
        }
        // Draw the data labels
        if (series.drawDataLabels) {
            series.drawDataLabels();
        }
        // In pie charts, slices are added to the DOM, but actual rendering
        // is postponed until labels reserved their space
        if (series.redrawPoints) {
            series.redrawPoints();
        }
        // draw the mouse tracking area
        if (series.drawTracker &&
            series.options.enableMouseTracking !== false) {
            series.drawTracker();
        }
        // Handle inverted series and tracker groups
        series.invertGroups(inverted);
        // Run the animation
        if (series.animate && animDuration) {
            series.animate();
        }
        // Call the afterAnimate function on animation complete (but don't
        // overwrite the animation.complete option which should be available
        // to the user).
        if (!hasRendered) {
            // Additional time if defer is defined before afterAnimate
            // will be triggered
            if (animDuration && animOptions.defer) {
                animDuration += animOptions.defer;
            }
            series.animationTimeout = syncTimeout(function () {
                series.afterAnimate();
            }, animDuration || 0);
        }
        // Means data is in accordance with what you see
        series.isDirty = false;
        // (See #322) series.isDirty = series.isDirtyData = false; // means
        // data is in accordance with what you see
        series.hasRendered = true;
        fireEvent(series, 'afterRender');
    };
    /**
     * Redraw the series. This function is called internally from
     * `chart.redraw` and normally shouldn't be called directly.
     * @private
     * @function Highcharts.Series#redraw
     */
    Series.prototype.redraw = function () {
        var series = this, chart = series.chart, 
        // cache it here as it is set to false in render, but used after
        wasDirty = series.isDirty || series.isDirtyData, group = series.group, xAxis = series.xAxis, yAxis = series.yAxis;
        // reposition on resize
        if (group) {
            if (chart.inverted) {
                group.attr({
                    width: chart.plotWidth,
                    height: chart.plotHeight
                });
            }
            group.animate({
                translateX: pick(xAxis && xAxis.left, chart.plotLeft),
                translateY: pick(yAxis && yAxis.top, chart.plotTop)
            });
        }
        series.translate();
        series.render();
        if (wasDirty) { // #3868, #3945
            delete this.kdTree;
        }
    };
    /**
     * Find the nearest point from a pointer event. This applies to series that
     * use k-d-trees to get the nearest point. Native pointer events must be
     * normalized using `Pointer.normalize`, that adds `chartX` and `chartY`
     * properties.
     *
     * @sample highcharts/demo/synchronized-charts
     *         Synchronized charts with tooltips
     *
     * @function Highcharts.Series#searchPoint
     *
     * @param {Highcharts.PointerEvent} e
     *        The normalized pointer event
     * @param {boolean} [compareX=false]
     *        Search only by the X value, not Y
     *
     * @return {Point|undefined}
     *        The closest point to the pointer event
     */
    Series.prototype.searchPoint = function (e, compareX) {
        var series = this, xAxis = series.xAxis, yAxis = series.yAxis, inverted = series.chart.inverted;
        return this.searchKDTree({
            clientX: inverted ?
                xAxis.len - e.chartY + xAxis.pos :
                e.chartX - xAxis.pos,
            plotY: inverted ?
                yAxis.len - e.chartX + yAxis.pos :
                e.chartY - yAxis.pos
        }, compareX, e);
    };
    /**
     * Build the k-d-tree that is used by mouse and touch interaction to get
     * the closest point. Line-like series typically have a one-dimensional
     * tree where points are searched along the X axis, while scatter-like
     * series typically search in two dimensions, X and Y.
     *
     * @private
     * @function Highcharts.Series#buildKDTree
     */
    Series.prototype.buildKDTree = function (e) {
        // Prevent multiple k-d-trees from being built simultaneously
        // (#6235)
        this.buildingKdTree = true;
        var series = this, dimensions = series.options.findNearestPointBy
            .indexOf('y') > -1 ? 2 : 1;
        /**
         * Internal function
         * @private
         */
        function _kdtree(points, depth, dimensions) {
            var length = points && points.length;
            var axis, median;
            if (length) {
                // alternate between the axis
                axis = series.kdAxisArray[depth % dimensions];
                // sort point array
                points.sort(function (a, b) {
                    return a[axis] - b[axis];
                });
                median = Math.floor(length / 2);
                // build and return nod
                return {
                    point: points[median],
                    left: _kdtree(points.slice(0, median), depth + 1, dimensions),
                    right: _kdtree(points.slice(median + 1), depth + 1, dimensions)
                };
            }
        }
        /**
         * Start the recursive build process with a clone of the points
         * array and null points filtered out. (#3873)
         * @private
         */
        function startRecursive() {
            series.kdTree = _kdtree(series.getValidPoints(null, 
            // For line-type series restrict to plot area, but
            // column-type series not (#3916, #4511)
            !series.directTouch), dimensions, dimensions);
            series.buildingKdTree = false;
        }
        delete series.kdTree;
        // For testing tooltips, don't build async. Also if touchstart, we
        // may be dealing with click events on mobile, so don't delay
        // (#6817).
        syncTimeout(startRecursive, series.options.kdNow || (e && e.type === 'touchstart') ? 0 : 1);
    };
    /**
     * @private
     * @function Highcharts.Series#searchKDTree
     */
    Series.prototype.searchKDTree = function (point, compareX, e) {
        var series = this, kdX = this.kdAxisArray[0], kdY = this.kdAxisArray[1], kdComparer = compareX ? 'distX' : 'dist', kdDimensions = series.options.findNearestPointBy
            .indexOf('y') > -1 ? 2 : 1;
        /**
         * Set the one and two dimensional distance on the point object.
         * @private
         */
        function setDistance(p1, p2) {
            var x = (defined(p1[kdX]) &&
                defined(p2[kdX])) ?
                Math.pow(p1[kdX] - p2[kdX], 2) :
                null, y = (defined(p1[kdY]) &&
                defined(p2[kdY])) ?
                Math.pow(p1[kdY] - p2[kdY], 2) :
                null, r = (x || 0) + (y || 0);
            p2.dist = defined(r) ? Math.sqrt(r) : Number.MAX_VALUE;
            p2.distX = defined(x) ? Math.sqrt(x) : Number.MAX_VALUE;
        }
        /**
         * @private
         */
        function _search(search, tree, depth, dimensions) {
            var point = tree.point, axis = series.kdAxisArray[depth % dimensions];
            var nPoint1, nPoint2, ret = point;
            setDistance(search, point);
            // Pick side based on distance to splitting point
            var tdist = search[axis] - point[axis], sideA = tdist < 0 ? 'left' : 'right', sideB = tdist < 0 ? 'right' : 'left';
            // End of tree
            if (tree[sideA]) {
                nPoint1 = _search(search, tree[sideA], depth + 1, dimensions);
                ret = (nPoint1[kdComparer] <
                    ret[kdComparer] ?
                    nPoint1 :
                    point);
            }
            if (tree[sideB]) {
                // compare distance to current best to splitting point to
                // decide wether to check side B or not
                if (Math.sqrt(tdist * tdist) < ret[kdComparer]) {
                    nPoint2 = _search(search, tree[sideB], depth + 1, dimensions);
                    ret = (nPoint2[kdComparer] <
                        ret[kdComparer] ?
                        nPoint2 :
                        ret);
                }
            }
            return ret;
        }
        if (!this.kdTree && !this.buildingKdTree) {
            this.buildKDTree(e);
        }
        if (this.kdTree) {
            return _search(point, this.kdTree, kdDimensions, kdDimensions);
        }
    };
    /**
     * @private
     * @function Highcharts.Series#pointPlacementToXValue
     */
    Series.prototype.pointPlacementToXValue = function () {
        var _a = this, _b = _a.options, pointPlacement = _b.pointPlacement, pointRange = _b.pointRange, axis = _a.xAxis;
        var factor = pointPlacement;
        // Point placement is relative to each series pointRange (#5889)
        if (factor === 'between') {
            factor = axis.reversed ? -0.5 : 0.5; // #11955
        }
        return isNumber(factor) ?
            factor * (pointRange || axis.pointRange) :
            0;
    };
    /**
     * @private
     * @function Highcharts.Series#isPointInside
     */
    Series.prototype.isPointInside = function (point) {
        var _a = this, chart = _a.chart, xAxis = _a.xAxis, yAxis = _a.yAxis, isInside = (typeof point.plotY !== 'undefined' &&
            typeof point.plotX !== 'undefined' &&
            point.plotY >= 0 &&
            point.plotY <= (yAxis ? yAxis.len : chart.plotHeight) &&
            point.plotX >= 0 &&
            point.plotX <= (xAxis ? xAxis.len : chart.plotWidth));
        return isInside;
    };
    /**
     * Draw the tracker object that sits above all data labels and markers to
     * track mouse events on the graph or points. For the line type charts
     * the tracker uses the same graphPath, but with a greater stroke width
     * for better control.
     * @private
     */
    Series.prototype.drawTracker = function () {
        var series = this, options = series.options, trackByArea = options.trackByArea, trackerPath = [].concat(trackByArea ?
            series.areaPath :
            series.graphPath), 
        // trackerPathLength = trackerPath.length,
        chart = series.chart, pointer = chart.pointer, renderer = chart.renderer, snap = chart.options.tooltip.snap, tracker = series.tracker, onMouseOver = function (e) {
            if (chart.hoverSeries !== series) {
                series.onMouseOver();
            }
        }, 
        /*
         * Empirical lowest possible opacities for TRACKER_FILL for an
         * element to stay invisible but clickable
         * IE6: 0.002
         * IE7: 0.002
         * IE8: 0.002
         * IE9: 0.00000000001 (unlimited)
         * IE10: 0.0001 (exporting only)
         * FF: 0.00000000001 (unlimited)
         * Chrome: 0.000001
         * Safari: 0.000001
         * Opera: 0.00000000001 (unlimited)
         */
        TRACKER_FILL = 'rgba(192,192,192,' + (svg ? 0.0001 : 0.002) + ')';
        var i;
        // Draw the tracker
        if (tracker) {
            tracker.attr({ d: trackerPath });
        }
        else if (series.graph) { // create
            series.tracker = renderer.path(trackerPath)
                .attr({
                visibility: series.visible ? 'visible' : 'hidden',
                zIndex: 2
            })
                .addClass(trackByArea ?
                'highcharts-tracker-area' :
                'highcharts-tracker-line')
                .add(series.group);
            if (!chart.styledMode) {
                series.tracker.attr({
                    'stroke-linecap': 'round',
                    'stroke-linejoin': 'round',
                    stroke: TRACKER_FILL,
                    fill: trackByArea ? TRACKER_FILL : 'none',
                    'stroke-width': series.graph.strokeWidth() +
                        (trackByArea ? 0 : 2 * snap)
                });
            }
            // The tracker is added to the series group, which is clipped, but
            // is covered by the marker group. So the marker group also needs to
            // capture events.
            [
                series.tracker,
                series.markerGroup,
                series.dataLabelsGroup
            ].forEach(function (tracker) {
                if (tracker) {
                    tracker.addClass('highcharts-tracker')
                        .on('mouseover', onMouseOver)
                        .on('mouseout', function (e) {
                        pointer.onTrackerMouseOut(e);
                    });
                    if (options.cursor && !chart.styledMode) {
                        tracker.css({ cursor: options.cursor });
                    }
                    if (hasTouch) {
                        tracker.on('touchstart', onMouseOver);
                    }
                }
            });
        }
        fireEvent(this, 'afterDrawTracker');
    };
    /**
     * Add a point to the series after render time. The point can be added at
     * the end, or by giving it an X value, to the start or in the middle of the
     * series.
     *
     * @sample highcharts/members/series-addpoint-append/
     *         Append point
     * @sample highcharts/members/series-addpoint-append-and-shift/
     *         Append and shift
     * @sample highcharts/members/series-addpoint-x-and-y/
     *         Both X and Y values given
     * @sample highcharts/members/series-addpoint-pie/
     *         Append pie slice
     * @sample stock/members/series-addpoint/
     *         Append 100 points in Highcharts Stock
     * @sample stock/members/series-addpoint-shift/
     *         Append and shift in Highcharts Stock
     * @sample maps/members/series-addpoint/
     *         Add a point in Highmaps
     *
     * @function Highcharts.Series#addPoint
     *
     * @param {Highcharts.PointOptionsType} options
     *        The point options. If options is a single number, a point with
     *        that y value is appended to the series. If it is an array, it will
     *        be interpreted as x and y values respectively. If it is an
     *        object, advanced options as outlined under `series.data` are
     *        applied.
     *
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart after the point is added. When adding
     *        more than one point, it is highly recommended that the redraw
     *        option be set to false, and instead {@link Chart#redraw} is
     *        explicitly called after the adding of points is finished.
     *        Otherwise, the chart will redraw after adding each point.
     *
     * @param {boolean} [shift=false]
     *        If true, a point is shifted off the start of the series as one is
     *        appended to the end.
     *
     * @param {boolean|Partial<Highcharts.AnimationOptionsObject>} [animation]
     *        Whether to apply animation, and optionally animation
     *        configuration.
     *
     * @param {boolean} [withEvent=true]
     *        Used internally, whether to fire the series `addPoint` event.
     *
     * @emits Highcharts.Series#event:addPoint
     */
    Series.prototype.addPoint = function (options, redraw, shift, animation, withEvent) {
        var series = this, seriesOptions = series.options, data = series.data, chart = series.chart, xAxis = series.xAxis, names = xAxis && xAxis.hasNames && xAxis.names, dataOptions = seriesOptions.data, xData = series.xData;
        var isInTheMiddle, i;
        // Optional redraw, defaults to true
        redraw = pick(redraw, true);
        // Get options and push the point to xData, yData and series.options. In
        // series.generatePoints the Point instance will be created on demand
        // and pushed to the series.data array.
        var point = { series: series };
        series.pointClass.prototype.applyOptions.apply(point, [options]);
        var x = point.x;
        // Get the insertion point
        i = xData.length;
        if (series.requireSorting && x < xData[i - 1]) {
            isInTheMiddle = true;
            while (i && xData[i - 1] > x) {
                i--;
            }
        }
        // Insert undefined item
        series.updateParallelArrays(point, 'splice', i, 0, 0);
        // Update it
        series.updateParallelArrays(point, i);
        if (names && point.name) {
            names[x] = point.name;
        }
        dataOptions.splice(i, 0, options);
        if (isInTheMiddle ||
            // When processedData is present we need to splice an empty slot
            // into series.data, otherwise generatePoints won't pick it up.
            series.processedData) {
            series.data.splice(i, 0, null);
            series.processData();
        }
        // Generate points to be added to the legend (#1329)
        if (seriesOptions.legendType === 'point') {
            series.generatePoints();
        }
        // Shift the first point off the parallel arrays
        if (shift) {
            if (data[0] && data[0].remove) {
                data[0].remove(false);
            }
            else {
                data.shift();
                series.updateParallelArrays(point, 'shift');
                dataOptions.shift();
            }
        }
        // Fire event
        if (withEvent !== false) {
            fireEvent(series, 'addPoint', { point: point });
        }
        // redraw
        series.isDirty = true;
        series.isDirtyData = true;
        if (redraw) {
            chart.redraw(animation); // Animation is set anyway on redraw, #5665
        }
    };
    /**
     * Remove a point from the series. Unlike the
     * {@link Highcharts.Point#remove} method, this can also be done on a point
     * that is not instanciated because it is outside the view or subject to
     * Highcharts Stock data grouping.
     *
     * @sample highcharts/members/series-removepoint/
     *         Remove cropped point
     *
     * @function Highcharts.Series#removePoint
     *
     * @param {number} i
     *        The index of the point in the {@link Highcharts.Series.data|data}
     *        array.
     *
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart after the point is added. When
     *        removing more than one point, it is highly recommended that the
     *        `redraw` option be set to `false`, and instead {@link
     *        Highcharts.Chart#redraw} is explicitly called after the adding of
     *        points is finished.
     *
     * @param {boolean|Partial<Highcharts.AnimationOptionsObject>} [animation]
     *        Whether and optionally how the series should be animated.
     *
     * @emits Highcharts.Point#event:remove
     */
    Series.prototype.removePoint = function (i, redraw, animation) {
        var series = this, data = series.data, point = data[i], points = series.points, chart = series.chart, remove = function () {
            if (points && points.length === data.length) { // #4935
                points.splice(i, 1);
            }
            data.splice(i, 1);
            series.options.data.splice(i, 1);
            series.updateParallelArrays(point || { series: series }, 'splice', i, 1);
            if (point) {
                point.destroy();
            }
            // redraw
            series.isDirty = true;
            series.isDirtyData = true;
            if (redraw) {
                chart.redraw();
            }
        };
        setAnimation(animation, chart);
        redraw = pick(redraw, true);
        // Fire the event with a default handler of removing the point
        if (point) {
            point.firePointEvent('remove', null, remove);
        }
        else {
            remove();
        }
    };
    /**
     * Remove a series and optionally redraw the chart.
     *
     * @sample highcharts/members/series-remove/
     *         Remove first series from a button
     *
     * @function Highcharts.Series#remove
     *
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart or wait for an explicit call to
     *        {@link Highcharts.Chart#redraw}.
     *
     * @param {boolean|Partial<Highcharts.AnimationOptionsObject>} [animation]
     *        Whether to apply animation, and optionally animation
     *        configuration.
     *
     * @param {boolean} [withEvent=true]
     *        Used internally, whether to fire the series `remove` event.
     *
     * @emits Highcharts.Series#event:remove
     */
    Series.prototype.remove = function (redraw, animation, withEvent, keepEvents) {
        var series = this, chart = series.chart;
        /**
         * @private
         */
        function remove() {
            // Destroy elements
            series.destroy(keepEvents);
            // Redraw
            chart.isDirtyLegend = chart.isDirtyBox = true;
            chart.linkSeries();
            if (pick(redraw, true)) {
                chart.redraw(animation);
            }
        }
        // Fire the event with a default handler of removing the point
        if (withEvent !== false) {
            fireEvent(series, 'remove', null, remove);
        }
        else {
            remove();
        }
    };
    /**
     * Update the series with a new set of options. For a clean and precise
     * handling of new options, all methods and elements from the series are
     * removed, and it is initialized from scratch. Therefore, this method is
     * more performance expensive than some other utility methods like {@link
     * Series#setData} or {@link Series#setVisible}.
     *
     * Note that `Series.update` may mutate the passed `data` options.
     *
     * @sample highcharts/members/series-update/
     *         Updating series options
     * @sample maps/members/series-update/
     *         Update series options in Highmaps
     *
     * @function Highcharts.Series#update
     *
     * @param {Highcharts.SeriesOptionsType} options
     *        New options that will be merged with the series' existing options.
     *
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart after the series is altered. If doing
     *        more operations on the chart, it is a good idea to set redraw to
     *        false and call {@link Chart#redraw} after.
     *
     * @emits Highcharts.Series#event:update
     * @emits Highcharts.Series#event:afterUpdate
     */
    Series.prototype.update = function (options, redraw) {
        options = cleanRecursively(options, this.userOptions);
        fireEvent(this, 'update', { options: options });
        var series = this, chart = series.chart, 
        // must use user options when changing type because series.options
        // is merged in with type specific plotOptions
        oldOptions = series.userOptions, initialType = series.initialType || series.type, plotOptions = chart.options.plotOptions, initialSeriesProto = seriesTypes[initialType].prototype, groups = [
            'group',
            'markerGroup',
            'dataLabelsGroup',
            'transformGroup'
        ], 
        // Animation must be enabled when calling update before the initial
        // animation has first run. This happens when calling update
        // directly after chart initialization, or when applying responsive
        // rules (#6912).
        animation = series.finishedAnimating && { animation: false }, kinds = {};
        var seriesOptions, n, preserve = [
            'eventOptions',
            'navigatorSeries',
            'baseSeries'
        ], newType = (options.type ||
            oldOptions.type ||
            chart.options.chart.type);
        var keepPoints = !(
        // Indicators, histograms etc recalculate the data. It should be
        // possible to omit this.
        this.hasDerivedData ||
            // New type requires new point classes
            (newType && newType !== this.type) ||
            // New options affecting how the data points are built
            typeof options.pointStart !== 'undefined' ||
            typeof options.pointInterval !== 'undefined' ||
            typeof options.relativeXValue !== 'undefined' ||
            options.joinBy ||
            options.mapData || // #11636
            // Changes to data grouping requires new points in new group
            series.hasOptionChanged('dataGrouping') ||
            series.hasOptionChanged('pointStart') ||
            series.hasOptionChanged('pointInterval') ||
            series.hasOptionChanged('pointIntervalUnit') ||
            series.hasOptionChanged('keys'));
        newType = newType || initialType;
        if (keepPoints) {
            preserve.push('data', 'isDirtyData', 'points', 'processedXData', 'processedYData', 'xIncrement', 'cropped', '_hasPointMarkers', '_hasPointLabels', 'clips', // #15420
            // Networkgraph (#14397)
            'nodes', 'layout', 
            // Treemap
            'level', 
            // Map specific, consider moving it to series-specific preserve-
            // properties (#10617)
            'mapMap', 'mapData', 'minY', 'maxY', 'minX', 'maxX');
            if (options.visible !== false) {
                preserve.push('area', 'graph');
            }
            series.parallelArrays.forEach(function (key) {
                preserve.push(key + 'Data');
            });
            if (options.data) {
                // setData uses dataSorting options so we need to update them
                // earlier
                if (options.dataSorting) {
                    extend(series.options.dataSorting, options.dataSorting);
                }
                this.setData(options.data, false);
            }
        }
        // Do the merge, with some forced options
        options = merge(oldOptions, animation, {
            // When oldOptions.index is null it should't be cleared.
            // Otherwise navigator series will have wrong indexes (#10193).
            index: typeof oldOptions.index === 'undefined' ?
                series.index : oldOptions.index,
            pointStart: pick(
            // when updating from blank (#7933)
            (plotOptions &&
                plotOptions.series &&
                plotOptions.series.pointStart), oldOptions.pointStart, 
            // when updating after addPoint
            series.xData[0])
        }, (!keepPoints && { data: series.options.data }), options);
        // Merge does not merge arrays, but replaces them. Since points were
        // updated, `series.options.data` has correct merged options, use it:
        if (keepPoints && options.data) {
            options.data = series.options.data;
        }
        // Make sure preserved properties are not destroyed (#3094)
        preserve = groups.concat(preserve);
        preserve.forEach(function (prop) {
            preserve[prop] = series[prop];
            delete series[prop];
        });
        var casting = false;
        if (seriesTypes[newType]) {
            casting = newType !== series.type;
            // Destroy the series and delete all properties, it will be
            // reinserted within the `init` call below
            series.remove(false, false, false, true);
            if (casting) {
                // Modern browsers including IE11
                if (Object.setPrototypeOf) {
                    Object.setPrototypeOf(series, seriesTypes[newType].prototype);
                    // Legacy (IE < 11)
                }
                else {
                    var ownEvents = Object.hasOwnProperty.call(series, 'hcEvents') && series.hcEvents;
                    for (n in initialSeriesProto) { // eslint-disable-line guard-for-in
                        series[n] = void 0;
                    }
                    // Reinsert all methods and properties from the new type
                    // prototype (#2270, #3719).
                    extend(series, seriesTypes[newType].prototype);
                    // The events are tied to the prototype chain, don't copy if
                    // they're not the series' own
                    if (ownEvents) {
                        series.hcEvents = ownEvents;
                    }
                    else {
                        delete series.hcEvents;
                    }
                }
            }
        }
        else {
            error(17, true, chart, { missingModuleFor: newType });
        }
        // Re-register groups (#3094) and other preserved properties
        preserve.forEach(function (prop) {
            series[prop] = preserve[prop];
        });
        series.init(chart, options);
        // Remove particular elements of the points. Check `series.options`
        // because we need to consider the options being set on plotOptions as
        // well.
        if (keepPoints && this.points) {
            seriesOptions = series.options;
            // What kind of elements to destroy
            if (seriesOptions.visible === false) {
                kinds.graphic = 1;
                kinds.dataLabel = 1;
            }
            else if (!series._hasPointLabels) {
                var marker = seriesOptions.marker, dataLabels = seriesOptions.dataLabels;
                if (marker && (marker.enabled === false ||
                    (oldOptions.marker && oldOptions.marker.symbol) !==
                        marker.symbol // #10870, #15946
                )) {
                    kinds.graphic = 1;
                }
                if (dataLabels &&
                    dataLabels.enabled === false) {
                    kinds.dataLabel = 1;
                }
            }
            this.points.forEach(function (point) {
                if (point && point.series) {
                    point.resolveColor();
                    // Destroy elements in order to recreate based on updated
                    // series options.
                    if (Object.keys(kinds).length) {
                        point.destroyElements(kinds);
                    }
                    if (seriesOptions.showInLegend === false &&
                        point.legendItem) {
                        chart.legend.destroyItem(point);
                    }
                }
            }, this);
        }
        series.initialType = initialType;
        chart.linkSeries(); // Links are lost in series.remove (#3028)
        // #15383: Fire updatedData if the type has changed to keep linked
        // series such as indicators updated
        if (casting && series.linkedSeries.length) {
            series.isDirtyData = true;
        }
        fireEvent(this, 'afterUpdate');
        if (pick(redraw, true)) {
            chart.redraw(keepPoints ? void 0 : false);
        }
    };
    /**
     * Used from within series.update
     * @private
     */
    Series.prototype.setName = function (name) {
        this.name = this.options.name = this.userOptions.name = name;
        this.chart.isDirtyLegend = true;
    };
    /**
     * Check if the option has changed.
     * @private
     */
    Series.prototype.hasOptionChanged = function (optionName) {
        var chart = this.chart, option = this.options[optionName], plotOptions = chart.options.plotOptions, oldOption = this.userOptions[optionName];
        if (oldOption) {
            return option !== oldOption;
        }
        return option !==
            pick(plotOptions &&
                plotOptions[this.type] &&
                plotOptions[this.type][optionName], plotOptions &&
                plotOptions.series &&
                plotOptions.series[optionName], option);
    };
    /**
     * Runs on mouse over the series graphical items.
     *
     * @function Highcharts.Series#onMouseOver
     * @emits Highcharts.Series#event:mouseOver
     */
    Series.prototype.onMouseOver = function () {
        var series = this, chart = series.chart, hoverSeries = chart.hoverSeries, pointer = chart.pointer;
        pointer.setHoverChartIndex();
        // set normal state to previous series
        if (hoverSeries && hoverSeries !== series) {
            hoverSeries.onMouseOut();
        }
        // trigger the event, but to save processing time,
        // only if defined
        if (series.options.events.mouseOver) {
            fireEvent(series, 'mouseOver');
        }
        // hover this
        series.setState('hover');
        /**
         * Contains the original hovered series.
         *
         * @name Highcharts.Chart#hoverSeries
         * @type {Highcharts.Series|null}
         */
        chart.hoverSeries = series;
    };
    /**
     * Runs on mouse out of the series graphical items.
     *
     * @function Highcharts.Series#onMouseOut
     *
     * @emits Highcharts.Series#event:mouseOut
     */
    Series.prototype.onMouseOut = function () {
        // trigger the event only if listeners exist
        var series = this, options = series.options, chart = series.chart, tooltip = chart.tooltip, hoverPoint = chart.hoverPoint;
        // #182, set to null before the mouseOut event fires
        chart.hoverSeries = null;
        // trigger mouse out on the point, which must be in this series
        if (hoverPoint) {
            hoverPoint.onMouseOut();
        }
        // fire the mouse out event
        if (series && options.events.mouseOut) {
            fireEvent(series, 'mouseOut');
        }
        // hide the tooltip
        if (tooltip &&
            !series.stickyTracking &&
            (!tooltip.shared || series.noSharedTooltip)) {
            tooltip.hide();
        }
        // Reset all inactive states
        chart.series.forEach(function (s) {
            s.setState('', true);
        });
    };
    /**
     * Set the state of the series. Called internally on mouse interaction
     * operations, but it can also be called directly to visually
     * highlight a series.
     *
     * @function Highcharts.Series#setState
     *
     * @param {Highcharts.SeriesStateValue|""} [state]
     *        The new state, can be either `'hover'`, `'inactive'`, `'select'`,
     *        or `''` (an empty string), `'normal'` or `undefined` to set to
     *        normal state.
     * @param {boolean} [inherit]
     *        Determines if state should be inherited by points too.
     */
    Series.prototype.setState = function (state, inherit) {
        var series = this, options = series.options, graph = series.graph, inactiveOtherPoints = options.inactiveOtherPoints, stateOptions = options.states, 
        // By default a quick animation to hover/inactive,
        // slower to un-hover
        stateAnimation = pick((stateOptions[state || 'normal'] &&
            stateOptions[state || 'normal'].animation), series.chart.options.chart.animation);
        var attribs, lineWidth = options.lineWidth, i = 0, opacity = options.opacity;
        state = state || '';
        if (series.state !== state) {
            // Toggle class names
            [
                series.group,
                series.markerGroup,
                series.dataLabelsGroup
            ].forEach(function (group) {
                if (group) {
                    // Old state
                    if (series.state) {
                        group.removeClass('highcharts-series-' + series.state);
                    }
                    // New state
                    if (state) {
                        group.addClass('highcharts-series-' + state);
                    }
                }
            });
            series.state = state;
            if (!series.chart.styledMode) {
                if (stateOptions[state] &&
                    stateOptions[state].enabled === false) {
                    return;
                }
                if (state) {
                    lineWidth = (stateOptions[state].lineWidth ||
                        lineWidth + (stateOptions[state].lineWidthPlus || 0)); // #4035
                    opacity = pick(stateOptions[state].opacity, opacity);
                }
                if (graph && !graph.dashstyle) {
                    attribs = {
                        'stroke-width': lineWidth
                    };
                    // Animate the graph stroke-width.
                    graph.animate(attribs, stateAnimation);
                    while (series['zone-graph-' + i]) {
                        series['zone-graph-' + i].animate(attribs, stateAnimation);
                        i = i + 1;
                    }
                }
                // For some types (pie, networkgraph, sankey) opacity is
                // resolved on a point level
                if (!inactiveOtherPoints) {
                    [
                        series.group,
                        series.markerGroup,
                        series.dataLabelsGroup,
                        series.labelBySeries
                    ].forEach(function (group) {
                        if (group) {
                            group.animate({
                                opacity: opacity
                            }, stateAnimation);
                        }
                    });
                }
            }
        }
        // Don't loop over points on a series that doesn't apply inactive state
        // to siblings markers (e.g. line, column)
        if (inherit && inactiveOtherPoints && series.points) {
            series.setAllPointsToState(state || void 0);
        }
    };
    /**
     * Set the state for all points in the series.
     *
     * @function Highcharts.Series#setAllPointsToState
     *
     * @private
     *
     * @param {string} [state]
     *        Can be either `hover` or undefined to set to normal state.
     */
    Series.prototype.setAllPointsToState = function (state) {
        this.points.forEach(function (point) {
            if (point.setState) {
                point.setState(state);
            }
        });
    };
    /**
     * Show or hide the series.
     *
     * @function Highcharts.Series#setVisible
     *
     * @param {boolean} [visible]
     * True to show the series, false to hide. If undefined, the visibility is
     * toggled.
     *
     * @param {boolean} [redraw=true]
     * Whether to redraw the chart after the series is altered. If doing more
     * operations on the chart, it is a good idea to set redraw to false and
     * call {@link Chart#redraw|chart.redraw()} after.
     *
     * @emits Highcharts.Series#event:hide
     * @emits Highcharts.Series#event:show
     */
    Series.prototype.setVisible = function (vis, redraw) {
        var series = this, chart = series.chart, legendItem = series.legendItem, ignoreHiddenSeries = chart.options.chart.ignoreHiddenSeries, oldVisibility = series.visible;
        // if called without an argument, toggle visibility
        series.visible =
            vis =
                series.options.visible =
                    series.userOptions.visible =
                        typeof vis === 'undefined' ? !oldVisibility : vis; // #5618
        var showOrHide = vis ? 'show' : 'hide';
        // show or hide elements
        [
            'group',
            'dataLabelsGroup',
            'markerGroup',
            'tracker',
            'tt'
        ].forEach(function (key) {
            if (series[key]) {
                series[key][showOrHide]();
            }
        });
        // hide tooltip (#1361)
        if (chart.hoverSeries === series ||
            (chart.hoverPoint && chart.hoverPoint.series) === series) {
            series.onMouseOut();
        }
        if (legendItem) {
            chart.legend.colorizeItem(series, vis);
        }
        // rescale or adapt to resized chart
        series.isDirty = true;
        // in a stack, all other series are affected
        if (series.options.stacking) {
            chart.series.forEach(function (otherSeries) {
                if (otherSeries.options.stacking && otherSeries.visible) {
                    otherSeries.isDirty = true;
                }
            });
        }
        // show or hide linked series
        series.linkedSeries.forEach(function (otherSeries) {
            otherSeries.setVisible(vis, false);
        });
        if (ignoreHiddenSeries) {
            chart.isDirtyBox = true;
        }
        fireEvent(series, showOrHide);
        if (redraw !== false) {
            chart.redraw();
        }
    };
    /**
     * Show the series if hidden.
     *
     * @sample highcharts/members/series-hide/
     *         Toggle visibility from a button
     *
     * @function Highcharts.Series#show
     * @emits Highcharts.Series#event:show
     */
    Series.prototype.show = function () {
        this.setVisible(true);
    };
    /**
     * Hide the series if visible. If the
     * [chart.ignoreHiddenSeries](https://api.highcharts.com/highcharts/chart.ignoreHiddenSeries)
     * option is true, the chart is redrawn without this series.
     *
     * @sample highcharts/members/series-hide/
     *         Toggle visibility from a button
     *
     * @function Highcharts.Series#hide
     * @emits Highcharts.Series#event:hide
     */
    Series.prototype.hide = function () {
        this.setVisible(false);
    };
    /**
     * Select or unselect the series. This means its
     * {@link Highcharts.Series.selected|selected}
     * property is set, the checkbox in the legend is toggled and when selected,
     * the series is returned by the {@link Highcharts.Chart#getSelectedSeries}
     * function.
     *
     * @sample highcharts/members/series-select/
     *         Select a series from a button
     *
     * @function Highcharts.Series#select
     *
     * @param {boolean} [selected]
     * True to select the series, false to unselect. If undefined, the selection
     * state is toggled.
     *
     * @emits Highcharts.Series#event:select
     * @emits Highcharts.Series#event:unselect
     */
    Series.prototype.select = function (selected) {
        var series = this;
        series.selected =
            selected =
                this.options.selected = (typeof selected === 'undefined' ?
                    !series.selected :
                    selected);
        if (series.checkbox) {
            series.checkbox.checked = selected;
        }
        fireEvent(series, selected ? 'select' : 'unselect');
    };
    /**
     * Checks if a tooltip should be shown for a given point.
     *
     * @private
     */
    Series.prototype.shouldShowTooltip = function (plotX, plotY, options) {
        if (options === void 0) { options = {}; }
        options.series = this;
        options.visiblePlotOnly = true;
        return this.chart.isInsidePlot(plotX, plotY, options);
    };
    Series.defaultOptions = SeriesDefaults;
    return Series;
}());
extend(Series.prototype, {
    axisTypes: ['xAxis', 'yAxis'],
    coll: 'series',
    colorCounter: 0,
    cropShoulder: 1,
    directTouch: false,
    drawLegendSymbol: LegendSymbol.drawLineMarker,
    isCartesian: true,
    kdAxisArray: ['clientX', 'plotY'],
    // each point's x and y values are stored in this.xData and this.yData:
    parallelArrays: ['x', 'y'],
    pointClass: Point,
    requireSorting: true,
    // requires the data to be sorted:
    sorted: true
});
/* *
 *
 *  Registry
 *
 * */
SeriesRegistry.series = Series;
/* *
 *
 *  Default Export
 *
 * */
export default Series;
/* *
 *
 *  API Declarations
 *
 * */
/**
 * This is a placeholder type of the possible series options for
 * [Highcharts](../highcharts/series), [Highcharts Stock](../highstock/series),
 * [Highmaps](../highmaps/series), and [Gantt](../gantt/series).
 *
 * In TypeScript is this dynamically generated to reference all possible types
 * of series options.
 *
 * @ignore-declaration
 * @typedef {Highcharts.SeriesOptions|Highcharts.Dictionary<*>} Highcharts.SeriesOptionsType
 */
/**
 * Options for `dataSorting`.
 *
 * @interface Highcharts.DataSortingOptionsObject
 * @since 8.0.0
 */ /**
* Enable or disable data sorting for the series.
* @name Highcharts.DataSortingOptionsObject#enabled
* @type {boolean|undefined}
*/ /**
* Whether to allow matching points by name in an update.
* @name Highcharts.DataSortingOptionsObject#matchByName
* @type {boolean|undefined}
*/ /**
* Determines what data value should be used to sort by.
* @name Highcharts.DataSortingOptionsObject#sortKey
* @type {string|undefined}
*/
/**
 * Function callback when a series has been animated.
 *
 * @callback Highcharts.SeriesAfterAnimateCallbackFunction
 *
 * @param {Highcharts.Series} this
 *        The series where the event occured.
 *
 * @param {Highcharts.SeriesAfterAnimateEventObject} event
 *        Event arguments.
 */
/**
 * Event information regarding completed animation of a series.
 *
 * @interface Highcharts.SeriesAfterAnimateEventObject
 */ /**
* Animated series.
* @name Highcharts.SeriesAfterAnimateEventObject#target
* @type {Highcharts.Series}
*/ /**
* Event type.
* @name Highcharts.SeriesAfterAnimateEventObject#type
* @type {"afterAnimate"}
*/
/**
 * Function callback when the checkbox next to the series' name in the legend is
 * clicked.
 *
 * @callback Highcharts.SeriesCheckboxClickCallbackFunction
 *
 * @param {Highcharts.Series} this
 *        The series where the event occured.
 *
 * @param {Highcharts.SeriesCheckboxClickEventObject} event
 *        Event arguments.
 */
/**
 * Event information regarding check of a series box.
 *
 * @interface Highcharts.SeriesCheckboxClickEventObject
 */ /**
* Whether the box has been checked.
* @name Highcharts.SeriesCheckboxClickEventObject#checked
* @type {boolean}
*/ /**
* Related series.
* @name Highcharts.SeriesCheckboxClickEventObject#item
* @type {Highcharts.Series}
*/ /**
* Related series.
* @name Highcharts.SeriesCheckboxClickEventObject#target
* @type {Highcharts.Series}
*/ /**
* Event type.
* @name Highcharts.SeriesCheckboxClickEventObject#type
* @type {"checkboxClick"}
*/
/**
 * Function callback when a series is clicked. Return false to cancel toogle
 * actions.
 *
 * @callback Highcharts.SeriesClickCallbackFunction
 *
 * @param {Highcharts.Series} this
 *        The series where the event occured.
 *
 * @param {Highcharts.SeriesClickEventObject} event
 *        Event arguments.
 */
/**
 * Common information for a click event on a series.
 *
 * @interface Highcharts.SeriesClickEventObject
 * @extends global.Event
 */ /**
* Nearest point on the graph.
* @name Highcharts.SeriesClickEventObject#point
* @type {Highcharts.Point}
*/
/**
 * Gets fired when the series is hidden after chart generation time, either by
 * clicking the legend item or by calling `.hide()`.
 *
 * @callback Highcharts.SeriesHideCallbackFunction
 *
 * @param {Highcharts.Series} this
 *        The series where the event occured.
 *
 * @param {global.Event} event
 *        The event that occured.
 */
/**
 * The SVG value used for the `stroke-linecap` and `stroke-linejoin` of a line
 * graph.
 *
 * @typedef {"butt"|"round"|"square"|string} Highcharts.SeriesLinecapValue
 */
/**
 * Gets fired when the legend item belonging to the series is clicked. The
 * default action is to toggle the visibility of the series. This can be
 * prevented by returning `false` or calling `event.preventDefault()`.
 *
 * @callback Highcharts.SeriesLegendItemClickCallbackFunction
 *
 * @param {Highcharts.Series} this
 *        The series where the event occured.
 *
 * @param {Highcharts.SeriesLegendItemClickEventObject} event
 *        The event that occured.
 */
/**
 * Information about the event.
 *
 * @interface Highcharts.SeriesLegendItemClickEventObject
 */ /**
* Related browser event.
* @name Highcharts.SeriesLegendItemClickEventObject#browserEvent
* @type {global.PointerEvent}
*/ /**
* Prevent the default action of toggle the visibility of the series.
* @name Highcharts.SeriesLegendItemClickEventObject#preventDefault
* @type {Function}
*/ /**
* Related series.
* @name Highcharts.SeriesCheckboxClickEventObject#target
* @type {Highcharts.Series}
*/ /**
* Event type.
* @name Highcharts.SeriesCheckboxClickEventObject#type
* @type {"checkboxClick"}
*/
/**
 * Gets fired when the mouse leaves the graph.
 *
 * @callback Highcharts.SeriesMouseOutCallbackFunction
 *
 * @param {Highcharts.Series} this
 *        Series where the event occured.
 *
 * @param {global.PointerEvent} event
 *        Event that occured.
 */
/**
 * Gets fired when the mouse enters the graph.
 *
 * @callback Highcharts.SeriesMouseOverCallbackFunction
 *
 * @param {Highcharts.Series} this
 *        Series where the event occured.
 *
 * @param {global.PointerEvent} event
 *        Event that occured.
 */
/**
 * Translation and scale for the plot area of a series.
 *
 * @interface Highcharts.SeriesPlotBoxObject
 */ /**
* @name Highcharts.SeriesPlotBoxObject#scaleX
* @type {number}
*/ /**
* @name Highcharts.SeriesPlotBoxObject#scaleY
* @type {number}
*/ /**
* @name Highcharts.SeriesPlotBoxObject#translateX
* @type {number}
*/ /**
* @name Highcharts.SeriesPlotBoxObject#translateY
* @type {number}
*/
/**
 * Gets fired when the series is shown after chart generation time, either by
 * clicking the legend item or by calling `.show()`.
 *
 * @callback Highcharts.SeriesShowCallbackFunction
 *
 * @param {Highcharts.Series} this
 *        Series where the event occured.
 *
 * @param {global.Event} event
 *        Event that occured.
 */
/**
 * Possible key values for the series state options.
 *
 * @typedef {"hover"|"inactive"|"normal"|"select"} Highcharts.SeriesStateValue
 */
''; // detach doclets above
/* *
 *
 *  API Options
 *
 * */
/**
 * Series options for specific data and the data itself. In TypeScript you
 * have to cast the series options to specific series types, to get all
 * possible options for a series.
 *
 * @example
 * // TypeScript example
 * Highcharts.chart('container', {
 *     series: [{
 *         color: '#06C',
 *         data: [[0, 1], [2, 3]]
 *     } as Highcharts.SeriesLineOptions ]
 * });
 *
 * @type      {Array<*>}
 * @apioption series
 */
/**
 * An id for the series. This can be used after render time to get a pointer
 * to the series object through `chart.get()`.
 *
 * @sample {highcharts} highcharts/plotoptions/series-id/
 *         Get series by id
 *
 * @type      {string}
 * @since     1.2.0
 * @apioption series.id
 */
/**
 * The index of the series in the chart, affecting the internal index in the
 * `chart.series` array, the visible Z index as well as the order in the
 * legend.
 *
 * @type      {number}
 * @since     2.3.0
 * @apioption series.index
 */
/**
 * The sequential index of the series in the legend.
 *
 * @see [legend.reversed](#legend.reversed),
 *      [yAxis.reversedStacks](#yAxis.reversedStacks)
 *
 * @sample {highcharts|highstock} highcharts/series/legendindex/
 *         Legend in opposite order
 *
 * @type      {number}
 * @apioption series.legendIndex
 */
/**
 * The name of the series as shown in the legend, tooltip etc.
 *
 * @sample {highcharts} highcharts/series/name/
 *         Series name
 * @sample {highmaps} maps/demo/category-map/
 *         Series name
 *
 * @type      {string}
 * @apioption series.name
 */
/**
 * This option allows grouping series in a stacked chart. The stack option
 * can be a string or anything else, as long as the grouped series' stack
 * options match each other after conversion into a string.
 *
 * @sample {highcharts} highcharts/series/stack/
 *         Stacked and grouped columns
 *
 * @type      {number|string}
 * @since     2.1
 * @product   highcharts highstock
 * @apioption series.stack
 */
/**
 * The type of series, for example `line` or `column`. By default, the
 * series type is inherited from [chart.type](#chart.type), so unless the
 * chart is a combination of series types, there is no need to set it on the
 * series level.
 *
 * @sample {highcharts} highcharts/series/type/
 *         Line and column in the same chart
 * @sample highcharts/series/type-dynamic/
 *         Dynamic types with button selector
 * @sample {highmaps} maps/demo/mapline-mappoint/
 *         Multiple types in the same map
 *
 * @type      {string}
 * @apioption series.type
 */
/**
 * When using dual or multiple x axes, this number defines which xAxis the
 * particular series is connected to. It refers to either the
 * {@link #xAxis.id|axis id}
 * or the index of the axis in the xAxis array, with 0 being the first.
 *
 * @type      {number|string}
 * @default   0
 * @product   highcharts highstock
 * @apioption series.xAxis
 */
/**
 * When using dual or multiple y axes, this number defines which yAxis the
 * particular series is connected to. It refers to either the
 * {@link #yAxis.id|axis id}
 * or the index of the axis in the yAxis array, with 0 being the first.
 *
 * @sample {highcharts} highcharts/series/yaxis/
 *         Apply the column series to the secondary Y axis
 *
 * @type      {number|string}
 * @default   0
 * @product   highcharts highstock
 * @apioption series.yAxis
 */
/**
 * Define the visual z index of the series.
 *
 * @sample {highcharts} highcharts/plotoptions/series-zindex-default/
 *         With no z index, the series defined last are on top
 * @sample {highcharts} highcharts/plotoptions/series-zindex/
 *         With a z index, the series with the highest z index is on top
 * @sample {highstock} highcharts/plotoptions/series-zindex-default/
 *         With no z index, the series defined last are on top
 * @sample {highstock} highcharts/plotoptions/series-zindex/
 *         With a z index, the series with the highest z index is on top
 *
 * @type      {number}
 * @product   highcharts highstock
 * @apioption series.zIndex
 */
''; // include precedent doclets in transpilat
