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
import AST from '../Renderer/HTML/AST.js';
import A from '../Animation/AnimationUtilities.js';
var animObject = A.animObject;
import D from '../DefaultOptions.js';
var defaultOptions = D.defaultOptions;
import F from '../FormatUtilities.js';
var format = F.format;
import U from '../Utilities.js';
var addEvent = U.addEvent, defined = U.defined, erase = U.erase, extend = U.extend, fireEvent = U.fireEvent, getNestedProperty = U.getNestedProperty, isArray = U.isArray, isFunction = U.isFunction, isNumber = U.isNumber, isObject = U.isObject, merge = U.merge, objectEach = U.objectEach, pick = U.pick, syncTimeout = U.syncTimeout, removeEvent = U.removeEvent, uniqueKey = U.uniqueKey;
/* eslint-disable no-invalid-this, valid-jsdoc */
/* *
 *
 *  Class
 *
 * */
/**
 * The Point object. The point objects are generated from the `series.data`
 * configuration objects or raw numbers. They can be accessed from the
 * `Series.points` array. Other ways to instantiate points are through {@link
 * Highcharts.Series#addPoint} or {@link Highcharts.Series#setData}.
 *
 * @class
 * @name Highcharts.Point
 */
var Point = /** @class */ (function () {
    function Point() {
        /* *
         *
         *  Properties
         *
         * */
        /**
         * For categorized axes this property holds the category name for the
         * point. For other axes it holds the X value.
         *
         * @name Highcharts.Point#category
         * @type {string}
         */
        this.category = void 0;
        /**
         * The point's current color index, used in styled mode instead of
         * `color`. The color index is inserted in class names used for styling.
         *
         * @name Highcharts.Point#colorIndex
         * @type {number}
         */
        this.colorIndex = void 0;
        this.formatPrefix = 'point';
        this.id = void 0;
        this.isNull = false;
        /**
         * The name of the point. The name can be given as the first position of the
         * point configuration array, or as a `name` property in the configuration:
         *
         * @example
         * // Array config
         * data: [
         *     ['John', 1],
         *     ['Jane', 2]
         * ]
         *
         * // Object config
         * data: [{
         *        name: 'John',
         *        y: 1
         * }, {
         *     name: 'Jane',
         *     y: 2
         * }]
         *
         * @name Highcharts.Point#name
         * @type {string}
         */
        this.name = void 0;
        /**
         * The point's options as applied in the initial configuration, or
         * extended through `Point.update`.
         *
         * In TypeScript you have to extend `PointOptionsObject` via an
         * additional interface to allow custom data options:
         *
         * ```
         * declare interface PointOptionsObject {
         *     customProperty: string;
         * }
         * ```
         *
         * @name Highcharts.Point#options
         * @type {Highcharts.PointOptionsObject}
         */
        this.options = void 0;
        /**
         * The percentage for points in a stacked series or pies.
         *
         * @name Highcharts.Point#percentage
         * @type {number|undefined}
         */
        this.percentage = void 0;
        this.selected = false;
        /**
         * The series object associated with the point.
         *
         * @name Highcharts.Point#series
         * @type {Highcharts.Series}
         */
        this.series = void 0;
        /**
         * The total of values in either a stack for stacked series, or a pie in a
         * pie series.
         *
         * @name Highcharts.Point#total
         * @type {number|undefined}
         */
        this.total = void 0;
        /**
         * For certain series types, like pie charts, where individual points can
         * be shown or hidden.
         *
         * @name Highcharts.Point#visible
         * @type {boolean}
         * @default true
         */
        this.visible = true;
        this.x = void 0;
    }
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Animate SVG elements associated with the point.
     *
     * @private
     * @function Highcharts.Point#animateBeforeDestroy
     */
    Point.prototype.animateBeforeDestroy = function () {
        var point = this, animateParams = { x: point.startXPos, opacity: 0 }, graphicalProps = point.getGraphicalProps();
        graphicalProps.singular.forEach(function (prop) {
            var isDataLabel = prop === 'dataLabel';
            point[prop] = point[prop].animate(isDataLabel ? {
                x: point[prop].startXPos,
                y: point[prop].startYPos,
                opacity: 0
            } : animateParams);
        });
        graphicalProps.plural.forEach(function (plural) {
            point[plural].forEach(function (item) {
                if (item.element) {
                    item.animate(extend({ x: point.startXPos }, (item.startYPos ? {
                        x: item.startXPos,
                        y: item.startYPos
                    } : {})));
                }
            });
        });
    };
    /**
     * Apply the options containing the x and y data and possible some extra
     * properties. Called on point init or from point.update.
     *
     * @private
     * @function Highcharts.Point#applyOptions
     *
     * @param {Highcharts.PointOptionsType} options
     *        The point options as defined in series.data.
     *
     * @param {number} [x]
     *        Optionally, the x value.
     *
     * @return {Highcharts.Point}
     *         The Point instance.
     */
    Point.prototype.applyOptions = function (options, x) {
        var point = this, series = point.series, pointValKey = series.options.pointValKey || series.pointValKey;
        options = Point.prototype.optionsToObject.call(this, options);
        // copy options directly to point
        extend(point, options);
        point.options = point.options ?
            extend(point.options, options) :
            options;
        // Since options are copied into the Point instance, some accidental
        // options must be shielded (#5681)
        if (options.group) {
            delete point.group;
        }
        if (options.dataLabels) {
            delete point.dataLabels;
        }
        /**
         * The y value of the point.
         * @name Highcharts.Point#y
         * @type {number|undefined}
         */
        // For higher dimension series types. For instance, for ranges, point.y
        // is mapped to point.low.
        if (pointValKey) {
            point.y = Point.prototype.getNestedProperty.call(point, pointValKey);
        }
        point.isNull = pick(point.isValid && !point.isValid(), point.x === null || !isNumber(point.y)); // #3571, check for NaN
        point.formatPrefix = point.isNull ? 'null' : 'point'; // #9233, #10874
        // The point is initially selected by options (#5777)
        if (point.selected) {
            point.state = 'select';
        }
        /**
         * The x value of the point.
         * @name Highcharts.Point#x
         * @type {number}
         */
        // If no x is set by now, get auto incremented value. All points must
        // have an x value, however the y value can be null to create a gap in
        // the series
        if ('name' in point &&
            typeof x === 'undefined' &&
            series.xAxis &&
            series.xAxis.hasNames) {
            point.x = series.xAxis.nameToX(point);
        }
        if (typeof point.x === 'undefined' && series) {
            if (typeof x === 'undefined') {
                point.x = series.autoIncrement();
            }
            else {
                point.x = x;
            }
        }
        else if (isNumber(options.x) && series.options.relativeXValue) {
            point.x = series.autoIncrement(options.x);
        }
        return point;
    };
    /**
     * Destroy a point to clear memory. Its reference still stays in
     * `series.data`.
     *
     * @private
     * @function Highcharts.Point#destroy
     */
    Point.prototype.destroy = function () {
        var point = this, series = point.series, chart = series.chart, dataSorting = series.options.dataSorting, hoverPoints = chart.hoverPoints, globalAnimation = point.series.chart.renderer.globalAnimation, animation = animObject(globalAnimation);
        var prop;
        /**
         * Allow to call after animation.
         * @private
         */
        function destroyPoint() {
            // Remove all events and elements
            if (point.graphic || point.dataLabel || point.dataLabels) {
                removeEvent(point);
                point.destroyElements();
            }
            for (prop in point) { // eslint-disable-line guard-for-in
                point[prop] = null;
            }
        }
        if (point.legendItem) { // pies have legend items
            chart.legend.destroyItem(point);
        }
        if (hoverPoints) {
            point.setState();
            erase(hoverPoints, point);
            if (!hoverPoints.length) {
                chart.hoverPoints = null;
            }
        }
        if (point === chart.hoverPoint) {
            point.onMouseOut();
        }
        // Remove properties after animation
        if (!dataSorting || !dataSorting.enabled) {
            destroyPoint();
        }
        else {
            this.animateBeforeDestroy();
            syncTimeout(destroyPoint, animation.duration);
        }
        chart.pointCount--;
    };
    /**
     * Destroy SVG elements associated with the point.
     *
     * @private
     * @function Highcharts.Point#destroyElements
     * @param {Highcharts.Dictionary<number>} [kinds]
     */
    Point.prototype.destroyElements = function (kinds) {
        var point = this, props = point.getGraphicalProps(kinds);
        props.singular.forEach(function (prop) {
            point[prop] = point[prop].destroy();
        });
        props.plural.forEach(function (plural) {
            point[plural].forEach(function (item) {
                if (item.element) {
                    item.destroy();
                }
            });
            delete point[plural];
        });
    };
    /**
     * Fire an event on the Point object.
     *
     * @private
     * @function Highcharts.Point#firePointEvent
     *
     * @param {string} eventType
     *        Type of the event.
     *
     * @param {Highcharts.Dictionary<any>|Event} [eventArgs]
     *        Additional event arguments.
     *
     * @param {Highcharts.EventCallbackFunction<Highcharts.Point>|Function} [defaultFunction]
     *        Default event handler.
     *
     * @emits Highcharts.Point#event:*
     */
    Point.prototype.firePointEvent = function (eventType, eventArgs, defaultFunction) {
        var point = this, series = this.series, seriesOptions = series.options;
        // load event handlers on demand to save time on mouseover/out
        if (seriesOptions.point.events[eventType] ||
            (point.options &&
                point.options.events &&
                point.options.events[eventType])) {
            point.importEvents();
        }
        // add default handler if in selection mode
        if (eventType === 'click' && seriesOptions.allowPointSelect) {
            defaultFunction = function (event) {
                // Control key is for Windows, meta (= Cmd key) for Mac, Shift
                // for Opera.
                if (point.select) { // #2911
                    point.select(null, event.ctrlKey || event.metaKey || event.shiftKey);
                }
            };
        }
        fireEvent(point, eventType, eventArgs, defaultFunction);
    };
    /**
     * Get the CSS class names for individual points. Used internally where the
     * returned value is set on every point.
     *
     * @function Highcharts.Point#getClassName
     *
     * @return {string}
     *         The class names.
     */
    Point.prototype.getClassName = function () {
        var point = this;
        return 'highcharts-point' +
            (point.selected ? ' highcharts-point-select' : '') +
            (point.negative ? ' highcharts-negative' : '') +
            (point.isNull ? ' highcharts-null-point' : '') +
            (typeof point.colorIndex !== 'undefined' ?
                ' highcharts-color-' + point.colorIndex : '') +
            (point.options.className ? ' ' + point.options.className : '') +
            (point.zone && point.zone.className ? ' ' +
                point.zone.className.replace('highcharts-negative', '') : '');
    };
    /**
     * Get props of all existing graphical point elements.
     *
     * @private
     * @function Highcharts.Point#getGraphicalProps
     */
    Point.prototype.getGraphicalProps = function (kinds) {
        var point = this, props = [], graphicalProps = { singular: [], plural: [] };
        var prop, i;
        kinds = kinds || { graphic: 1, dataLabel: 1 };
        if (kinds.graphic) {
            props.push('graphic', 'upperGraphic', 'shadowGroup');
        }
        if (kinds.dataLabel) {
            props.push('dataLabel', 'dataLabelUpper', 'connector');
        }
        i = props.length;
        while (i--) {
            prop = props[i];
            if (point[prop]) {
                graphicalProps.singular.push(prop);
            }
        }
        ['dataLabel', 'connector'].forEach(function (prop) {
            var plural = prop + 's';
            if (kinds[prop] && point[plural]) {
                graphicalProps.plural.push(plural);
            }
        });
        return graphicalProps;
    };
    /**
     * Return the configuration hash needed for the data label and tooltip
     * formatters.
     *
     * @function Highcharts.Point#getLabelConfig
     *
     * @return {Highcharts.PointLabelObject}
     *         Abstract object used in formatters and formats.
     */
    Point.prototype.getLabelConfig = function () {
        return {
            x: this.category,
            y: this.y,
            color: this.color,
            colorIndex: this.colorIndex,
            key: this.name || this.category,
            series: this.series,
            point: this,
            percentage: this.percentage,
            total: this.total || this.stackTotal
        };
    };
    /**
     * Returns the value of the point property for a given value.
     * @private
     */
    Point.prototype.getNestedProperty = function (key) {
        if (!key) {
            return;
        }
        if (key.indexOf('custom.') === 0) {
            return getNestedProperty(key, this.options);
        }
        return this[key];
    };
    /**
     * In a series with `zones`, return the zone that the point belongs to.
     *
     * @function Highcharts.Point#getZone
     *
     * @return {Highcharts.SeriesZonesOptionsObject}
     *         The zone item.
     */
    Point.prototype.getZone = function () {
        var series = this.series, zones = series.zones, zoneAxis = series.zoneAxis || 'y';
        var zone, i = 0;
        zone = zones[i];
        while (this[zoneAxis] >= zone.value) {
            zone = zones[++i];
        }
        // For resetting or reusing the point (#8100)
        if (!this.nonZonedColor) {
            this.nonZonedColor = this.color;
        }
        if (zone && zone.color && !this.options.color) {
            this.color = zone.color;
        }
        else {
            this.color = this.nonZonedColor;
        }
        return zone;
    };
    /**
     * Utility to check if point has new shape type. Used in column series and
     * all others that are based on column series.
     * @private
     */
    Point.prototype.hasNewShapeType = function () {
        var point = this;
        var oldShapeType = point.graphic &&
            (point.graphic.symbolName || point.graphic.element.nodeName);
        return oldShapeType !== this.shapeType;
    };
    /**
     * Initialize the point. Called internally based on the `series.data`
     * option.
     *
     * @function Highcharts.Point#init
     *
     * @param {Highcharts.Series} series
     *        The series object containing this point.
     *
     * @param {Highcharts.PointOptionsType} options
     *        The data in either number, array or object format.
     *
     * @param {number} [x]
     *        Optionally, the X value of the point.
     *
     * @return {Highcharts.Point}
     *         The Point instance.
     *
     * @emits Highcharts.Point#event:afterInit
     */
    Point.prototype.init = function (series, options, x) {
        this.series = series;
        this.applyOptions(options, x);
        // Add a unique ID to the point if none is assigned
        this.id = defined(this.id) ? this.id : uniqueKey();
        this.resolveColor();
        series.chart.pointCount++;
        fireEvent(this, 'afterInit');
        return this;
    };
    /**
     * Transform number or array configs into objects. Also called for object
     * configs. Used internally to unify the different configuration formats for
     * points. For example, a simple number `10` in a line series will be
     * transformed to `{ y: 10 }`, and an array config like `[1, 10]` in a
     * scatter series will be transformed to `{ x: 1, y: 10 }`.
     *
     * @deprecated
     * @function Highcharts.Point#optionsToObject
     *
     * @param {Highcharts.PointOptionsType} options
     * Series data options.
     *
     * @return {Highcharts.Dictionary<*>}
     * Transformed point options.
     */
    Point.prototype.optionsToObject = function (options) {
        var series = this.series, keys = series.options.keys, pointArrayMap = keys || series.pointArrayMap || ['y'], valueCount = pointArrayMap.length;
        var ret = {}, firstItemType, i = 0, j = 0;
        if (isNumber(options) || options === null) {
            ret[pointArrayMap[0]] = options;
        }
        else if (isArray(options)) {
            // with leading x value
            if (!keys && options.length > valueCount) {
                firstItemType = typeof options[0];
                if (firstItemType === 'string') {
                    ret.name = options[0];
                }
                else if (firstItemType === 'number') {
                    ret.x = options[0];
                }
                i++;
            }
            while (j < valueCount) {
                // Skip undefined positions for keys
                if (!keys || typeof options[i] !== 'undefined') {
                    if (pointArrayMap[j].indexOf('.') > 0) {
                        // Handle nested keys, e.g. ['color.pattern.image']
                        // Avoid function call unless necessary.
                        Point.prototype.setNestedProperty(ret, options[i], pointArrayMap[j]);
                    }
                    else {
                        ret[pointArrayMap[j]] = options[i];
                    }
                }
                i++;
                j++;
            }
        }
        else if (typeof options === 'object') {
            ret = options;
            // This is the fastest way to detect if there are individual point
            // dataLabels that need to be considered in drawDataLabels. These
            // can only occur in object configs.
            if (options.dataLabels) {
                series._hasPointLabels = true;
            }
            // Same approach as above for markers
            if (options.marker) {
                series._hasPointMarkers = true;
            }
        }
        return ret;
    };
    /**
     * @private
     * @function Highcharts.Point#resolveColor
     */
    Point.prototype.resolveColor = function () {
        var series = this.series, optionsChart = series.chart.options.chart, styledMode = series.chart.styledMode;
        var color, colors, colorCount = optionsChart.colorCount, colorIndex;
        // remove points nonZonedColor for later recalculation
        delete this.nonZonedColor;
        if (series.options.colorByPoint) {
            if (!styledMode) {
                colors = series.options.colors || series.chart.options.colors;
                color = colors[series.colorCounter];
                colorCount = colors.length;
            }
            colorIndex = series.colorCounter;
            series.colorCounter++;
            // loop back to zero
            if (series.colorCounter === colorCount) {
                series.colorCounter = 0;
            }
        }
        else {
            if (!styledMode) {
                color = series.color;
            }
            colorIndex = series.colorIndex;
        }
        this.colorIndex = pick(this.options.colorIndex, colorIndex);
        /**
         * The point's current color.
         *
         * @name Highcharts.Point#color
         * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject|undefined}
         */
        this.color = pick(this.options.color, color);
    };
    /**
     * Set a value in an object, on the property defined by key. The key
     * supports nested properties using dot notation. The function modifies the
     * input object and does not make a copy.
     *
     * @function Highcharts.Point#setNestedProperty<T>
     *
     * @param {T} object
     *        The object to set the value on.
     *
     * @param {*} value
     *        The value to set.
     *
     * @param {string} key
     *        Key to the property to set.
     *
     * @return {T}
     *         The modified object.
     */
    Point.prototype.setNestedProperty = function (object, value, key) {
        var nestedKeys = key.split('.');
        nestedKeys.reduce(function (result, key, i, arr) {
            var isLastKey = arr.length - 1 === i;
            result[key] = (isLastKey ?
                value :
                isObject(result[key], true) ?
                    result[key] :
                    {});
            return result[key];
        }, object);
        return object;
    };
    /**
     * Extendable method for formatting each point's tooltip line.
     *
     * @function Highcharts.Point#tooltipFormatter
     *
     * @param {string} pointFormat
     *        The point format.
     *
     * @return {string}
     *         A string to be concatenated in to the common tooltip text.
     */
    Point.prototype.tooltipFormatter = function (pointFormat) {
        // Insert options for valueDecimals, valuePrefix, and valueSuffix
        var series = this.series, seriesTooltipOptions = series.tooltipOptions, valueDecimals = pick(seriesTooltipOptions.valueDecimals, ''), valuePrefix = seriesTooltipOptions.valuePrefix || '', valueSuffix = seriesTooltipOptions.valueSuffix || '';
        // Replace default point style with class name
        if (series.chart.styledMode) {
            pointFormat =
                series.chart.tooltip.styledModeFormat(pointFormat);
        }
        // Loop over the point array map and replace unformatted values with
        // sprintf formatting markup
        (series.pointArrayMap || ['y']).forEach(function (key) {
            key = '{point.' + key; // without the closing bracket
            if (valuePrefix || valueSuffix) {
                pointFormat = pointFormat.replace(RegExp(key + '}', 'g'), valuePrefix + key + '}' + valueSuffix);
            }
            pointFormat = pointFormat.replace(RegExp(key + '}', 'g'), key + ':,.' + valueDecimals + 'f}');
        });
        return format(pointFormat, {
            point: this,
            series: this.series
        }, series.chart);
    };
    /**
     * Update point with new options (typically x/y data) and optionally redraw
     * the series.
     *
     * @sample highcharts/members/point-update-column/
     *         Update column value
     * @sample highcharts/members/point-update-pie/
     *         Update pie slice
     * @sample maps/members/point-update/
     *         Update map area value in Highmaps
     *
     * @function Highcharts.Point#update
     *
     * @param {Highcharts.PointOptionsType} options
     *        The point options. Point options are handled as described under
     *        the `series.type.data` item for each series type. For example
     *        for a line series, if options is a single number, the point will
     *        be given that number as the marin y value. If it is an array, it
     *        will be interpreted as x and y values respectively. If it is an
     *        object, advanced options are applied.
     *
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart after the point is updated. If doing
     *        more operations on the chart, it is best practice to set
     *        `redraw` to false and call `chart.redraw()` after.
     *
     * @param {boolean|Partial<Highcharts.AnimationOptionsObject>} [animation=true]
     *        Whether to apply animation, and optionally animation
     *        configuration.
     *
     * @emits Highcharts.Point#event:update
     */
    Point.prototype.update = function (options, redraw, animation, runEvent) {
        var point = this, series = point.series, graphic = point.graphic, chart = series.chart, seriesOptions = series.options;
        var i;
        redraw = pick(redraw, true);
        /**
         * @private
         */
        function update() {
            point.applyOptions(options);
            // Update visuals, #4146
            // Handle dummy graphic elements for a11y, #12718
            var hasDummyGraphic = graphic && point.hasDummyGraphic;
            var shouldDestroyGraphic = point.y === null ?
                !hasDummyGraphic :
                hasDummyGraphic;
            if (graphic && shouldDestroyGraphic) {
                point.graphic = graphic.destroy();
                delete point.hasDummyGraphic;
            }
            if (isObject(options, true)) {
                // Destroy so we can get new elements
                if (graphic && graphic.element) {
                    // "null" is also a valid symbol
                    if (options &&
                        options.marker &&
                        typeof options.marker.symbol !== 'undefined') {
                        point.graphic = graphic.destroy();
                    }
                }
                if (options && options.dataLabels && point.dataLabel) {
                    point.dataLabel = point.dataLabel.destroy(); // #2468
                }
                if (point.connector) {
                    point.connector = point.connector.destroy(); // #7243
                }
            }
            // record changes in the parallel arrays
            i = point.index;
            series.updateParallelArrays(point, i);
            // Record the options to options.data. If the old or the new config
            // is an object, use point options, otherwise use raw options
            // (#4701, #4916).
            seriesOptions.data[i] = (isObject(seriesOptions.data[i], true) ||
                isObject(options, true)) ?
                point.options :
                pick(options, seriesOptions.data[i]);
            // redraw
            series.isDirty = series.isDirtyData = true;
            if (!series.fixedBox && series.hasCartesianSeries) { // #1906, #2320
                chart.isDirtyBox = true;
            }
            if (seriesOptions.legendType === 'point') { // #1831, #1885
                chart.isDirtyLegend = true;
            }
            if (redraw) {
                chart.redraw(animation);
            }
        }
        // Fire the event with a default handler of doing the update
        if (runEvent === false) { // When called from setData
            update();
        }
        else {
            point.firePointEvent('update', { options: options }, update);
        }
    };
    /**
     * Remove a point and optionally redraw the series and if necessary the axes
     *
     * @sample highcharts/plotoptions/series-point-events-remove/
     *         Remove point and confirm
     * @sample highcharts/members/point-remove/
     *         Remove pie slice
     * @sample maps/members/point-remove/
     *         Remove selected points in Highmaps
     *
     * @function Highcharts.Point#remove
     *
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart or wait for an explicit call. When
     *        doing more operations on the chart, for example running
     *        `point.remove()` in a loop, it is best practice to set `redraw`
     *        to false and call `chart.redraw()` after.
     *
     * @param {boolean|Partial<Highcharts.AnimationOptionsObject>} [animation=false]
     *        Whether to apply animation, and optionally animation
     *        configuration.
     */
    Point.prototype.remove = function (redraw, animation) {
        this.series.removePoint(this.series.data.indexOf(this), redraw, animation);
    };
    /**
     * Toggle the selection status of a point.
     *
     * @see Highcharts.Chart#getSelectedPoints
     *
     * @sample highcharts/members/point-select/
     *         Select a point from a button
     * @sample highcharts/chart/events-selection-points/
     *         Select a range of points through a drag selection
     * @sample maps/series/data-id/
     *         Select a point in Highmaps
     *
     * @function Highcharts.Point#select
     *
     * @param {boolean} [selected]
     * When `true`, the point is selected. When `false`, the point is
     * unselected. When `null` or `undefined`, the selection state is toggled.
     *
     * @param {boolean} [accumulate=false]
     * When `true`, the selection is added to other selected points.
     * When `false`, other selected points are deselected. Internally in
     * Highcharts, when
     * [allowPointSelect](https://api.highcharts.com/highcharts/plotOptions.series.allowPointSelect)
     * is `true`, selected points are accumulated on Control, Shift or Cmd
     * clicking the point.
     *
     * @emits Highcharts.Point#event:select
     * @emits Highcharts.Point#event:unselect
     */
    Point.prototype.select = function (selected, accumulate) {
        var point = this, series = point.series, chart = series.chart;
        selected = pick(selected, !point.selected);
        this.selectedStaging = selected;
        // fire the event with the default handler
        point.firePointEvent(selected ? 'select' : 'unselect', { accumulate: accumulate }, function () {
            /**
             * Whether the point is selected or not.
             *
             * @see Point#select
             * @see Chart#getSelectedPoints
             *
             * @name Highcharts.Point#selected
             * @type {boolean}
             */
            point.selected = point.options.selected = selected;
            series.options.data[series.data.indexOf(point)] =
                point.options;
            point.setState(selected && 'select');
            // unselect all other points unless Ctrl or Cmd + click
            if (!accumulate) {
                chart.getSelectedPoints().forEach(function (loopPoint) {
                    var loopSeries = loopPoint.series;
                    if (loopPoint.selected && loopPoint !== point) {
                        loopPoint.selected = loopPoint.options.selected =
                            false;
                        loopSeries.options.data[loopSeries.data.indexOf(loopPoint)] = loopPoint.options;
                        // Programatically selecting a point should restore
                        // normal state, but when click happened on other
                        // point, set inactive state to match other points
                        loopPoint.setState(chart.hoverPoints &&
                            loopSeries.options.inactiveOtherPoints ?
                            'inactive' : '');
                        loopPoint.firePointEvent('unselect');
                    }
                });
            }
        });
        delete this.selectedStaging;
    };
    /**
     * Runs on mouse over the point. Called internally from mouse and touch
     * events.
     *
     * @function Highcharts.Point#onMouseOver
     *
     * @param {Highcharts.PointerEventObject} [e]
     *        The event arguments.
     */
    Point.prototype.onMouseOver = function (e) {
        var point = this, series = point.series, chart = series.chart, pointer = chart.pointer;
        e = e ?
            pointer.normalize(e) :
            // In cases where onMouseOver is called directly without an event
            pointer.getChartCoordinatesFromPoint(point, chart.inverted);
        pointer.runPointActions(e, point);
    };
    /**
     * Runs on mouse out from the point. Called internally from mouse and touch
     * events.
     *
     * @function Highcharts.Point#onMouseOut
     * @emits Highcharts.Point#event:mouseOut
     */
    Point.prototype.onMouseOut = function () {
        var point = this, chart = point.series.chart;
        point.firePointEvent('mouseOut');
        if (!point.series.options.inactiveOtherPoints) {
            (chart.hoverPoints || []).forEach(function (p) {
                p.setState();
            });
        }
        chart.hoverPoints = chart.hoverPoint = null;
    };
    /**
     * Import events from the series' and point's options. Only do it on
     * demand, to save processing time on hovering.
     *
     * @private
     * @function Highcharts.Point#importEvents
     */
    Point.prototype.importEvents = function () {
        if (!this.hasImportedEvents) {
            var point_1 = this, options = merge(point_1.series.options.point, point_1.options), events = options.events;
            point_1.events = events;
            objectEach(events, function (event, eventType) {
                if (isFunction(event)) {
                    addEvent(point_1, eventType, event);
                }
            });
            this.hasImportedEvents = true;
        }
    };
    /**
     * Set the point's state.
     *
     * @function Highcharts.Point#setState
     *
     * @param {Highcharts.PointStateValue|""} [state]
     *        The new state, can be one of `'hover'`, `'select'`, `'inactive'`,
     *        or `''` (an empty string), `'normal'` or `undefined` to set to
     *        normal state.
     * @param {boolean} [move]
     *        State for animation.
     *
     * @emits Highcharts.Point#event:afterSetState
     */
    Point.prototype.setState = function (state, move) {
        var point = this, series = point.series, previousState = point.state, stateOptions = (series.options.states[state || 'normal'] ||
            {}), markerOptions = (defaultOptions.plotOptions[series.type].marker &&
            series.options.marker), normalDisabled = (markerOptions && markerOptions.enabled === false), markerStateOptions = ((markerOptions &&
            markerOptions.states &&
            markerOptions.states[state || 'normal']) || {}), stateDisabled = markerStateOptions.enabled === false, pointMarker = point.marker || {}, chart = series.chart, hasMarkers = (markerOptions && series.markerAttribs);
        var halo = series.halo, markerAttribs, pointAttribs, pointAttribsAnimation, stateMarkerGraphic = series.stateMarkerGraphic, newSymbol;
        state = state || ''; // empty string
        if (
        // already has this state
        (state === point.state && !move) ||
            // selected points don't respond to hover
            (point.selected && state !== 'select') ||
            // series' state options is disabled
            (stateOptions.enabled === false) ||
            // general point marker's state options is disabled
            (state && (stateDisabled ||
                (normalDisabled &&
                    markerStateOptions.enabled === false))) ||
            // individual point marker's state options is disabled
            (state &&
                pointMarker.states &&
                pointMarker.states[state] &&
                pointMarker.states[state].enabled === false) // #1610
        ) {
            return;
        }
        point.state = state;
        if (hasMarkers) {
            markerAttribs = series.markerAttribs(point, state);
        }
        // Apply hover styles to the existing point
        // Prevent from dummy null points (#14966)
        if (point.graphic && !point.hasDummyGraphic) {
            if (previousState) {
                point.graphic.removeClass('highcharts-point-' + previousState);
            }
            if (state) {
                point.graphic.addClass('highcharts-point-' + state);
            }
            if (!chart.styledMode) {
                pointAttribs = series.pointAttribs(point, state);
                pointAttribsAnimation = pick(chart.options.chart.animation, stateOptions.animation);
                // Some inactive points (e.g. slices in pie) should apply
                // opacity also for their labels
                if (series.options.inactiveOtherPoints &&
                    isNumber(pointAttribs.opacity)) {
                    (point.dataLabels || []).forEach(function (label) {
                        if (label) {
                            label.animate({
                                opacity: pointAttribs.opacity
                            }, pointAttribsAnimation);
                        }
                    });
                    if (point.connector) {
                        point.connector.animate({
                            opacity: pointAttribs.opacity
                        }, pointAttribsAnimation);
                    }
                }
                point.graphic.animate(pointAttribs, pointAttribsAnimation);
            }
            if (markerAttribs) {
                point.graphic.animate(markerAttribs, pick(
                // Turn off globally:
                chart.options.chart.animation, markerStateOptions.animation, markerOptions.animation));
            }
            // Zooming in from a range with no markers to a range with markers
            if (stateMarkerGraphic) {
                stateMarkerGraphic.hide();
            }
        }
        else {
            // if a graphic is not applied to each point in the normal state,
            // create a shared graphic for the hover state
            if (state && markerStateOptions) {
                newSymbol = pointMarker.symbol || series.symbol;
                // If the point has another symbol than the previous one, throw
                // away the state marker graphic and force a new one (#1459)
                if (stateMarkerGraphic &&
                    stateMarkerGraphic.currentSymbol !== newSymbol) {
                    stateMarkerGraphic = stateMarkerGraphic.destroy();
                }
                // Add a new state marker graphic
                if (markerAttribs) {
                    if (!stateMarkerGraphic) {
                        if (newSymbol) {
                            series.stateMarkerGraphic = stateMarkerGraphic =
                                chart.renderer
                                    .symbol(newSymbol, markerAttribs.x, markerAttribs.y, markerAttribs.width, markerAttribs.height)
                                    .add(series.markerGroup);
                            stateMarkerGraphic.currentSymbol = newSymbol;
                        }
                        // Move the existing graphic
                    }
                    else {
                        stateMarkerGraphic[move ? 'animate' : 'attr']({
                            x: markerAttribs.x,
                            y: markerAttribs.y
                        });
                    }
                }
                if (!chart.styledMode && stateMarkerGraphic &&
                    point.state !== 'inactive') {
                    stateMarkerGraphic.attr(series.pointAttribs(point, state));
                }
            }
            if (stateMarkerGraphic) {
                stateMarkerGraphic[state && point.isInside ? 'show' : 'hide'](); // #2450
                stateMarkerGraphic.element.point = point; // #4310
                stateMarkerGraphic.addClass(point.getClassName(), true);
            }
        }
        // Show me your halo
        var haloOptions = stateOptions.halo;
        var markerGraphic = (point.graphic || stateMarkerGraphic);
        var markerVisibility = (markerGraphic && markerGraphic.visibility || 'inherit');
        if (haloOptions &&
            haloOptions.size &&
            markerGraphic &&
            markerVisibility !== 'hidden' &&
            !point.isCluster) {
            if (!halo) {
                series.halo = halo = chart.renderer.path()
                    // #5818, #5903, #6705
                    .add(markerGraphic.parentGroup);
            }
            halo.show()[move ? 'animate' : 'attr']({
                d: point.haloPath(haloOptions.size)
            });
            halo.attr({
                'class': 'highcharts-halo highcharts-color-' +
                    pick(point.colorIndex, series.colorIndex) +
                    (point.className ? ' ' + point.className : ''),
                'visibility': markerVisibility,
                'zIndex': -1 // #4929, #8276
            });
            halo.point = point; // #6055
            if (!chart.styledMode) {
                halo.attr(extend({
                    'fill': point.color || series.color,
                    'fill-opacity': haloOptions.opacity
                }, AST.filterUserAttributes(haloOptions.attributes || {})));
            }
        }
        else if (halo && halo.point && halo.point.haloPath) {
            // Animate back to 0 on the current halo point (#6055)
            halo.animate({ d: halo.point.haloPath(0) }, null, 
            // Hide after unhovering. The `complete` callback runs in the
            // halo's context (#7681).
            halo.hide);
        }
        fireEvent(point, 'afterSetState', { state: state });
    };
    /**
     * Get the path definition for the halo, which is usually a shadow-like
     * circle around the currently hovered point.
     *
     * @function Highcharts.Point#haloPath
     *
     * @param {number} size
     *        The radius of the circular halo.
     *
     * @return {Highcharts.SVGPathArray}
     *         The path definition.
     */
    Point.prototype.haloPath = function (size) {
        var series = this.series, chart = series.chart;
        return chart.renderer.symbols.circle(Math.floor(this.plotX) - size, this.plotY - size, size * 2, size * 2);
    };
    return Point;
}());
/* *
 *
 *  Default Export
 *
 * */
