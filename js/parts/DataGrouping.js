/* *
 *
 *  (c) 2010-2019 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 * */

'use strict';

import H from './Globals.js';
import './Utilities.js';
import './Axis.js';
import './Series.js';
import './Tooltip.js';

var addEvent = H.addEvent,
    arrayMax = H.arrayMax,
    arrayMin = H.arrayMin,
    Axis = H.Axis,
    defaultPlotOptions = H.defaultPlotOptions,
    defined = H.defined,
    extend = H.extend,
    format = H.format,
    isNumber = H.isNumber,
    merge = H.merge,
    pick = H.pick,
    Point = H.Point,
    Series = H.Series,
    Tooltip = H.Tooltip;

/* ************************************************************************** *
 *  Start data grouping module                                                *
 * ************************************************************************** */

/**
 * Data grouping is the concept of sampling the data values into larger
 * blocks in order to ease readability and increase performance of the
 * JavaScript charts. Highstock by default applies data grouping when
 * the points become closer than a certain pixel value, determined by
 * the `groupPixelWidth` option.
 *
 * If data grouping is applied, the grouping information of grouped
 * points can be read from the [Point.dataGroup](
 * /class-reference/Highcharts.Point#dataGroup). If point options other than
 * the data itself are set, for example `name` or `color` or custom properties,
 * the grouping logic doesn't know how to group it. In this case the options of
 * the first point instance are copied over to the group point. This can be
 * altered through a custom `approximation` callback function.
 *
 * @product   highstock
 * @apioption plotOptions.series.dataGrouping
 */

/**
 * The method of approximation inside a group. When for example 30 days
 * are grouped into one month, this determines what value should represent
 * the group. Possible values are "average", "averages", "open", "high",
 * "low", "close" and "sum". For OHLC and candlestick series the approximation
 * is "ohlc" by default, which finds the open, high, low and close values
 * within all the grouped data. For ranges, the approximation is "range",
 * which finds the low and high values. For multi-dimensional data,
 * like ranges and OHLC, "averages" will compute the average for each
 * dimension.
 *
 * Custom aggregate methods can be added by assigning a callback function
 * as the approximation. This function takes a numeric array as the
 * argument and should return a single numeric value or `null`. Note
 * that the numeric array will never contain null values, only true
 * numbers. Instead, if null values are present in the raw data, the
 * numeric array will have an `.hasNulls` property set to `true`. For
 * single-value data sets the data is available in the first argument
 * of the callback function. For OHLC data sets, all the open values
 * are in the first argument, all high values in the second etc.
 *
 * Since v4.2.7, grouping meta data is available in the approximation
 * callback from `this.dataGroupInfo`. It can be used to extract information
 * from the raw data.
 *
 * Defaults to `average` for line-type series, `sum` for columns, `range`
 * for range series and `ohlc` for OHLC and candlestick.
 *
 * @sample {highstock} stock/plotoptions/series-datagrouping-approximation
 *         Approximation callback with custom data
 *
 * @type       {string|Function}
 * @validvalue ["average", "averages", "open", "high", "low", "close", "sum"]
 * @product    highstock
 * @apioption  plotOptions.series.dataGrouping.approximation
 */

/**
 * Datetime formats for the header of the tooltip in a stock chart.
 * The format can vary within a chart depending on the currently selected
 * time range and the current data grouping.
 *
 * The default formats are:
 *
 * <pre>{
 *     millisecond: [
 *         '%A, %b %e, %H:%M:%S.%L', '%A, %b %e, %H:%M:%S.%L', '-%H:%M:%S.%L'
 *     ],
 *     second: ['%A, %b %e, %H:%M:%S', '%A, %b %e, %H:%M:%S', '-%H:%M:%S'],
 *     minute: ['%A, %b %e, %H:%M', '%A, %b %e, %H:%M', '-%H:%M'],
 *     hour: ['%A, %b %e, %H:%M', '%A, %b %e, %H:%M', '-%H:%M'],
 *     day: ['%A, %b %e, %Y', '%A, %b %e', '-%A, %b %e, %Y'],
 *     week: ['Week from %A, %b %e, %Y', '%A, %b %e', '-%A, %b %e, %Y'],
 *     month: ['%B %Y', '%B', '-%B %Y'],
 *     year: ['%Y', '%Y', '-%Y']
 * }</pre>
 *
 * For each of these array definitions, the first item is the format
 * used when the active time span is one unit. For instance, if the
 * current data applies to one week, the first item of the week array
 * is used. The second and third items are used when the active time
 * span is more than two units. For instance, if the current data applies
 * to two weeks, the second and third item of the week array are used,
 *  and applied to the start and end date of the time span.
 *
 * @type      {object}
 * @product   highstock
 * @apioption plotOptions.series.dataGrouping.dateTimeLabelFormats
 */

