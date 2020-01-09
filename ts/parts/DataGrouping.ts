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

import H from './Globals.js';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface Axis {
            getGroupPixelWidth(): number;
            setDataGrouping(
                dataGrouping?: (boolean|DataGroupingOptionsObject),
                redraw?: boolean
            ): void;
        }
        interface ColumnSeriesOptions {
            groupPixelWidth?: number;
        }
        interface ColumnRangeSeriesOptions {
            groupPixelWidth?: number;
        }
        interface DataGrounpingApproximationsArray extends Array<number> {
            hasNulls?: boolean;
        }
        interface DataGroupingApproximationsDictionary
            extends Dictionary<(Function|undefined)>
        {
            average: (
                arr: DataGrounpingApproximationsArray
            ) => (null|number|undefined);
            averages: (
                ...arrs: DataGrounpingApproximationsArray
            ) => (Array<(null|number|undefined)>|undefined);
            close: (
                arr: DataGrounpingApproximationsArray
            ) => (null|number|undefined);
            high: (
                arr: DataGrounpingApproximationsArray
            ) => (null|number|undefined);
            low: (
                arr: DataGrounpingApproximationsArray
            ) => (null|number|undefined);
            open: (
                arr: DataGrounpingApproximationsArray
            ) => (null|number|undefined);
            sum: (
                arr: DataGrounpingApproximationsArray
            ) => (null|number|undefined);
            ohlc: (
                open: DataGrounpingApproximationsArray,
                high: DataGrounpingApproximationsArray,
                low: DataGrounpingApproximationsArray,
                close: DataGrounpingApproximationsArray
            ) => ([number, number, number, number]|undefined);
            range: (
                low: DataGrounpingApproximationsArray,
                high: DataGrounpingApproximationsArray
            ) => ([number, number]|null|undefined);
        }
        interface DataGroupingFunctionsObject {
            approximations: DataGroupingApproximationsDictionary;
            groupData: Series['groupData'];
        }
        interface DataGroupingInfoObject {
            length?: number;
            options?: SeriesOptionsType;
            start?: number;
        }
        interface DataGroupingOptionsObject {
            approximation?: (DataGroupingApproximationValue|Function);
            dateTimeLabelFormats?: Dictionary<Array<string>>;
            enabled?: boolean;
            forced?: boolean;
            groupAll?: boolean;
            groupPixelWidth?: number;
            smoothed?: boolean;
            units?: Array<[string, (Array<number>|null)]>;
        }
        interface DataGroupingResultObject {
            groupedXData: Array<number>;
            groupedYData: (
                Array<(number|null|undefined)>|
                Array<Array<(number|null|undefined)>>
            );
            groupMap: Array<DataGroupingInfoObject>;
        }
        interface Series {
            cropStart?: number;
            currentDataGrouping?: TimeTicksInfoObject;
            dataGroupInfo?: DataGroupingInfoObject;
            forceCrop?: boolean;
            groupedData?: (Array<Point>|null);
            groupMap?: Array<DataGroupingInfoObject>;
            groupPixelWidth?: number;
            hasGroupedData?: boolean;
            hasProcessed?: boolean;
            preventGraphAnimation?: boolean;
            destroyGroupedData(): void;
            generatePoints(): void;
            getDGApproximation(): string;
            groupData(
                xData: Array<number>,
                yData: (Array<number>|Array<Array<number>>),
                groupPosition: Array<number>,
                approximation: (string|Function)
            ): DataGroupingResultObject;
        }
        interface TimeTicksInfoObject {
            gapSize?: number;
        }
        let approximations: DataGroupingApproximationsDictionary;
        let dataGrouping: DataGroupingFunctionsObject;
        let defaultDataGroupingUnits: Array<[string, (Array<number>|null)]>;
        type DataGroupingApproximationValue = (
            'average'|'averages'|'ohlc'|'open'|'high'|'low'|'close'|'sum'|
            'windbarb'|'ichimoku-averages'
        );
    }
}