export default Point;
/* *
 *
 *  API Declarations
 *
 * */
/**
 * Function callback when a series point is clicked. Return false to cancel the
 * action.
 *
 * @callback Highcharts.PointClickCallbackFunction
 *
 * @param {Highcharts.Point} this
 *        The point where the event occured.
 *
 * @param {Highcharts.PointClickEventObject} event
 *        Event arguments.
 */
/**
 * Common information for a click event on a series point.
 *
 * @interface Highcharts.PointClickEventObject
 * @extends Highcharts.PointerEventObject
 */ /**
* Clicked point.
* @name Highcharts.PointClickEventObject#point
* @type {Highcharts.Point}
*/
/**
 * Configuration for the data label and tooltip formatters.
 *
 * @interface Highcharts.PointLabelObject
 */ /**
* The point's current color.
* @name Highcharts.PointLabelObject#color
* @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject|undefined}
*/ /**
* The point's current color index, used in styled mode instead of `color`. The
* color index is inserted in class names used for styling.
* @name Highcharts.PointLabelObject#colorIndex
* @type {number}
*/ /**
* The name of the related point.
* @name Highcharts.PointLabelObject#key
* @type {string|undefined}
*/ /**
* The percentage for related points in a stacked series or pies.
* @name Highcharts.PointLabelObject#percentage
* @type {number}
*/ /**
* The related point. The point name, if defined, is available through
* `this.point.name`.
* @name Highcharts.PointLabelObject#point
* @type {Highcharts.Point}
*/ /**
* The related series. The series name is available through `this.series.name`.
* @name Highcharts.PointLabelObject#series
* @type {Highcharts.Series}
*/ /**
* The total of values in either a stack for stacked series, or a pie in a pie
* series.
* @name Highcharts.PointLabelObject#total
* @type {number|undefined}
*/ /**
* For categorized axes this property holds the category name for the point. For
* other axes it holds the X value.
* @name Highcharts.PointLabelObject#x
* @type {number|string|undefined}
*/ /**
* The y value of the point.
* @name Highcharts.PointLabelObject#y
* @type {number|null|undefined}
*/
/**
 * Gets fired when the mouse leaves the area close to the point.
 *
 * @callback Highcharts.PointMouseOutCallbackFunction
 *
 * @param {Highcharts.Point} this
 *        Point where the event occured.
 *
 * @param {global.PointerEvent} event
 *        Event that occured.
 */