/**
 * Enable or disable data grouping.
 *
 * @type      {boolean}
 * @default   true
 * @product   highstock
 * @apioption plotOptions.series.dataGrouping.enabled
 */

/**
 * When data grouping is forced, it runs no matter how small the intervals
 * are. This can be handy for example when the sum should be calculated
 * for values appearing at random times within each hour.
 *
 * @type      {boolean}
 * @default   false
 * @product   highstock
 * @apioption plotOptions.series.dataGrouping.forced
 */

/**
 * The approximate pixel width of each group. If for example a series
 * with 30 points is displayed over a 600 pixel wide plot area, no grouping
 * is performed. If however the series contains so many points that
 * the spacing is less than the groupPixelWidth, Highcharts will try
 * to group it into appropriate groups so that each is more or less
 * two pixels wide. If multiple series with different group pixel widths
 * are drawn on the same x axis, all series will take the greatest width.
 * For example, line series have 2px default group width, while column
 * series have 10px. If combined, both the line and the column will
 * have 10px by default.
 *
 * @type      {number}
 * @default   2
 * @product   highstock
 * @apioption plotOptions.series.dataGrouping.groupPixelWidth
 */

/**
 * By default only points within the visible range are grouped. Enabling this
 * option will force data grouping to calculate all grouped points for a given
 * dataset. That option prevents for example a column series from calculating
 * a grouped point partially. The effect is similar to
 * [Series.getExtremesFromAll](#plotOptions.series.getExtremesFromAll) but does
 * not affect yAxis extremes.
 *
 * @sample {highstock} stock/plotoptions/series-datagrouping-groupall/
 *         Two series with the same data but different groupAll setting
 *
 * @type      {boolean}
 * @default   false
 * @since     6.1.0
 * @product   highstock
 * @apioption plotOptions.series.dataGrouping.groupAll
 */

/**
 * Normally, a group is indexed by the start of that group, so for example
 * when 30 daily values are grouped into one month, that month's x value
 * will be the 1st of the month. This apparently shifts the data to
 * the left. When the smoothed option is true, this is compensated for.
 * The data is shifted to the middle of the group, and min and max
 * values are preserved. Internally, this is used in the Navigator series.
 *
 * @type      {boolean}
 * @default   false
 * @product   highstock
 * @apioption plotOptions.series.dataGrouping.smoothed
 */

/**
 * An array determining what time intervals the data is allowed to be
 * grouped to. Each array item is an array where the first value is
 * the time unit and the second value another array of allowed multiples.
 * Defaults to:
 *
 * <pre>units: [[
 *     'millisecond', // unit name
 *     [1, 2, 5, 10, 20, 25, 50, 100, 200, 500] // allowed multiples
 * ], [
 *     'second',
 *     [1, 2, 5, 10, 15, 30]
 * ], [
 *     'minute',
 *     [1, 2, 5, 10, 15, 30]
 * ], [
 *     'hour',
 *     [1, 2, 3, 4, 6, 8, 12]
 * ], [
 *     'day',
 *     [1]
 * ], [
 *     'week',
 *     [1]
 * ], [
 *     'month',
 *     [1, 3, 6]
 * ], [
 *     'year',
 *     null
 * ]]</pre>
 *
 * @type      {Array<Array<string,(Array<number>|null)>>}
 * @product   highstock
 * @apioption plotOptions.series.dataGrouping.units
 */

