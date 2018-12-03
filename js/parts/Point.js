/**
 * (c) 2010-2018 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */

/**
 * Configuration hash for the data label and tooltip formatters.
 *
 * @interface Highcharts.PointLabelObject
 *//**
 * The point's current color.
 * @name Highcharts.PointLabelObject#color
 * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
 *//**
 * The point's current color index, used in styled mode instead of `color`. The
 * color index is inserted in class names used for styling.
 * @name Highcharts.PointLabelObject#colorIndex
 * @type {number}
 *//**
 * The name of the related point.
 * @name Highcharts.PointLabelObject#key
 * @type {number|string}
 *//**
 * The percentage for related points in a stacked series or pies.
 * @name Highcharts.PointLabelObject#percentage
 * @type {number}
 *//**
 * The related point.
 * @name Highcharts.PointLabelObject#point
 * @type {Highcharts.Point}
 *//**
 * The related series.
 * @name Highcharts.PointLabelObject#series
 * @type {Highcharts.Series}
 *//**
 * The total of values in either a stack for stacked series, or a pie in a pie
 * series.
 * @name Highcharts.PointLabelObject#total
 * @type {number}
 *//**
 * For categorized axes this property holds the category name for the point. For
 * other axes it holds the X value.
 * @name Highcharts.PointLabelObject#x
 * @type {number|string}
 *//**
 * The y value of the point.
 * @name Highcharts.PointLabelObject#y
 * @type {number|undefined}
 */

'use strict';

import Highcharts from './Globals.js';
import './Utilities.js';

var Point,
    H = Highcharts,
    extend = H.extend,
    erase = H.erase,
    fireEvent = H.fireEvent,
    format = H.format,
    isArray = H.isArray,
    isNumber = H.isNumber,
    pick = H.pick,
    uniqueKey = H.uniqueKey,
    defined = H.defined,
    removeEvent = H.removeEvent;

/**
 * The Point object. The point objects are generated from the `series.data`
 * configuration objects or raw numbers. They can be accessed from the
 * `Series.points` array. Other ways to instantiate points are through {@link
 * Highcharts.Series#addPoint} or {@link Highcharts.Series#setData}.
 *
 * @class
 * @name Highcharts.Point
 */