/**
 * Gets fired when the mouse enters the area close to the point.
 *
 * @callback Highcharts.PointMouseOverCallbackFunction
 *
 * @param {Highcharts.Point} this
 *        Point where the event occured.
 *
 * @param {global.Event} event
 *        Event that occured.
 */
/**
 * The generic point options for all series.
 *
 * In TypeScript you have to extend `PointOptionsObject` with an additional
 * declaration to allow custom data options:
 *
 * ```
 * declare interface PointOptionsObject {
 *     customProperty: string;
 * }
 * ```
 *
 * @interface Highcharts.PointOptionsObject
 */
/**
 * Possible option types for a data point. Use `null` to indicate a gap.
 *
 * @typedef {number|string|Highcharts.PointOptionsObject|Array<(number|string|null)>|null} Highcharts.PointOptionsType
 */
/**
 * Gets fired when the point is removed using the `.remove()` method.
 *
 * @callback Highcharts.PointRemoveCallbackFunction
 *
 * @param {Highcharts.Point} this
 *        Point where the event occured.
 *
 * @param {global.Event} event
 *        Event that occured.
 */
/**
 * Possible key values for the point state options.
 *
 * @typedef {"hover"|"inactive"|"normal"|"select"} Highcharts.PointStateValue
 */
/**
 * Gets fired when the point is updated programmatically through the `.update()`
 * method.
 *
 * @callback Highcharts.PointUpdateCallbackFunction
 *
 * @param {Highcharts.Point} this
 *        Point where the event occured.
 *
 * @param {Highcharts.PointUpdateEventObject} event
 *        Event that occured.
 */