/**
 * The approximate pixel width of each group. If for example a series
 * with 30 points is displayed over a 600 pixel wide plot area, no grouping
 * is performed. If however the series contains so many points that
 * the spacing is less than the groupPixelWidth, Highcharts will try
 * to group it into appropriate groups so that each is more or less
 * two pixels wide. Defaults to `10`.
 *
 * @sample {highstock} stock/plotoptions/series-datagrouping-grouppixelwidth/
 *         Two series with the same data density but different groupPixelWidth
 *
 * @type      {number}
 * @default   10
 * @product   highstock
 * @apioption plotOptions.column.dataGrouping.groupPixelWidth
 */


var approximations = H.approximations = {
    sum: function (arr) {
        var len = arr.length,
            ret;

        // 1. it consists of nulls exclusive
        if (!len && arr.hasNulls) {
            ret = null;
        // 2. it has a length and real values
        } else if (len) {
            ret = 0;
            while (len--) {
                ret += arr[len];
            }
        }
        // 3. it has zero length, so just return undefined
        // => doNothing()

        return ret;
    },
    average: function (arr) {
        var len = arr.length,
            ret = approximations.sum(arr);

        // If we have a number, return it divided by the length. If not,
        // return null or undefined based on what the sum method finds.
        if (isNumber(ret) && len) {
            ret = ret / len;
        }

        return ret;
    },
    // The same as average, but for series with multiple values, like area
    // ranges.
    averages: function () { // #5479
        var ret = [];

        [].forEach.call(arguments, function (arr) {
            ret.push(approximations.average(arr));
        });

        // Return undefined when first elem. is undefined and let
        // sum method handle null (#7377)
        return ret[0] === undefined ? undefined : ret;
    },
    open: function (arr) {
        return arr.length ? arr[0] : (arr.hasNulls ? null : undefined);
    },
    high: function (arr) {
        return arr.length ?
            arrayMax(arr) :
            (arr.hasNulls ? null : undefined);
    },
    low: function (arr) {
        return arr.length ?
            arrayMin(arr) :
            (arr.hasNulls ? null : undefined);
    },
    close: function (arr) {
        return arr.length ?
            arr[arr.length - 1] :
            (arr.hasNulls ? null : undefined);
    },
    // ohlc and range are special cases where a multidimensional array is
    // input and an array is output
    ohlc: function (open, high, low, close) {
        open = approximations.open(open);
        high = approximations.high(high);
        low = approximations.low(low);
        close = approximations.close(close);

        if (
            isNumber(open) ||
            isNumber(high) ||
            isNumber(low) ||
            isNumber(close)
        ) {
            return [open, high, low, close];
        }
        // else, return is undefined
    },
    range: function (low, high) {
        low = approximations.low(low);
        high = approximations.high(high);
        if (isNumber(low) || isNumber(high)) {
            return [low, high];
        }
        if (low === null && high === null) {
            return null;
        }
        // else, return is undefined
    }
};

