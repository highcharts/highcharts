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

import type AxisType from '../Core/Axis/AxisType';
import type IndicatorLike from '../Stock/Indicators/IndicatorLike';
import type {
    PointOptions,
    PointShortOptions
} from '../Core/Series/PointOptions';
import type {
    SeriesTypeOptions,
    SeriesTypePlotOptions
} from '../Core/Series/SeriesType';
import type TimeTicksInfoObject from '../Core/Axis/TimeTicksInfoObject';

import Axis from '../Core/Axis/Axis.js';
import DateTimeAxis from '../Core/Axis/DateTimeAxis.js';
import F from '../Core/FormatUtilities.js';
const { format } = F;
import H from '../Core/Globals.js';
import Point from '../Core/Series/Point.js';
import Series from '../Core/Series/Series.js';
const { prototype: seriesProto } = Series;
import Tooltip from '../Core/Tooltip.js';
import D from '../Core/DefaultOptions.js';
import U from '../Core/Utilities.js';
const {
    addEvent,
    arrayMax,
    arrayMin,
    correctFloat,
    defined,
    error,
    extend,
    isNumber,
    merge,
    pick
} = U;

declare module '../Core/Axis/AxisLike' {
    interface AxisLike {
        applyGrouping(e: Highcharts.PostProcessDataEvent): void;
        getGroupPixelWidth(): number;
        setDataGrouping(
            dataGrouping?: (boolean|Highcharts.DataGroupingOptionsObject),
            redraw?: boolean
        ): void;
    }
}

declare module '../Core/Axis/TimeTicksInfoObject' {
    interface TimeTicksInfoObject {
        gapSize?: number;
    }
}

declare module '../Core/Series/SeriesLike' {
    interface SeriesLike {
        allGroupedData?: Array<(number|null|undefined)>|Array<Array<(number|null|undefined)>>;
        cropStart?: number;
        currentDataGrouping?: TimeTicksInfoObject;
        dataGroupInfo?: Highcharts.DataGroupingInfoObject;
        forceCrop?: boolean;
        groupedData?: (Array<Point>|null);
        groupMap?: Array<Highcharts.DataGroupingInfoObject>;
        groupPixelWidth?: number;
        hasGroupedData?: boolean;
        hasProcessed?: boolean;
        preventGraphAnimation?: boolean;
        applyGrouping(hasExtemesChanged: boolean): void;
        destroyGroupedData(): void;
        generatePoints(): void;
        getDGApproximation(): string;
        groupData(
            xData: Array<number>,
            yData: (Array<number>|Array<Array<number>>),
            groupPosition: Array<number>,
            approximation: (string|Function)
        ): Highcharts.DataGroupingResultObject;
    }
}