Highcharts.Point = Point = function () {};
Highcharts.Point.prototype = {

    /**
     * Initialize the point. Called internally based on the `series.data`
     * option.
     *
     * @function Highcharts.Point#init
     *
     * @param {Highcharts.Series} series
     *        The series object containing this point.
     *
     * @param {number|object|Array<number|string>|null} options
     *        The data in either number, array or object format.
     *
     * @param {number} [x]
     *        Optionally, the X value of the point.
     *
     * @return {Highcharts.Point}
     *         The Point instance.
     *
     * @fires Highcharts.Point#event:afterInit
     */
    init: function (series, options, x) {

        var point = this,
            colors,
            optionsChart = series.chart.options.chart,
            colorCount = optionsChart.colorCount,
            styledMode = series.chart.styledMode,
            colorIndex;

        /**
         * The series object associated with the point.
         *
         * @name Highcharts.Point#series
         * @type {Highcharts.Series}
         */
        point.series = series;

        /**
         * The point's current color.
         *
         * @name Highcharts.Point#color
         * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         */
        if (!styledMode) {
            point.color = series.color; // #3445
        }
        point.applyOptions(options, x);

        // Add a unique ID to the point if none is assigned
        point.id = defined(point.id) ? point.id : uniqueKey();

        if (series.options.colorByPoint) {
            if (!styledMode) {
                colors = series.options.colors || series.chart.options.colors;
                point.color = point.color || colors[series.colorCounter];
                colorCount = colors.length;
            }
            colorIndex = series.colorCounter;
            series.colorCounter++;
            // loop back to zero
            if (series.colorCounter === colorCount) {
                series.colorCounter = 0;
            }
        } else {
            colorIndex = series.colorIndex;
        }

        /**
         * The point's current color index, used in styled mode instead of
         * `color`. The color index is inserted in class names used for styling.
         *
         * @name Highcharts.Point#colorIndex
         * @type {number}
         */
        point.colorIndex = pick(point.colorIndex, colorIndex);

        series.chart.pointCount++;

        fireEvent(point, 'afterInit');

        return point;
    },
    /**
     * Apply the options containing the x and y data and possible some extra
     * properties. Called on point init or from point.update.
     *
     * @private
     * @function Highcharts.Point#applyOptions
     *
     * @param {number|object|Array<number|string>|null} options
     *        The point options as defined in series.data.
     *
     * @param {number} [x]
     *        Optionally, the x value.
     *
     * @return {Highcharts.Point}
     *         The Point instance.
     */
    applyOptions: function (options, x) {
        var point = this,
            series = point.series,
            pointValKey = series.options.pointValKey || series.pointValKey;

        options = Point.prototype.optionsToObject.call(this, options);

        // copy options directly to point
        extend(point, options);

        /**
         * The point's options as applied in the initial configuration, or
         * extended through `Point.update`.
         * @name Highcharts.Point#options
         * @type {object}
         */
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
            point.y = point[pointValKey];
        }
        point.isNull = pick(
            point.isValid && !point.isValid(),
            point.x === null || !isNumber(point.y, true)
        ); // #3571, check for NaN

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
        if (
            'name' in point &&
            x === undefined &&
            series.xAxis &&
            series.xAxis.hasNames
        ) {
            point.x = series.xAxis.nameToX(point);
        }
        if (point.x === undefined && series) {
            if (x === undefined) {
                point.x = series.autoIncrement(point);
            } else {
                point.x = x;
            }
        }

        return point;
    },

    /**
     * Set a value in an object, on the property defined by key. The key
     * supports nested properties using dot notation. The function modifies the
     * input object and does not make a copy.
     *
     * @function Highcharts.Point#setNestedProperty
     *
     * @param {object} object
     *        The object to set the value on.
     *
     * @param {*} value
     *        The value to set.
     *
     * @param {string} key
     *        Key to the property to set.
     *
     * @return {object}
     *         The modified object.
     */
    setNestedProperty: function (object, value, key) {
        var nestedKeys = key.split('.');
        nestedKeys.reduce(function (result, key, i, arr) {
            var isLastKey = arr.length - 1 === i;
            result[key] = (
                isLastKey ?
                value :
                (H.isObject(result[key], true) ? result[key] : {})
            );
            return result[key];
        }, object);
        return object;
    },

    /**
     * Transform number or array configs into objects. Used internally to unify
     * the different configuration formats for points. For example, a simple
     * number `10` in a line series will be transformed to `{ y: 10 }`, and an
     * array config like `[1, 10]` in a scatter series will be transformed to
     * `{ x: 1, y: 10 }`.
     *
     * @function Highcharts.Point#optionsToObject
     *
     * @param {number|object|Array<number|string>|null} options
     *        The input option.
     *
     * @return {object}
     *         Transformed options.
     */
    optionsToObject: function (options) {
        var ret = {},
            series = this.series,
            keys = series.options.keys,
            pointArrayMap = keys || series.pointArrayMap || ['y'],
            valueCount = pointArrayMap.length,
            firstItemType,
            i = 0,
            j = 0;

        if (isNumber(options) || options === null) {
            ret[pointArrayMap[0]] = options;

        } else if (isArray(options)) {
            // with leading x value
            if (!keys && options.length > valueCount) {
                firstItemType = typeof options[0];
                if (firstItemType === 'string') {
                    ret.name = options[0];
                } else if (firstItemType === 'number') {
                    ret.x = options[0];
                }
                i++;
            }
            while (j < valueCount) {
                // Skip undefined positions for keys
                if (!keys || options[i] !== undefined) {
                    if (pointArrayMap[j].indexOf('.') > 0) {
                        // Handle nested keys, e.g. ['color.pattern.image']
                        // Avoid function call unless necessary.
                        H.Point.prototype.setNestedProperty(
                            ret, options[i], pointArrayMap[j]
                        );
                    } else {
                        ret[pointArrayMap[j]] = options[i];
                    }
                }
                i++;
                j++;
            }
        } else if (typeof options === 'object') {
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
    },

    /**
     * Get the CSS class names for individual points. Used internally where the
     * returned value is set on every point.
     *
     * @function Highcharts.Point#getClassName
     *
     * @return {string}
     *         The class names.
     */
    getClassName: function () {
        return 'highcharts-point' +
            (this.selected ? ' highcharts-point-select' : '') +
            (this.negative ? ' highcharts-negative' : '') +
            (this.isNull ? ' highcharts-null-point' : '') +
            (this.colorIndex !== undefined ? ' highcharts-color-' +
                this.colorIndex : '') +
            (this.options.className ? ' ' + this.options.className : '') +
            (this.zone && this.zone.className ? ' ' +
                this.zone.className.replace('highcharts-negative', '') : '');
    },

    /**
     * In a series with `zones`, return the zone that the point belongs to.
     *
     * @function Highcharts.Point#getZone
     *
     * @return {Highcharts.PlotSeriesZonesOptions}
     *         The zone item.
     */
    getZone: function () {
        var series = this.series,
            zones = series.zones,
            zoneAxis = series.zoneAxis || 'y',
            i = 0,
            zone;

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
        } else {
            this.color = this.nonZonedColor;
        }

        return zone;
    },

    /**
     * Destroy a point to clear memory. Its reference still stays in
     * `series.data`.
     *
     * @private
     * @function Highcharts.Point#destroy
     */
    destroy: function () {
        var point = this,
            series = point.series,
            chart = series.chart,
            hoverPoints = chart.hoverPoints,
            prop;

        chart.pointCount--;

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

        // Remove all events and elements
        if (point.graphic || point.dataLabel || point.dataLabels) {
            removeEvent(point);
            point.destroyElements();
        }

        if (point.legendItem) { // pies have legend items
            chart.legend.destroyItem(point);
        }

        for (prop in point) {
            point[prop] = null;
        }
    },

    /**
     * Destroy SVG elements associated with the point.
     *
     * @private
     * @function Highcharts.Point#destroyElements
     */
    destroyElements: function () {
        var point = this,
            props = [
                'graphic',
                'dataLabel',
                'dataLabelUpper',
                'connector',
                'shadowGroup'
            ],
            prop,
            i = 6;
        while (i--) {
            prop = props[i];
            if (point[prop]) {
                point[prop] = point[prop].destroy();
            }
        }
        // Handle point.dataLabels and point.connectors
        if (point.dataLabels) {
            point.dataLabels.forEach(function (label) {
                if (label.element) {
                    label.destroy();
                }
            });
            delete point.dataLabels;
        }
        if (point.connectors) {
            point.connectors.forEach(function (connector) {
                if (connector.element) {
                    connector.destroy();
                }
            });
            delete point.connectors;
        }
    },

    /**
     * Return the configuration hash needed for the data label and tooltip
     * formatters.
     *
     * @function Highcharts.Point#getLabelConfig
     *
     * @return {Highcharts.PointLabelObject}
     *         Abstract object used in formatters and formats.
     */
    getLabelConfig: function () {
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
    },

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
    tooltipFormatter: function (pointFormat) {

        // Insert options for valueDecimals, valuePrefix, and valueSuffix
        var series = this.series,
            seriesTooltipOptions = series.tooltipOptions,
            valueDecimals = pick(seriesTooltipOptions.valueDecimals, ''),
            valuePrefix = seriesTooltipOptions.valuePrefix || '',
            valueSuffix = seriesTooltipOptions.valueSuffix || '';

        // Replace default point style with class name
        if (series.chart.styledMode) {
            pointFormat = series.chart.tooltip.styledModeFormat(pointFormat);
        }

        // Loop over the point array map and replace unformatted values with
        // sprintf formatting markup
        (series.pointArrayMap || ['y']).forEach(function (key) {
            key = '{point.' + key; // without the closing bracket
            if (valuePrefix || valueSuffix) {
                pointFormat = pointFormat.replace(
                    RegExp(key + '}', 'g'),
                    valuePrefix + key + '}' + valueSuffix
                );
            }
            pointFormat = pointFormat.replace(
                RegExp(key + '}', 'g'),
                key + ':,.' + valueDecimals + 'f}'
            );
        });

        return format(pointFormat, {
            point: this,
            series: this.series
        }, series.chart.time);
    },

    /**
     * Fire an event on the Point object.
     *
     * @private
     * @function Highcharts.Point#firePointEvent
     *
     * @param {string} eventType
     *        Type of the event.
     *
     * @param {object} eventArgs
     *        Additional event arguments.
     *
     * @param {Function} defaultFunction
     *        Default event handler.
     *
     * @fires Highcharts.Point#event:*
     */
    firePointEvent: function (eventType, eventArgs, defaultFunction) {
        var point = this,
            series = this.series,
            seriesOptions = series.options;

        // load event handlers on demand to save time on mouseover/out
        if (
            seriesOptions.point.events[eventType] ||
            (
                point.options &&
                point.options.events &&
                point.options.events[eventType]
            )
        ) {
            this.importEvents();
        }

        // add default handler if in selection mode
        if (eventType === 'click' && seriesOptions.allowPointSelect) {
            defaultFunction = function (event) {
                // Control key is for Windows, meta (= Cmd key) for Mac, Shift
                // for Opera.
                if (point.select) { // #2911
                    point.select(
                        null,
                        event.ctrlKey || event.metaKey || event.shiftKey
                    );
                }
            };
        }

        fireEvent(this, eventType, eventArgs, defaultFunction);
    },

    /**
     * For certain series types, like pie charts, where individual points can
     * be shown or hidden.
     *
     * @name Highcharts.Point#visible
     * @type {boolean}
     */
    visible: true
};

/**
 * For categorized axes this property holds the category name for the
 * point. For other axes it holds the X value.
 *
 * @name Highcharts.Point#category
 * @type {number|string}
 */

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


/**
 * The percentage for points in a stacked series or pies.
 *
 * @name Highcharts.Point#percentage
 * @type {number}
 */

/**
 * The total of values in either a stack for stacked series, or a pie in a pie
 * series.
 *
 * @name Highcharts.Point#total
 * @type {number}
 */