var groupData = function (xData, yData, groupPositions, approximation) {
    var series = this,
        data = series.data,
        dataOptions = series.options && series.options.data,
        groupedXData = [],
        groupedYData = [],
        groupMap = [],
        dataLength = xData.length,
        pointX,
        pointY,
        groupedY,
        // when grouping the fake extended axis for panning,
        // we don't need to consider y
        handleYData = !!yData,
        values = [],
        approximationFn,
        pointArrayMap = series.pointArrayMap,
        pointArrayMapLength = pointArrayMap && pointArrayMap.length,
        extendedPointArrayMap = ['x'].concat(pointArrayMap || ['y']),
        pos = 0,
        start = 0,
        valuesLen,
        i,
        j;

    function getApproximation(approx) {
        if (typeof approx === 'function') {
            return approx;
        }
        if (approximations[approx]) {
            return approximations[approx];
        }
        return approximations[
            (series.getDGApproximation && series.getDGApproximation()) ||
            'average'
        ];
    }
    approximationFn = getApproximation(approximation);

    // Calculate values array size from pointArrayMap length
    if (pointArrayMapLength) {
        pointArrayMap.forEach(function () {
            values.push([]);
        });
    } else {
        values.push([]);
    }
    valuesLen = pointArrayMapLength || 1;

    // Start with the first point within the X axis range (#2696)
    for (i = 0; i <= dataLength; i++) {
        if (xData[i] >= groupPositions[0]) {
            break;
        }
    }

    for (i; i <= dataLength; i++) {

        // when a new group is entered, summarize and initialize
        // the previous group
        while (
            (
                groupPositions[pos + 1] !== undefined &&
                xData[i] >= groupPositions[pos + 1]
            ) ||
            i === dataLength
        ) { // get the last group

            // get group x and y
            pointX = groupPositions[pos];
            series.dataGroupInfo = {
                start: series.cropStart + start,
                length: values[0].length
            };
            groupedY = approximationFn.apply(series, values);

            // By default, let options of the first grouped point be passed over
            // to the grouped point. This allows preserving properties like
            // `name` and `color` or custom properties. Implementers can
            // override this from the approximation function, where they can
            // write custom options to `this.dataGroupInfo.options`.
            if (series.pointClass && !defined(series.dataGroupInfo.options)) {
                // Convert numbers and arrays into objects
                series.dataGroupInfo.options = merge(
                    series.pointClass.prototype
                        .optionsToObject.call(
                            { series: series },
                            series.options.data[series.cropStart + start]
                        )
                );

                // Make sure the raw data (x, y, open, high etc) is not copied
                // over and overwriting approximated data.
                extendedPointArrayMap.forEach(function (key) { // eslint-disable-line
                    delete series.dataGroupInfo.options[key];
                });
            }

            // push the grouped data
            if (groupedY !== undefined) {
                groupedXData.push(pointX);
                groupedYData.push(groupedY);
                groupMap.push(series.dataGroupInfo);
            }

            // reset the aggregate arrays
            start = i;
            for (j = 0; j < valuesLen; j++) {
                values[j].length = 0; // faster than values[j] = []
                values[j].hasNulls = false;
            }

            // Advance on the group positions
            pos += 1;

            // don't loop beyond the last group
            if (i === dataLength) {
                break;
            }
        }

        // break out
        if (i === dataLength) {
            break;
        }

        // for each raw data point, push it to an array that contains all values
        // for this specific group
        if (pointArrayMap) {

            var index = series.cropStart + i,
                point = (data && data[index]) ||
                    series.pointClass.prototype.applyOptions.apply({
                        series: series
                    }, [dataOptions[index]]),
                val;

            for (j = 0; j < pointArrayMapLength; j++) {
                val = point[pointArrayMap[j]];
                if (isNumber(val)) {
                    values[j].push(val);
                } else if (val === null) {
                    values[j].hasNulls = true;
                }
            }

        } else {
            pointY = handleYData ? yData[i] : null;

            if (isNumber(pointY)) {
                values[0].push(pointY);
            } else if (pointY === null) {
                values[0].hasNulls = true;
            }
        }
    }

    return {
        groupedXData: groupedXData,
        groupedYData: groupedYData,
        groupMap: groupMap
    };
};

var dataGrouping = {
    approximations: approximations,
    groupData: groupData
};


// -----------------------------------------------------------------------------
// The following code applies to implementation of data grouping on a Series