/**
 * @typedef {"average"|"averages"|"open"|"high"|"low"|"close"|"sum"} Highcharts.DataGroupingApproximationValue
 */

/**
 * @interface Highcharts.DataGroupingInfoObject
 *//**
 * @name Highcharts.DataGroupingInfoObject#length
 * @type {number}
 *//**
 * @name Highcharts.DataGroupingInfoObject#options
 * @type {Highcharts.SeriesOptionsType|undefined}
 *//**
 * @name Highcharts.DataGroupingInfoObject#start
 * @type {number}
 */

import U from './Utilities.js';
const {
    arrayMax,
    arrayMin,
    correctFloat,
    defined,
    extend,
    isNumber,
    pick
} = U;

import './Axis.js';
import './Series.js';
import './Tooltip.js';

var addEvent = H.addEvent,
    Axis = H.Axis,
    defaultPlotOptions = H.defaultPlotOptions,
    format = H.format,
    merge = H.merge,
    Point = H.Point,
    Series = H.Series,
    Tooltip = H.Tooltip;

/* ************************************************************************** *
 *  Start data grouping module                                                *
 * ************************************************************************** */

/* eslint-disable no-invalid-this, valid-jsdoc */

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
var approximations: Highcharts.DataGroupingApproximationsDictionary =
H.approximations = {
    sum: function (
        arr: Highcharts.DataGrounpingApproximationsArray
    ): (null|number|undefined) {
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
    average: function (
        arr: Highcharts.DataGrounpingApproximationsArray
    ): (null|number|undefined) {
        var len = arr.length,
            ret = approximations.sum(arr);

        // If we have a number, return it divided by the length. If not,
        // return null or undefined based on what the sum method finds.
        if (isNumber(ret) && len) {
            ret = correctFloat((ret as any) / len);
        }

        return ret;
    },
    // The same as average, but for series with multiple values, like area
    // ranges.
    averages: function (): (Array<(null|number|undefined)>|undefined) { // #5479
        var ret = [] as Array<(null|number|undefined)>;

        [].forEach.call(arguments, function (
            arr: Highcharts.DataGrounpingApproximationsArray
        ): void {
            ret.push(approximations.average(arr));
        });

        // Return undefined when first elem. is undefined and let
        // sum method handle null (#7377)
        return typeof ret[0] === 'undefined' ? void 0 : ret;
    },
    open: function (
        arr: Highcharts.DataGrounpingApproximationsArray
    ): (null|number|undefined) {
        return arr.length ? arr[0] : ((arr as any).hasNulls ? null : void 0);
    },
    high: function (
        arr: Highcharts.DataGrounpingApproximationsArray
    ): (null|number|undefined) {
        return arr.length ?
            arrayMax(arr) :
            (arr.hasNulls ? null : void 0);
    },
    low: function (
        arr: Highcharts.DataGrounpingApproximationsArray
    ): (null|number|undefined) {
        return arr.length ?
            arrayMin(arr) :
            (arr.hasNulls ? null : void 0);
    },
    close: function (
        arr: Highcharts.DataGrounpingApproximationsArray
    ): (null|number|undefined) {
        return arr.length ?
            arr[arr.length - 1] :
            (arr.hasNulls ? null : void 0);
    },
    // ohlc and range are special cases where a multidimensional array is
    // input and an array is output
    ohlc: function (
        open: Highcharts.DataGrounpingApproximationsArray,
        high: Highcharts.DataGrounpingApproximationsArray,
        low: Highcharts.DataGrounpingApproximationsArray,
        close: Highcharts.DataGrounpingApproximationsArray
    ): ([number, number, number, number]|undefined) {
        open = approximations.open(open) as any;
        high = approximations.high(high) as any;
        low = approximations.low(low) as any;
        close = approximations.close(close) as any;

        if (
            isNumber(open) ||
            isNumber(high) ||
            isNumber(low) ||
            isNumber(close)
        ) {
            return [open, high, low, close] as any;
        }
        // else, return is undefined
    },
    range: function (
        low: Highcharts.DataGrounpingApproximationsArray,
        high: Highcharts.DataGrounpingApproximationsArray
    ): ([number, number]|null|undefined) {
        low = approximations.low(low) as any;
        high = approximations.high(high) as any;
        if (isNumber(low) || isNumber(high)) {
            return [low, high] as any;
        }
        if (low === null && high === null) {
            return null;
        }
        // else, return is undefined
    }
};

var groupData = function (
    this: Highcharts.Series,
    xData: Array<number>,
    yData: (
        Array<(number|null|undefined)>|
        Array<Array<(number|null|undefined)>>
    ),
    groupPositions: Array<number>,
    approximation: (string|Function)
): Highcharts.DataGroupingResultObject {
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
        values = [] as Array<Highcharts.DataGrounpingApproximationsArray>,
        approximationFn,
        pointArrayMap = series.pointArrayMap,
        pointArrayMapLength = pointArrayMap && pointArrayMap.length,
        extendedPointArrayMap = ['x'].concat(pointArrayMap || ['y']),
        pos = 0,
        start = 0,
        valuesLen,
        i,
        j;

    /**
     * @private
     */
    function getApproximation(approx: (string|Function)): Function {
        if (typeof approx === 'function') {
            return approx;
        }
        if (approximations[approx]) {
            return approximations[approx] as any;
        }
        return approximations[
            (series.getDGApproximation && series.getDGApproximation()) ||
            'average'
        ] as any;
    }
    approximationFn = getApproximation(approximation);

    // Calculate values array size from pointArrayMap length
    if (pointArrayMapLength) {
        (pointArrayMap as any).forEach(function (): void {
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
                typeof groupPositions[pos + 1] !== 'undefined' &&
                xData[i] >= groupPositions[pos + 1]
            ) ||
            i === dataLength
        ) { // get the last group

            // get group x and y
            pointX = groupPositions[pos];
            series.dataGroupInfo = {
                start: (series.cropStart as any) + start,
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
                            (series.options.data as any)[
                                (series.cropStart as any) + start
                            ]
                        )
                );

                // Make sure the raw data (x, y, open, high etc) is not copied
                // over and overwriting approximated data.
                extendedPointArrayMap.forEach(function (key: string): void {
                    delete ((series.dataGroupInfo as any).options as any)[key];
                });
            }

            // push the grouped data
            if (typeof groupedY !== 'undefined') {
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

            var index = (series.cropStart as any) + i,
                point = (data && data[index]) ||
                    series.pointClass.prototype.applyOptions.apply({
                        series: series
                    }, [(dataOptions as any)[index]]),
                val;

            for (j = 0; j < (pointArrayMapLength as any); j++) {
                val = (point as any)[pointArrayMap[j]];
                if (isNumber(val)) {
                    values[j].push(val);
                } else if (val === null) {
                    values[j].hasNulls = true;
                }
            }

        } else {
            pointY = handleYData ? yData[i] : null;

            if (isNumber(pointY)) {
                values[0].push(pointY as any);
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
    /** @ignore */
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
        arearange: {},
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
    } as Highcharts.PlotOptions,

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
seriesProto.getDGApproximation = function (this: Highcharts.Series): string {
    if (this.is('arearange')) {
        return 'range';
    }
    if (this.is('ohlc')) {
        return 'ohlc';
    }
    if (this.is('column')) {
        return 'sum';
    }
    return 'average';
};

/**
 * Takes parallel arrays of x and y data and groups the data into intervals
 * defined by groupPositions, a collection of starting x values for each group.
 *
 * @private
 * @function Highcharts.Series#groupData
 *
 * @param {Array<number>} xData
 *
 * @param {Array<number>|Array<Array<number>>} yData
 *
 * @param {boolean} groupPositions
 *
 * @param {string|Function} approximation
 *
 * @return {void}
 */
seriesProto.groupData = groupData;

// Extend the basic processData method, that crops the data to the current zoom
// range, with data grouping logic.
seriesProto.processData = function (this: Highcharts.Series): any {
    var series = this,
        chart = series.chart,
        options = series.options,
        dataGroupingOptions = options.dataGrouping,
        groupingEnabled = series.allowDG !== false && dataGroupingOptions &&
            pick(dataGroupingOptions.enabled, chart.options.isStock),
        visible = (
            series.visible || !(chart.options.chart as any).ignoreHiddenSeries
        ),
        hasGroupedData,
        skip,
        lastDataGrouping = this.currentDataGrouping,
        currentDataGrouping,
        croppedData,
        revertRequireSorting = false;

    // Run base method
    series.forceCrop = groupingEnabled; // #334
    series.groupPixelWidth = null as any; // #2110
    series.hasProcessed = true; // #2692

    // Data needs to be sorted for dataGrouping
    if (groupingEnabled && !series.requireSorting) {
        series.requireSorting = revertRequireSorting = true;
    }

    // Skip if processData returns false or if grouping is disabled (in that
    // order)
    skip = (
        baseProcessData.apply(series, arguments as any) === false ||
        !groupingEnabled
    );

    // Revert original requireSorting value if changed
    if (revertRequireSorting) {
        series.requireSorting = false;
    }

    if (!skip) {
        series.destroyGroupedData();

        var i,
            processedXData = (dataGroupingOptions as any).groupAll ?
                series.xData :
                series.processedXData,
            processedYData = (dataGroupingOptions as any).groupAll ?
                series.yData :
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
            series.points = null as any; // #6709

            var extremes = xAxis.getExtremes(),
                xMin = extremes.min,
                xMax = extremes.max,
                groupIntervalFactor = (
                    ordinal &&
                    xAxis.getGroupIntervalFactor(xMin, xMax, series)
                ) || 1,
                interval =
                    (groupPixelWidth * (xMax - xMin) / (plotSizeX as any)) *
                    groupIntervalFactor,
                groupPositions = xAxis.getTimeTicks(
                    xAxis.normalizeTimeTickInterval(
                        interval,
                        (dataGroupingOptions as any).units ||
                        defaultDataGroupingUnits
                    ),
                    // Processed data may extend beyond axis (#4907)
                    Math.min(xMin, (processedXData as any)[0]),
                    Math.max(
                        xMax,
                        (processedXData as any)[
                            (processedXData as any).length - 1
                        ]
                    ),
                    xAxis.options.startOfWeek as any,
                    processedXData as any,
                    series.closestPointRange as any
                ),
                groupedData = seriesProto.groupData.apply(
                    series,
                    [
                        processedXData as any,
                        processedYData as any,
                        groupPositions,
                        (dataGroupingOptions as any).approximation
                    ]
                ),
                groupedXData = groupedData.groupedXData,
                groupedYData = groupedData.groupedYData,
                gapSize = 0;

            // Prevent the smoothed data to spill out left and right, and make
            // sure data is not shifted to the left
            if ((dataGroupingOptions as any).smoothed && groupedXData.length) {
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
                if (!(groupPositions.info as any).segmentStarts ||
                    (groupPositions.info as any).segmentStarts.indexOf(i) === -1
                ) {
                    gapSize = Math.max(
                        groupPositions[i] - groupPositions[i - 1],
                        gapSize
                    );
                }
            }
            currentDataGrouping = groupPositions.info;
            (currentDataGrouping as any).gapSize = gapSize;
            series.closestPointRange = (groupPositions.info as any).totalRange;
            series.groupMap = groupedData.groupMap;

            // Make sure the X axis extends to show the first group (#2533)
            // But only for visible series (#5493, #6393)
            if (
                defined(groupedXData[0]) &&
                groupedXData[0] < (xAxis.min as any) &&
                visible
            ) {
                if (
                    (
                        !defined(xAxis.options.min) &&
                        (xAxis.min as any) <= (xAxis.dataMin as any)
                    ) ||
                    xAxis.min === xAxis.dataMin
                ) {
                    xAxis.min = Math.min(groupedXData[0], (xAxis.min as any));
                }

                xAxis.dataMin = Math.min(
                    groupedXData[0],
                    (xAxis.dataMin as any)
                );
            }

            // We calculated all group positions but we should render
            // only the ones within the visible range
            if ((dataGroupingOptions as any).groupAll) {
                croppedData = series.cropData(
                    groupedXData,
                    groupedYData as any,
                    xAxis.min as any,
                    xAxis.max as any,
                    1 // Ordinal xAxis will remove left-most points otherwise
                );
                groupedXData = croppedData.xData;
                groupedYData = croppedData.yData;
            }
            // Set series props
            series.processedXData = groupedXData;
            series.processedYData = groupedYData as any;
        } else {
            series.groupMap = null as any;
        }
        series.hasGroupedData = hasGroupedData;
        series.currentDataGrouping = currentDataGrouping;

        series.preventGraphAnimation =
            (lastDataGrouping && lastDataGrouping.totalRange) !==
            (currentDataGrouping && currentDataGrouping.totalRange);
    }
};

// Destroy the grouped data points. #622, #740
seriesProto.destroyGroupedData = function (this: Highcharts.Series): void {
    // Clear previous groups
    if (this.groupedData) {
        this.groupedData.forEach(function (
            point: Highcharts.Point,
            i: number
        ): void {
            if (point) {
                (this.groupedData as any)[i] = point.destroy ?
                    point.destroy() : null;
            }
        }, this);

        // Clears all:
        // - `this.groupedData`
        // - `this.points`
        // - `preserve` object in series.update()
        this.groupedData.length = 0;
    }
};

// Override the generatePoints method by adding a reference to grouped data
seriesProto.generatePoints = function (this: Highcharts.Series): void {

    baseGeneratePoints.apply(this);

    // Record grouped data in order to let it be destroyed the next time
    // processData runs
    this.destroyGroupedData(); // #622
    this.groupedData = this.hasGroupedData ? this.points : null;
};

// Override point prototype to throw a warning when trying to update grouped
// points.
addEvent(Point, 'update', function (
    this: Highcharts.Point
): (boolean|undefined) {
    if (this.dataGroup) {
        H.error(24, false, this.series.chart);
        return false;
    }
});

// Extend the original method, make the tooltip's header reflect the grouped
// range.
addEvent(Tooltip, 'headerFormatter', function (
    this: Highcharts.Tooltip,
    e: Highcharts.Dictionary<any>
): void {
    var tooltip = this,
        chart = this.chart,
        time = chart.time,
        labelConfig = e.labelConfig,
        series = labelConfig.series as Highcharts.Series,
        options = series.options,
        tooltipOptions = series.tooltipOptions,
        dataGroupingOptions = options.dataGrouping,
        xDateFormat = tooltipOptions.xDateFormat,
        xDateFormatEnd,
        xAxis = series.xAxis,
        currentDataGrouping: (Highcharts.TimeTicksInfoObject|undefined),
        dateTimeLabelFormats,
        labelFormats,
        formattedKey,
        formatString = (tooltipOptions as any)[
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
            labelFormats =
                dateTimeLabelFormats[(currentDataGrouping as any).unitName];
            if ((currentDataGrouping as any).count === 1) {
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
        formattedKey = time.dateFormat(xDateFormat as any, labelConfig.key);
        if (xDateFormatEnd) {
            formattedKey += time.dateFormat(
                xDateFormatEnd,
                labelConfig.key + (currentDataGrouping as any).totalRange - 1
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
            chart
        );

        e.preventDefault();

    }
});

// Destroy grouped data on series destroy
addEvent(Series, 'destroy', seriesProto.destroyGroupedData);


// Handle default options for data grouping. This must be set at runtime because
// some series types are defined after this.
addEvent(Series, 'afterSetOptions', function (
    this: Highcharts.Series,
    e: { options: Highcharts.SeriesOptions }
): void {

    var options = e.options,
        type = this.type,
        plotOptions: Highcharts.PlotOptions =
            this.chart.options.plotOptions as any,
        defaultOptions: Highcharts.DataGroupingOptionsObject =
            (defaultPlotOptions[type] as any).dataGrouping,
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
            // Set by the StockChart constructor:
            (plotOptions[type] as any).dataGrouping,
            this.userOptions.dataGrouping
        );
    }
});

// When resetting the scale reset the hasProccessed flag to avoid taking
// previous data grouping of neighbour series into accound when determining
// group pixel width (#2692).
addEvent(Axis, 'afterSetScale', function (this: Highcharts.Axis): void {
    this.series.forEach(function (series: Highcharts.Series): void {
        series.hasProcessed = false;
    });
});

// Get the data grouping pixel width based on the greatest defined individual
// width of the axis' series, and if whether one of the axes need grouping.
Axis.prototype.getGroupPixelWidth = function (this: Highcharts.Axis): number {

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
                dataLength >
                ((this.chart.plotSizeX as any) / groupPixelWidth) ||
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
 * @param {boolean|Highcharts.DataGroupingOptionsObject} [dataGrouping]
 *        A `dataGrouping` configuration. Use `false` to disable data grouping
 *        dynamically.
 *
 * @param {boolean} [redraw=true]
 *        Whether to redraw the chart or wait for a later call to
 *        {@link Chart#redraw}.
 *
 * @return {void}
 */
Axis.prototype.setDataGrouping = function (
    this: Highcharts.Axis,
    dataGrouping?: (boolean|Highcharts.DataGroupingOptionsObject),
    redraw?: boolean
): void {
    var i;

    redraw = pick(redraw, true);

    if (!dataGrouping) {
        dataGrouping = {
            forced: false,
            units: null as any
        } as Highcharts.DataGroupingOptionsObject;
    }

    // Axis is instantiated, update all series
    if (this instanceof Axis) {
        i = this.series.length;
        while (i--) {
            this.series[i].update({
                dataGrouping: dataGrouping as any
            }, false);
        }

    // Axis not yet instanciated, alter series options
    } else {
        (this as any).chart.options.series.forEach(function (
            seriesOptions: any
        ): void {
            seriesOptions.dataGrouping = dataGrouping;
        }, false);
    }

    // Clear ordinal slope, so we won't accidentaly use the old one (#7827)
    this.ordinalSlope = null as any;

    if (redraw) {
        this.chart.redraw();
    }
};

H.dataGrouping = dataGrouping;
export default dataGrouping;

/* eslint-enable no-invalid-this, valid-jsdoc */

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
 * @declare   Highcharts.DataGroupingOptionsObject
 * @product   highstock
 * @requires  modules/datagrouping
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
 * @type       {Highcharts.DataGroupingApproximationValue|Function}
 * @product    highstock
 * @apioption  plotOptions.series.dataGrouping.approximation
 */

/**
 * Datetime formats for the header of the tooltip in a stock chart.
 * The format can vary within a chart depending on the currently selected
 * time range and the current data grouping.
 *
 * The default formats are:
 * ```js
 * {
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
 * }
 * ```
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
 *
 * Defaults to:
 * ```js
 * units: [[
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
 * ]]
 * ```
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

''; // required by JSDoc parsing

/* ************************************************************************** *
 *  End data grouping module                                                  *
 * ************************************************************************** */