declare module '../Core/Series/SeriesOptions' {
    interface SeriesOptions {
        dataGrouping?: Highcharts.DataGroupingOptionsObject;
    }
}

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface DataGroupingApproximationsArray extends Array<number> {
            hasNulls?: boolean;
        }
        interface DataGroupingApproximationsDictionary
            extends Record<string, (Function|undefined)>
        {
            average: (
                arr: DataGroupingApproximationsArray
            ) => (null|number|undefined);
            averages: (
                ...arrs: DataGroupingApproximationsArray
            ) => (Array<(null|number|undefined)>|undefined);
            close: (
                arr: DataGroupingApproximationsArray
            ) => (null|number|undefined);
            high: (
                arr: DataGroupingApproximationsArray
            ) => (null|number|undefined);
            low: (
                arr: DataGroupingApproximationsArray
            ) => (null|number|undefined);
            open: (
                arr: DataGroupingApproximationsArray
            ) => (null|number|undefined);
            sum: (
                arr: DataGroupingApproximationsArray
            ) => (null|number|undefined);
            hlc: (
                high: DataGroupingApproximationsArray,
                low: DataGroupingApproximationsArray,
                close: DataGroupingApproximationsArray
            ) => ([number, number, number]|undefined);
            ohlc: (
                open: DataGroupingApproximationsArray,
                high: DataGroupingApproximationsArray,
                low: DataGroupingApproximationsArray,
                close: DataGroupingApproximationsArray
            ) => ([number, number, number, number]|undefined);
            range: (
                low: DataGroupingApproximationsArray,
                high: DataGroupingApproximationsArray
            ) => ([number, number]|null|undefined);
        }
        interface DataGroupingFunctionsObject {
            approximations: DataGroupingApproximationsDictionary;
            groupData: Series['groupData'];
        }
        interface DataGroupingInfoObject {
            length?: number;
            options?: (PointOptions|PointShortOptions|SeriesTypeOptions);
            start?: number;
        }
        interface PostProcessDataEvent {
            hasExtemesChanged?: boolean;
        }
        interface DataGroupingOptionsObject {
            anchor?: DataGroupingAnchor;
            approximation?: (DataGroupingApproximationValue|Function);
            dateTimeLabelFormats?: Record<string, Array<string>>;
            enabled?: boolean;
            firstAnchor?: DataGroupingAnchorExtremes;
            forced?: boolean;
            groupAll?: boolean;
            groupPixelWidth?: number;
            lastAnchor?: DataGroupingAnchorExtremes;
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
        let approximations: DataGroupingApproximationsDictionary;
        let dataGrouping: DataGroupingFunctionsObject;
        let defaultDataGroupingUnits: Array<[string, (Array<number>|null)]>;
        type DataGroupingApproximationValue = (
            'average'|'averages'|'ohlc'|'open'|'high'|'low'|'close'|'sum'|
            'windbarb'|'ichimoku-averages'|'hlc'
        );
        type DataGroupingAnchor = ('start'|'middle'|'end');
        type DataGroupingAnchorExtremes = (
            'start'|'middle'|'end'|'firstPoint'|'lastPoint'
        );
        type AnchorChoiceType = Record<string, number>;
    }
}

/**
 * @typedef {"average"|"averages"|"open"|"high"|"low"|"close"|"sum"} Highcharts.DataGroupingApproximationValue
 */

/**
 * The position of the point inside the group.
 *
 * @typedef    {"start"|"middle"|"end"} Highcharts.DataGroupingAnchor
 */

/**
 * The position of the first or last point in the series inside the group.
 *
 * @typedef    {"start"|"middle"|"end"|"firstPoint"|"lastPoint"} Highcharts.DataGroupingAnchorExtremes
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

''; // detach doclets above

import '../Core/Axis/Axis.js';

/* *
 *
 *  Declarations
 *
 * */