var seriesProto = Series.prototype,
    baseProcessData = seriesProto.processData,
    baseGeneratePoints = seriesProto.generatePoints,

    /**
     * @ignore
     */
    commonOptions = {
        // enabled: null, // (true for stock charts, false for basic),
        // forced: undefined,
        groupPixelWidth: 2,
        // the first one is the point or start value, the second is the start
        // value if we're dealing with range, the third one is the end value if
        // dealing with a range
        dateTimeLabelFormats: {
            millisecond: [
                '%A, %b %e, %H:%M:%S.%L',
                '%A, %b %e, %H:%M:%S.%L',
                '-%H:%M:%S.%L'
            ],
            second: [
                '%A, %b %e, %H:%M:%S',
                '%A, %b %e, %H:%M:%S',
                '-%H:%M:%S'
            ],
            minute: [
                '%A, %b %e, %H:%M',
                '%A, %b %e, %H:%M',
                '-%H:%M'
            ],
            hour: [
                '%A, %b %e, %H:%M',
                '%A, %b %e, %H:%M',
                '-%H:%M'
            ],
            day: [
                '%A, %b %e, %Y',
                '%A, %b %e',
                '-%A, %b %e, %Y'
            ],
            week: [
                'Week from %A, %b %e, %Y',
                '%A, %b %e',
                '-%A, %b %e, %Y'
            ],
            month: [
                '%B %Y',
                '%B',
                '-%B %Y'
            ],
            year: [
                '%Y',
                '%Y',
                '-%Y'
            ]
        }
        // smoothed = false, // enable this for navigator series only
    },

    specificOptions = { // extends common options
        line: {},
        spline: {},
        area: {},
        areaspline: {},
        column: {
            groupPixelWidth: 10
        },
        columnrange: {
            groupPixelWidth: 10
        },
        candlestick: {
            groupPixelWidth: 10
        },
        ohlc: {
            groupPixelWidth: 5
        }
    },

    // units are defined in a separate array to allow complete overriding in
    // case of a user option
    defaultDataGroupingUnits = H.defaultDataGroupingUnits = [
        [
            'millisecond', // unit name
            [1, 2, 5, 10, 20, 25, 50, 100, 200, 500] // allowed multiples
        ], [
            'second',
            [1, 2, 5, 10, 15, 30]
        ], [
            'minute',
            [1, 2, 5, 10, 15, 30]
        ], [
            'hour',
            [1, 2, 3, 4, 6, 8, 12]
        ], [
            'day',
            [1]
        ], [
            'week',
            [1]
        ], [
            'month',
            [1, 3, 6]
        ], [
            'year',
            null
        ]
    ];


// Set default approximations to the prototypes if present. Properties are
// inherited down. Can be overridden for individual series types.
seriesProto.getDGApproximation = function () {
    if (H.seriesTypes.arearange && this instanceof H.seriesTypes.arearange) {
        return 'range';
    }
    if (H.seriesTypes.ohlc && this instanceof H.seriesTypes.ohlc) {
        return 'ohlc';
    }
    if (H.seriesTypes.column && this instanceof H.seriesTypes.column) {
        return 'sum';
    }
    return 'average';
};

/**
 * Define the available approximation types. The data grouping
 * approximations takes an array or numbers as the first parameter. In case
 * of ohlc, four arrays are sent in as four parameters. Each array consists
 * only of numbers. In case null values belong to the group, the property
 * .hasNulls will be set to true on the array.
 *
 * @product highstock
 *
 * @private
 * @name Highcharts.approximations
 * @type {Highcharts.Dictionary<Function>}
 */

/**
 * Takes parallel arrays of x and y data and groups the data into intervals
 * defined by groupPositions, a collection of starting x values for each group.
 *
 * @private
 * @function Highcharts.Series#groupData
 *
 * @param {Array<number>} xData
 *
 * @param {Array<number>} yData
 *
 * @param {boolean} groupPositions
 *
 * @param {string|Function} approximation
 *
 * @return {Array<Array<number>,Array<number>,Array<object>>}
 */
seriesProto.groupData = groupData;