/**
 * Information about the update event.
 *
 * @interface Highcharts.PointUpdateEventObject
 * @extends global.Event
 */ /**
* Options data of the update event.
* @name Highcharts.PointUpdateEventObject#options
* @type {Highcharts.PointOptionsType}
*/
/**
 * @interface Highcharts.PointEventsOptionsObject
 */ /**
* Fires when the point is selected either programmatically or following a click
* on the point. One parameter, `event`, is passed to the function. Returning
* `false` cancels the operation.
* @name Highcharts.PointEventsOptionsObject#select
* @type {Highcharts.PointSelectCallbackFunction|undefined}
*/ /**
* Fires when the point is unselected either programmatically or following a
* click on the point. One parameter, `event`, is passed to the function.
* Returning `false` cancels the operation.
* @name Highcharts.PointEventsOptionsObject#unselect
* @type {Highcharts.PointUnselectCallbackFunction|undefined}
*/
/**
 * Information about the select/unselect event.
 *
 * @interface Highcharts.PointInteractionEventObject
 * @extends global.Event
 */ /**
* @name Highcharts.PointInteractionEventObject#accumulate
* @type {boolean}
*/
/**
 * Gets fired when the point is selected either programmatically or following a
 * click on the point.
 *
 * @callback Highcharts.PointSelectCallbackFunction
 *
 * @param {Highcharts.Point} this
 *        Point where the event occured.
 *
 * @param {Highcharts.PointInteractionEventObject} event
 *        Event that occured.
 */
/**
 * Fires when the point is unselected either programmatically or following a
 * click on the point.
 *
 * @callback Highcharts.PointUnselectCallbackFunction
 *
 * @param {Highcharts.Point} this
 *        Point where the event occured.
 *
 * @param {Highcharts.PointInteractionEventObject} event
 *        Event that occured.
 */
''; // keeps doclets above in JS file.