declare module '../Core/Series/PointLike' {
    interface PointLike {
        dataGroup?: Highcharts.DataGroupingInfoObject;
    }
}

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
const approximations: Highcharts.DataGroupingApproximationsDictionary =
H.approximations = {
    sum: function (
        arr: Highcharts.DataGroupingApproximationsArray
    ): (null|number|undefined) {
        let len = arr.length,
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
        arr: Highcharts.DataGroupingApproximationsArray
    ): (null|number|undefined) {
        let len = arr.length,
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
        const ret = [] as Array<(null|number|undefined)>;

        [].forEach.call(arguments, function (
            arr: Highcharts.DataGroupingApproximationsArray
        ): void {
            ret.push(approximations.average(arr));
        });

        // Return undefined when first elem. is undefined and let
        // sum method handle null (#7377)
        return typeof ret[0] === 'undefined' ? void 0 : ret;
    },
    open: function (
        arr: Highcharts.DataGroupingApproximationsArray
    ): (null|number|undefined) {
        return arr.length ? arr[0] : ((arr as any).hasNulls ? null : void 0);
    },
    high: function (
        arr: Highcharts.DataGroupingApproximationsArray
    ): (null|number|undefined) {
        return arr.length ?
            arrayMax(arr) :
            (arr.hasNulls ? null : void 0);
    },
    low: function (
        arr: Highcharts.DataGroupingApproximationsArray
    ): (null|number|undefined) {
        return arr.length ?
            arrayMin(arr) :
            (arr.hasNulls ? null : void 0);
    },
    close: function (
        arr: Highcharts.DataGroupingApproximationsArray
    ): (null|number|undefined) {
        return arr.length ?
            arr[arr.length - 1] :
            (arr.hasNulls ? null : void 0);
    },
    // HLC, OHLC and range are special cases where a multidimensional array is
    // input and an array is output.
    hlc: function (
        high: Highcharts.DataGroupingApproximationsArray,
        low: Highcharts.DataGroupingApproximationsArray,
        close: Highcharts.DataGroupingApproximationsArray
    ): ([number, number, number]|undefined) {
        high = approximations.high(high) as any;
        low = approximations.low(low) as any;
        close = approximations.close(close) as any;

        if (
            isNumber(high) ||
            isNumber(low) ||
            isNumber(close)
        ) {
            return [high, low, close] as any;
        }
    },
    ohlc: function (
        open: Highcharts.DataGroupingApproximationsArray,
        high: Highcharts.DataGroupingApproximationsArray,
        low: Highcharts.DataGroupingApproximationsArray,
        close: Highcharts.DataGroupingApproximationsArray
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

    },
    range: function (
        low: Highcharts.DataGroupingApproximationsArray,
        high: Highcharts.DataGroupingApproximationsArray
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

const applyGrouping = function (this: Series, hasExtemesChanged: boolean): void {
    let series = this,
        chart = series.chart,
        options = series.options,
        dataGroupingOptions = options.dataGrouping,
        groupingEnabled = series.allowDG !== false && dataGroupingOptions &&
            pick(dataGroupingOptions.enabled, chart.options.isStock),
        visible = (
            series.visible || !chart.options.chart.ignoreHiddenSeries
        ),
        hasGroupedData,
        skip,
        lastDataGrouping = this.currentDataGrouping,
        currentDataGrouping,
        croppedData,
        revertRequireSorting = false;

    // Data needs to be sorted for dataGrouping
    if (groupingEnabled && !series.requireSorting) {
        series.requireSorting = revertRequireSorting = true;
    }

    // Skip if skipDataGrouping method returns false or if grouping is disabled
    // (in that order).
    skip = skipDataGrouping(
        series,
        hasExtemesChanged
    ) === false || !groupingEnabled;

    // Revert original requireSorting value if changed
    if (revertRequireSorting) {
        series.requireSorting = false;
    }

    if (!skip) {
        series.destroyGroupedData();

        let i,
            processedXData = (dataGroupingOptions as any).groupAll ?
                series.xData :
                series.processedXData,
            processedYData = (dataGroupingOptions as any).groupAll ?
                series.yData :
                series.processedYData,
            plotSizeX = chart.plotSizeX,
            xAxis = series.xAxis,
            ordinal = xAxis.options.ordinal,
            groupPixelWidth = series.groupPixelWidth;

        // Execute grouping if the amount of points is greater than the limit
        // defined in groupPixelWidth
        if (
            groupPixelWidth &&
            processedXData &&
            processedXData.length
        ) {
            hasGroupedData = true;

            // Force recreation of point instances in series.translate, #5699
            series.isDirty = true;
            series.points = null as any; // #6709

            let extremes = xAxis.getExtremes(),
                xMin = extremes.min,
                xMax = extremes.max,
                groupIntervalFactor = (
                    ordinal &&
                    xAxis.ordinal &&
                    xAxis.ordinal.getGroupIntervalFactor(xMin, xMax, series)
                ) || 1,
                interval =
                    (groupPixelWidth * (xMax - xMin) / (plotSizeX as any)) *
                    groupIntervalFactor,
                groupPositions = xAxis.getTimeTicks(
                    DateTimeAxis.Additions.prototype.normalizeTimeTickInterval(
                        interval,
                        (dataGroupingOptions as any).units ||
                        defaultDataGroupingUnits
                    ),
                    // Processed data may extend beyond axis (#4907)
                    Math.min(xMin, processedXData[0]),
                    Math.max(
                        xMax,
                        processedXData[processedXData.length - 1]
                    ),
                    xAxis.options.startOfWeek,
                    processedXData,
                    series.closestPointRange
                ),
                groupedData = seriesProto.groupData.apply(
                    series,
                    [
                        processedXData,
                        processedYData as any,
                        groupPositions,
                        (dataGroupingOptions as any).approximation
                    ]
                ),
                groupedXData = groupedData.groupedXData,
                groupedYData = groupedData.groupedYData,
                gapSize = 0;

            // The smoothed option is deprecated, instead, there is a fallback
            // to the new anchoring mechanism. #12455.
            if (
                dataGroupingOptions &&
                dataGroupingOptions.smoothed &&
                groupedXData.length
            ) {
                dataGroupingOptions.firstAnchor = 'firstPoint';
                dataGroupingOptions.anchor = 'middle';
                dataGroupingOptions.lastAnchor = 'lastPoint';

                error(32, false, chart, {
                    'dataGrouping.smoothed': 'use dataGrouping.anchor'
                });
            }

            anchorPoints(series, groupedXData, xMax);

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

            if (visible) {
                adjustExtremes(xAxis, groupedXData);
            }

            // We calculated all group positions but we should render
            // only the ones within the visible range
            if ((dataGroupingOptions as any).groupAll) {
                // Keep the reference to all grouped points
                // for further calculation (eg. heikinashi).
                series.allGroupedData = groupedYData;

                croppedData = series.cropData(
                    groupedXData,
                    groupedYData as any,
                    xAxis.min as any,
                    xAxis.max as any,
                    1 // Ordinal xAxis will remove left-most points otherwise
                );
                groupedXData = croppedData.xData;
                groupedYData = croppedData.yData;
                series.cropStart = croppedData.start; // #15005
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

const skipDataGrouping = function (series: Series, force: boolean): boolean {
    return !(series.isCartesian &&
        !series.isDirty &&
        !series.xAxis.isDirty &&
        !series.yAxis.isDirty &&
        !force);
};

const groupData = function (
    this: Series,
    xData: Array<number>,
    yData: (
        Array<(number|null|undefined)>|
        Array<Array<(number|null|undefined)>>
    ),
    groupPositions: Array<number>,
    approximation: (string|Function)
): Highcharts.DataGroupingResultObject {
    let series = this,
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
        values = [] as Array<Highcharts.DataGroupingApproximationsArray>,
        approximationFn,
        pointArrayMap = series.pointArrayMap,
        pointArrayMapLength = pointArrayMap && pointArrayMap.length,
        extendedPointArrayMap = ['x'].concat(pointArrayMap || ['y']),
        groupAll = (
            this.options.dataGrouping &&
            this.options.dataGrouping.groupAll
        ),
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
                start: groupAll ? start : ((series.cropStart as any) + start),
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

            let index = (
                    series.options.dataGrouping &&
                    series.options.dataGrouping.groupAll ?
                        i : (series.cropStart as any) + i
                ),
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

const anchorPoints = function (
    series: Series,
    groupedXData: Array<number>,
    xMax: number
): any {
    const options = series.options,
        dataGroupingOptions = options.dataGrouping,
        totalRange = (
            series.currentDataGrouping && series.currentDataGrouping.gapSize
        );
    let i;

    // DataGrouping x-coordinates.
    if (dataGroupingOptions && series.xData && totalRange && series.groupMap) {
        const groupedDataLength = groupedXData.length - 1,
            anchor = dataGroupingOptions.anchor,
            firstAnchor = pick(dataGroupingOptions.firstAnchor, anchor),
            lastAnchor = pick(dataGroupingOptions.lastAnchor, anchor);

        // Anchor points that are not extremes.
        if (anchor && anchor !== 'start') {
            const shiftInterval: number = totalRange *
                ({ middle: 0.5, end: 1 } as Highcharts.AnchorChoiceType)[anchor];

            i = groupedXData.length - 1;
            while (i-- && i > 0) {
                groupedXData[i] += shiftInterval;
            }
        }

        // Change the first point position, but only when it is
        // the first point in the data set not in the current zoom.
        if (
            firstAnchor &&
            firstAnchor !== 'start' &&
            series.xData[0] >= groupedXData[0]
        ) {
            const groupStart = series.groupMap[0].start,
                groupLength = series.groupMap[0].length;
            let firstGroupstEnd;

            if (isNumber(groupStart) && isNumber(groupLength)) {
                firstGroupstEnd = groupStart + (groupLength - 1);
            }

            groupedXData[0] = ({
                middle: groupedXData[0] + 0.5 * totalRange,
                end: groupedXData[0] + totalRange,
                firstPoint: series.xData[0],
                lastPoint: firstGroupstEnd && series.xData[firstGroupstEnd]
            } as Highcharts.AnchorChoiceType)[firstAnchor];
        }

        // Change the last point position but only when it is
        // the last point in the data set not in the current zoom.
        if (
            lastAnchor &&
            lastAnchor !== 'start' &&
            totalRange &&
            groupedXData[groupedDataLength] >= xMax - totalRange
        ) {
            const lastGroupStart = series.groupMap[
                series.groupMap.length - 1
            ].start;

            groupedXData[groupedDataLength] = ({
                middle: groupedXData[groupedDataLength] + 0.5 * totalRange,
                end: groupedXData[groupedDataLength] + totalRange,
                firstPoint: lastGroupStart && series.xData[lastGroupStart],
                lastPoint: series.xData[series.xData.length - 1]
            } as Highcharts.AnchorChoiceType)[lastAnchor];
        }
    }
};

const adjustExtremes = function (
    xAxis: Axis,
    groupedXData: Array<number>
): void {
    // Make sure the X axis extends to show the first group (#2533)
    // But only for visible series (#5493, #6393)
    if (
        defined(groupedXData[0]) &&
        isNumber(xAxis.min) &&
        isNumber(xAxis.dataMin) &&
        groupedXData[0] < xAxis.min
    ) {
        if (
            (
                !defined(xAxis.options.min) &&
                xAxis.min <= xAxis.dataMin
            ) ||
            xAxis.min === xAxis.dataMin
        ) {
            xAxis.min = Math.min(groupedXData[0], xAxis.min);
        }

        xAxis.dataMin = Math.min(
            groupedXData[0],
            xAxis.dataMin
        );
    }

    // When the last anchor set, change the extremes that
    // the last point is visible (#12455).
    if (
        defined(groupedXData[groupedXData.length - 1]) &&
        isNumber(xAxis.max) &&
        isNumber(xAxis.dataMax) &&
        groupedXData[groupedXData.length - 1] > xAxis.max
    ) {

        if (
            (
                !defined(xAxis.options.max) &&
                isNumber(xAxis.dataMax) &&
                xAxis.max >= xAxis.dataMax
            ) || xAxis.max === xAxis.dataMax
        ) {
            xAxis.max = Math.max(
                groupedXData[groupedXData.length - 1],
                xAxis.max
            );
        }
        xAxis.dataMax = Math.max(
            groupedXData[groupedXData.length - 1],
            xAxis.dataMax
        );
    }
};

const dataGrouping = {
    approximations: approximations,
    groupData: groupData
};


// -----------------------------------------------------------------------------
// The following code applies to implementation of data grouping on a Series

const baseProcessData = seriesProto.processData,
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
        },
        hlc: {
            groupPixelWidth: 5
        // Move to HeikinAshiSeries.ts aftre refactoring data grouping.
        },
        heikinashi: {
            groupPixelWidth: 10
        }
    } as SeriesTypePlotOptions,

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
seriesProto.getDGApproximation = function (): string {
    if (this.is('arearange')) {
        return 'range';
    }
    if (this.is('ohlc')) {
        return 'ohlc';
    }
    if (this.is('hlc')) {
        return 'hlc';
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

/**
 * For the processed data, calculate the grouped data if needed.
 *
 * @private
 * @function Highcharts.Series#applyGrouping
 *
 * @return {void}
 */
seriesProto.applyGrouping = applyGrouping;


// Destroy the grouped data points. #622, #740
seriesProto.destroyGroupedData = function (): void {
    // Clear previous groups
    if (this.groupedData) {
        this.groupedData.forEach(function (
            point: Point,
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
seriesProto.generatePoints = function (): void {

    baseGeneratePoints.apply(this);

    // Record grouped data in order to let it be destroyed the next time
    // processData runs
    this.destroyGroupedData(); // #622
    this.groupedData = this.hasGroupedData ? this.points : null;
};

/**
 * Check the groupPixelWidth and apply the grouping if needed.
 * Fired only after processing the data.
 *
 * @product highstock
 *
 * @function Highcharts.Axis#applyGrouping
 */
Axis.prototype.applyGrouping = function (
    this: Axis,
    e: Highcharts.PostProcessDataEvent
): void {
    const axis = this,
        series = axis.series;

    series.forEach(function (series): void {
        // Reset the groupPixelWidth, then calculate if needed.
        series.groupPixelWidth = void 0; // #2110

        series.groupPixelWidth = (
            axis.getGroupPixelWidth &&
            axis.getGroupPixelWidth()
        );

        if (series.groupPixelWidth) {
            series.hasProcessed = true; // #2692
        }
        // Fire independing on series.groupPixelWidth to always set a proper
        // dataGrouping state, (#16238)
        series.applyGrouping(!!e.hasExtemesChanged);
    });
};

// Get the data grouping pixel width based on the greatest defined individual
// width of the axis' series, and if whether one of the axes need grouping.
Axis.prototype.getGroupPixelWidth = function (): number {

    let series = this.series,
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

        if (dgOptions) { // #2692

            dataLength = (series[i].processedXData || series[i].data).length;

            // Execute grouping if the amount of points is greater than the
            // limit defined in groupPixelWidth
            if (
                series[i].groupPixelWidth ||
                dataLength > ((this.chart.plotSizeX as any) / groupPixelWidth) ||
                (dataLength && dgOptions.forced)
            ) {
                doGrouping = true;
            }
        }
    }

    return doGrouping ? groupPixelWidth : 0;
};

/**
 * Highcharts Stock only. Force data grouping on all the axis' series.
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
 */
Axis.prototype.setDataGrouping = function (
    this: Axis,
    dataGrouping?: (boolean|Highcharts.DataGroupingOptionsObject),
    redraw?: boolean
): void {
    const axis = this as AxisType;

    let i;

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
    if (axis.ordinal) {
        axis.ordinal.slope = void 0;
    }

    if (redraw) {
        this.chart.redraw();
    }
};

// When all series are processed, calculate the group pixel width and then
// if this value is different than zero apply groupings.
addEvent(Axis, 'postProcessData', Axis.prototype.applyGrouping);

// Override point prototype to throw a warning when trying to update grouped
// points.
addEvent(Point, 'update', function (): (boolean|undefined) {
    if (this.dataGroup) {
        error(24, false, this.series.chart);
        return false;
    }
});

// Extend the original method, make the tooltip's header reflect the grouped
// range.
addEvent(Tooltip, 'headerFormatter', function (
    this: Tooltip,
    e: AnyRecord
): void {
    let tooltip = this,
        chart = this.chart,
        time = chart.time,
        labelConfig = e.labelConfig,
        series = labelConfig.series as Series,
        options = series.options,
        tooltipOptions = series.tooltipOptions,
        dataGroupingOptions = options.dataGrouping,
        xDateFormat = tooltipOptions.xDateFormat,
        xDateFormatEnd,
        xAxis = series.xAxis,
        currentDataGrouping: (TimeTicksInfoObject|undefined),
        dateTimeLabelFormats,
        labelFormats,
        formattedKey,
        formatString = tooltipOptions[
            e.isFooter ? 'footerFormat' : 'headerFormat'
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
        } else if (!xDateFormat && dateTimeLabelFormats && xAxis.dateTime) {
            xDateFormat = xAxis.dateTime.getXDateFormat(
                labelConfig.x,
                tooltipOptions.dateTimeLabelFormats

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
    e: { options: SeriesTypeOptions }
): void {

    let options = e.options,
        type = this.type,
        plotOptions = this.chart.options.plotOptions,
        defaultOptions: Highcharts.DataGroupingOptionsObject =
            (D.defaultOptions.plotOptions as any)[type].dataGrouping,
        // External series, for example technical indicators should also inherit
        // commonOptions which are not available outside this module
        baseOptions = (
            (this as IndicatorLike).useCommonDataGrouping && commonOptions
        );

    if (plotOptions && (specificOptions[type] || baseOptions)) { // #1284
        if (!defaultOptions) {
            defaultOptions = merge(commonOptions, specificOptions[type]);
        }

        const rangeSelector = this.chart.rangeSelector;

        options.dataGrouping = merge(
            baseOptions as any,
            defaultOptions,
            plotOptions.series && plotOptions.series.dataGrouping, // #1228
            // Set by the StockChart constructor:
            (plotOptions[type] as any).dataGrouping,
            this.userOptions.dataGrouping,
            !options.isInternal &&
                rangeSelector &&
                isNumber(rangeSelector.selected) &&
                rangeSelector.buttonOptions[rangeSelector.selected].dataGrouping
        );
    }
});

// When resetting the scale reset the hasProccessed flag to avoid taking
// previous data grouping of neighbour series into accound when determining
// group pixel width (#2692).
addEvent(Axis, 'afterSetScale', function (): void {
    this.series.forEach(function (series): void {
        series.hasProcessed = false;
    });
});

H.dataGrouping = dataGrouping;
export default dataGrouping;

/* eslint-enable no-invalid-this, valid-jsdoc */

/**
 * Data grouping is the concept of sampling the data values into larger
 * blocks in order to ease readability and increase performance of the
 * JavaScript charts. Highcharts Stock by default applies data grouping when
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
 * @requires  product:highstock
 * @requires  module:modules/datagrouping
 * @apioption plotOptions.series.dataGrouping
 */

/**
 * Specifies how the points should be located on the X axis inside the group.
 * Points that are extremes can be set separately. Available options:
 *
 * - `start` places the point at the beginning of the group
 * (e.g. range 00:00:00 - 23:59:59 -> 00:00:00)
 *
 * - `middle` places the point in the middle of the group
 * (e.g. range 00:00:00 - 23:59:59 -> 12:00:00)
 *
 * - `end` places the point at the end of the group
 * (e.g. range 00:00:00 - 23:59:59 -> 23:59:59)
 *
 * @sample {highstock} stock/plotoptions/series-datagrouping-anchor
 *         Changing the point x-coordinate inside the group.
 *
 * @see [dataGrouping.firstAnchor](#plotOptions.series.dataGrouping.firstAnchor)
 * @see [dataGrouping.lastAnchor](#plotOptions.series.dataGrouping.lastAnchor)
 *
 * @type       {Highcharts.DataGroupingAnchor}
 * @since 9.1.0
 * @default    start
 * @apioption  plotOptions.series.dataGrouping.anchor
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
 * for range series, `hlc` for HLC, and `ohlc` for OHLC and candlestick.
 *
 * @sample {highstock} stock/plotoptions/series-datagrouping-approximation
 *         Approximation callback with custom data
 * @sample {highstock} stock/plotoptions/series-datagrouping-simple-approximation
 *         Simple approximation demo
 *
 * @type       {Highcharts.DataGroupingApproximationValue|Function}
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
 * @type      {Object}
 * @apioption plotOptions.series.dataGrouping.dateTimeLabelFormats
 */

/**
 * Enable or disable data grouping.
 *
 * @type      {boolean}
 * @default   true
 * @apioption plotOptions.series.dataGrouping.enabled
 */

/**
 * Specifies how the first grouped point is positioned on the xAxis.
 * If firstAnchor and/or lastAnchor are defined, then those options take
 * precedence over anchor for the first and/or last grouped points.
 * Available options:
 *
 * -`start` places the point at the beginning of the group
 * (e.g. range 00:00:00 - 23:59:59 -> 00:00:00)
 *
 * -`middle` places the point in the middle of the group
 * (e.g. range 00:00:00 - 23:59:59 -> 12:00:00)
 *
 * -`end` places the point at the end of the group
 * (e.g. range 00:00:00 - 23:59:59 -> 23:59:59)
 *
 * -`firstPoint` the first point in the group
 * (e.g. points at 00:13, 00:35, 00:59 -> 00:13)
 *
 * -`lastPoint` the last point in the group
 * (e.g. points at 00:13, 00:35, 00:59 -> 00:59)
 *
 * @sample {highstock} stock/plotoptions/series-datagrouping-first-anchor
 *         Applying first and last anchor.
 *
 * @see [dataGrouping.anchor](#plotOptions.series.dataGrouping.anchor)
 *
 * @type       {Highcharts.DataGroupingAnchorExtremes}
 * @since 9.1.0
 * @default    start
 * @apioption  plotOptions.series.dataGrouping.firstAnchor
 */

/**
 * When data grouping is forced, it runs no matter how small the intervals
 * are. This can be handy for example when the sum should be calculated
 * for values appearing at random times within each hour.
 *
 * @type      {boolean}
 * @default   false
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
 * @apioption plotOptions.series.dataGrouping.groupAll
 */

/**
 * Specifies how the last grouped point is positioned on the xAxis.
 * If firstAnchor and/or lastAnchor are defined, then those options take
 * precedence over anchor for the first and/or last grouped points.
 * Available options:
 *
 * -`start` places the point at the beginning of the group
 * (e.g. range 00:00:00 - 23:59:59 -> 00:00:00)
 *
 * -`middle` places the point in the middle of the group
 * (e.g. range 00:00:00 - 23:59:59 -> 12:00:00)
 *
 * -`end` places the point at the end of the group
 * (e.g. range 00:00:00 - 23:59:59 -> 23:59:59)
 *
 * -`firstPoint` the first point in the group
 * (e.g. points at 00:13, 00:35, 00:59 -> 00:13)
 *
 * -`lastPoint` the last point in the group
 * (e.g. points at 00:13, 00:35, 00:59 -> 00:59)
 *
 * @sample {highstock} stock/plotoptions/series-datagrouping-first-anchor
 *         Applying first and last anchor.
 *
 * @sample {highstock} stock/plotoptions/series-datagrouping-last-anchor
 *         Applying the last anchor in the chart with live data.
 *
 * @see [dataGrouping.anchor](#plotOptions.series.dataGrouping.anchor)
 *
 * @type       {Highcharts.DataGroupingAnchorExtremes}
 * @since 9.1.0
 * @default    start
 * @apioption  plotOptions.series.dataGrouping.lastAnchor
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
 * @deprecated
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
 * @apioption plotOptions.column.dataGrouping.groupPixelWidth
 */

''; // required by JSDoc parsing

/* ************************************************************************** *
 *  End data grouping module                                                  *
 * ************************************************************************** */