// Extend the basic processData method, that crops the data to the current zoom
// range, with data grouping logic.
seriesProto.processData = function () {
    var series = this,
        chart = series.chart,
        options = series.options,
        dataGroupingOptions = options.dataGrouping,
        groupingEnabled = series.allowDG !== false && dataGroupingOptions &&
            pick(dataGroupingOptions.enabled, chart.options.isStock),
        visible = series.visible || !chart.options.chart.ignoreHiddenSeries,
        hasGroupedData,
        skip,
        lastDataGrouping = this.currentDataGrouping,
        currentDataGrouping,
        croppedData,
        revertRequireSorting = false;

    // Run base method
    series.forceCrop = groupingEnabled; // #334
    series.groupPixelWidth = null; // #2110
    series.hasProcessed = true; // #2692

    // Data needs to be sorted for dataGrouping
    if (groupingEnabled && !series.requireSorting) {
        series.requireSorting = revertRequireSorting = true;
    }

    // Skip if processData returns false or if grouping is disabled (in that
    // order)
    skip = (
        baseProcessData.apply(series, arguments) === false ||
        !groupingEnabled
    );

    // Revert original requireSorting value if changed
    if (revertRequireSorting) {
        series.requireSorting = false;
    }

    if (!skip) {
        series.destroyGroupedData();

        var i,
            processedXData = dataGroupingOptions.groupAll ? series.xData :
                series.processedXData,
            processedYData = dataGroupingOptions.groupAll ? series.yData :
                series.processedYData,
            plotSizeX = chart.plotSizeX,
            xAxis = series.xAxis,
            ordinal = xAxis.options.ordinal,
            groupPixelWidth = series.groupPixelWidth =
                xAxis.getGroupPixelWidth && xAxis.getGroupPixelWidth();

        // Execute grouping if the amount of points is greater than the limit
        // defined in groupPixelWidth
        if (groupPixelWidth) {
            hasGroupedData = true;

            // Force recreation of point instances in series.translate, #5699
            series.isDirty = true;
            series.points = null; // #6709

            var extremes = xAxis.getExtremes(),
                xMin = extremes.min,
                xMax = extremes.max,
                groupIntervalFactor = (
                    ordinal &&
                    xAxis.getGroupIntervalFactor(xMin, xMax, series)
                ) || 1,
                interval =
                    (groupPixelWidth * (xMax - xMin) / plotSizeX) *
                    groupIntervalFactor,
                groupPositions = xAxis.getTimeTicks(
                    xAxis.normalizeTimeTickInterval(
                        interval,
                        dataGroupingOptions.units || defaultDataGroupingUnits
                    ),
                    // Processed data may extend beyond axis (#4907)
                    Math.min(xMin, processedXData[0]),
                    Math.max(xMax, processedXData[processedXData.length - 1]),
                    xAxis.options.startOfWeek,
                    processedXData,
                    series.closestPointRange
                ),
                groupedData = seriesProto.groupData.apply(
                    series,
                    [
                        processedXData,
                        processedYData,
                        groupPositions,
                        dataGroupingOptions.approximation
                    ]
                ),
                groupedXData = groupedData.groupedXData,
                groupedYData = groupedData.groupedYData,
                gapSize = 0;

            // Prevent the smoothed data to spill out left and right, and make
            // sure data is not shifted to the left
            if (dataGroupingOptions.smoothed && groupedXData.length) {
                i = groupedXData.length - 1;
                groupedXData[i] = Math.min(groupedXData[i], xMax);
                while (i-- && i > 0) {
                    groupedXData[i] += interval / 2;
                }
                groupedXData[0] = Math.max(groupedXData[0], xMin);
            }

            // Record what data grouping values were used
            for (i = 1; i < groupPositions.length; i++) {
                // The grouped gapSize needs to be the largest distance between
                // the group to capture varying group sizes like months or DST
                // crossing (#10000). Also check that the gap is not at the
                // start of a segment.
                if (
                    !groupPositions.info.segmentStarts ||
                    groupPositions.info.segmentStarts.indexOf(i) === -1
                ) {
                    gapSize = Math.max(
                        groupPositions[i] - groupPositions[i - 1],
                        gapSize
                    );
                }
            }
            currentDataGrouping = groupPositions.info;
            currentDataGrouping.gapSize = gapSize;
            series.closestPointRange = groupPositions.info.totalRange;
            series.groupMap = groupedData.groupMap;

            // Make sure the X axis extends to show the first group (#2533)
            // But only for visible series (#5493, #6393)
            if (
                defined(groupedXData[0]) &&
                groupedXData[0] < xAxis.dataMin &&
                visible
            ) {
                if (
                    (
                        !defined(xAxis.options.min) &&
                        xAxis.min <= xAxis.dataMin
                    ) ||
                    xAxis.min === xAxis.dataMin
                ) {
                    xAxis.min = groupedXData[0];
                }
                xAxis.dataMin = groupedXData[0];
            }

            // We calculated all group positions but we should render
            // only the ones within the visible range
            if (dataGroupingOptions.groupAll) {
                croppedData = series.cropData(
                    groupedXData,
                    groupedYData,
                    xAxis.min,
                    xAxis.max,
                    1 // Ordinal xAxis will remove left-most points otherwise
                );
                groupedXData = croppedData.xData;
                groupedYData = croppedData.yData;
            }
            // Set series props
            series.processedXData = groupedXData;
            series.processedYData = groupedYData;
        } else {
            series.groupMap = null;
        }
        series.hasGroupedData = hasGroupedData;
        series.currentDataGrouping = currentDataGrouping;

        series.preventGraphAnimation =
            (lastDataGrouping && lastDataGrouping.totalRange) !==
            (currentDataGrouping && currentDataGrouping.totalRange);
    }
};

// Destroy the grouped data points. #622, #740
seriesProto.destroyGroupedData = function () {

    var groupedData = this.groupedData;

    // clear previous groups
    (groupedData || []).forEach(function (point, i) {
        if (point) {
            groupedData[i] = point.destroy ? point.destroy() : null;
        }
    });
    this.groupedData = null;
};

// Override the generatePoints method by adding a reference to grouped data
seriesProto.generatePoints = function () {

    baseGeneratePoints.apply(this);

    // Record grouped data in order to let it be destroyed the next time
    // processData runs
    this.destroyGroupedData(); // #622
    this.groupedData = this.hasGroupedData ? this.points : null;
};

// Override point prototype to throw a warning when trying to update grouped
// points.
addEvent(Point, 'update', function () {
    if (this.dataGroup) {
        H.error(24, false, this.series.chart);
        return false;
    }
});

// Extend the original method, make the tooltip's header reflect the grouped
// range.
addEvent(Tooltip, 'headerFormatter', function (e) {
    var tooltip = this,
        time = this.chart.time,
        labelConfig = e.labelConfig,
        series = labelConfig.series,
        options = series.options,
        tooltipOptions = series.tooltipOptions,
        dataGroupingOptions = options.dataGrouping,
        xDateFormat = tooltipOptions.xDateFormat,
        xDateFormatEnd,
        xAxis = series.xAxis,
        currentDataGrouping,
        dateTimeLabelFormats,
        labelFormats,
        formattedKey,
        formatString = tooltipOptions[
            (e.isFooter ? 'footer' : 'header') + 'Format'
        ];

    // apply only to grouped series
    if (
        xAxis &&
        xAxis.options.type === 'datetime' &&
        dataGroupingOptions &&
        isNumber(labelConfig.key)
    ) {

        // set variables
        currentDataGrouping = series.currentDataGrouping;
        dateTimeLabelFormats = dataGroupingOptions.dateTimeLabelFormats ||
            // Fallback to commonOptions (#9693)
            commonOptions.dateTimeLabelFormats;

        // if we have grouped data, use the grouping information to get the
        // right format
        if (currentDataGrouping) {
            labelFormats = dateTimeLabelFormats[currentDataGrouping.unitName];
            if (currentDataGrouping.count === 1) {
                xDateFormat = labelFormats[0];
            } else {
                xDateFormat = labelFormats[1];
                xDateFormatEnd = labelFormats[2];
            }
        // if not grouped, and we don't have set the xDateFormat option, get the
        // best fit, so if the least distance between points is one minute, show
        // it, but if the least distance is one day, skip hours and minutes etc.
        } else if (!xDateFormat && dateTimeLabelFormats) {
            xDateFormat = tooltip.getXDateFormat(
                labelConfig,
                tooltipOptions,
                xAxis
            );
        }

        // now format the key
        formattedKey = time.dateFormat(xDateFormat, labelConfig.key);
        if (xDateFormatEnd) {
            formattedKey += time.dateFormat(
                xDateFormatEnd,
                labelConfig.key + currentDataGrouping.totalRange - 1
            );
        }

        // Replace default header style with class name
        if (series.chart.styledMode) {
            formatString = this.styledModeFormat(formatString);
        }

        // return the replaced format
        e.text = format(
            formatString, {
                point: extend(labelConfig.point, { key: formattedKey }),
                series: series
            },
            time
        );

        e.preventDefault();

    }
});

// Destroy grouped data on series destroy
addEvent(Series, 'destroy', seriesProto.destroyGroupedData);


// Handle default options for data grouping. This must be set at runtime because
// some series types are defined after this.
addEvent(Series, 'afterSetOptions', function (e) {

    var options = e.options,
        type = this.type,
        plotOptions = this.chart.options.plotOptions,
        defaultOptions = defaultPlotOptions[type].dataGrouping,
        // External series, for example technical indicators should also
        // inherit commonOptions which are not available outside this module
        baseOptions = this.useCommonDataGrouping && commonOptions;

    if (specificOptions[type] || baseOptions) { // #1284
        if (!defaultOptions) {
            defaultOptions = merge(commonOptions, specificOptions[type]);
        }

        options.dataGrouping = merge(
            baseOptions,
            defaultOptions,
            plotOptions.series && plotOptions.series.dataGrouping, // #1228
            plotOptions[type].dataGrouping, // Set by the StockChart constructor
            this.userOptions.dataGrouping
        );
    }
});

// When resetting the scale reset the hasProccessed flag to avoid taking
// previous data grouping of neighbour series into accound when determining
// group pixel width (#2692).
addEvent(Axis, 'afterSetScale', function () {
    this.series.forEach(function (series) {
        series.hasProcessed = false;
    });
});

// Get the data grouping pixel width based on the greatest defined individual
// width of the axis' series, and if whether one of the axes need grouping.
Axis.prototype.getGroupPixelWidth = function () {

    var series = this.series,
        len = series.length,
        i,
        groupPixelWidth = 0,
        doGrouping = false,
        dataLength,
        dgOptions;

    // If multiple series are compared on the same x axis, give them the same
    // group pixel width (#334)
    i = len;
    while (i--) {
        dgOptions = series[i].options.dataGrouping;
        if (dgOptions) {
            groupPixelWidth = Math.max(
                groupPixelWidth,
                // Fallback to commonOptions (#9693)
                pick(dgOptions.groupPixelWidth, commonOptions.groupPixelWidth)
            );

        }
    }

    // If one of the series needs grouping, apply it to all (#1634)
    i = len;
    while (i--) {
        dgOptions = series[i].options.dataGrouping;

        if (dgOptions && series[i].hasProcessed) { // #2692

            dataLength = (series[i].processedXData || series[i].data).length;

            // Execute grouping if the amount of points is greater than the
            // limit defined in groupPixelWidth
            if (
                series[i].groupPixelWidth ||
                dataLength > (this.chart.plotSizeX / groupPixelWidth) ||
                (dataLength && dgOptions.forced)
            ) {
                doGrouping = true;
            }
        }
    }

    return doGrouping ? groupPixelWidth : 0;
};

/**
 * Highstock only. Force data grouping on all the axis' series.
 *
 * @product highstock
 *
 * @function Highcharts.Axis#setDataGrouping
 *
 * @param {boolean|Highcharts.PlotSeriesDataGroupingOptions} [dataGrouping]
 *        A `dataGrouping` configuration. Use `false` to disable data grouping
 *        dynamically.
 *
 * @param {boolean} [redraw=true]
 *        Whether to redraw the chart or wait for a later call to
 *        {@link Chart#redraw}.
 */
Axis.prototype.setDataGrouping = function (dataGrouping, redraw) {
    var i;

    redraw = pick(redraw, true);

    if (!dataGrouping) {
        dataGrouping = {
            forced: false,
            units: null
        };
    }

    // Axis is instantiated, update all series
    if (this instanceof Axis) {
        i = this.series.length;
        while (i--) {
            this.series[i].update({
                dataGrouping: dataGrouping
            }, false);
        }

    // Axis not yet instanciated, alter series options
    } else {
        this.chart.options.series.forEach(function (seriesOptions) {
            seriesOptions.dataGrouping = dataGrouping;
        }, false);
    }

    // Clear ordinal slope, so we won't accidentaly use the old one (#7827)
    this.ordinalSlope = null;

    if (redraw) {
        this.chart.redraw();
    }
};

H.dataGrouping = dataGrouping;
export default dataGrouping;

/* ************************************************************************** *
 *  End data grouping module                                                  *
 * ************************************************************************** */
