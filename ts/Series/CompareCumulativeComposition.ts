/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type DataExtremesObject from '../Core/Series/DataExtremesObject';

import Axis from '../Core/Axis/Axis.js';
import Point from '../Core/Series/Point.js';
import Series from '../Core/Series/Series.js';

const {
    prototype: {
        tooltipFormatter: pointTooltipFormatter
    }
} = Point;

import U from '../Core/Utilities.js';
const {
    addEvent,
    arrayMax,
    arrayMin,
    correctFloat,
    defined,
    isArray,
    isNumber,
    isString,
    pick
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../Core/Axis/AxisLike' {
    interface AxisLike {
        setCompare(compare?: string, redraw?: boolean): void;
        setCumulative(cumulative?: boolean, redraw?: boolean): void;
        setModifier(
            mode: 'compare'|'cumulative',
            modeState?: boolean|null|string,
            redraw?: boolean
        ): void;
    }
}

declare module '../Core/Series/PointLike' {
    interface PointLike {
        change?: number;
        cumulativeSum?: number;
    }
}

declare module '../Core/Series/SeriesLike' {
    interface SeriesLike {
        compareValue?: number;
        getCumulativeExtremes(activeYData: Array<number>): [number, number];
        initCompare(compare?: string|null): void;
        initCumulative(cumulative?: boolean): void;
        modifyValue?(value?: number|null, index?: number): (number|undefined);
        setCompare(compare?: string|null, redraw?: boolean): void;
        setCumulative(cumulative?: boolean|null, redraw?: boolean): void;
    }
}

declare module '../Core/Series/SeriesOptions' {
    interface SeriesOptions {
        compare?: string|null;
        compareBase?: (0|100);
        compareStart?: boolean;
        cumulative?: boolean;
    }
}

/* *
 *
 *  Composition
 *
 * */

namespace CompareCumulativeComposition {

    /* *
     *
     *  Declarations
     *
     * */

    export declare class AxisComposition extends Axis {
        public tooltipFormatter(pointFormat: string): string;
    }

    export declare class PointComposition extends Point {
        public tooltipFormatter(pointFormat: string): string;
    }

    export declare class SeriesComposition extends Series {
        public tooltipFormatter(pointFormat: string): string;
    }

    export interface DrawParams {
        shapeType: string;
    }

    /* *
     *
     *  Constants
     *
     * */

    const composedClasses: Array<Function> = [];

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * Extends the axis with ordinal support.
     *
     * @private
     *
     * @param SeriesClass
     * Series class to use.
     *
     * @param AxisClass
     * Axis class to extend.
     *
     * @param PointClass
     * Point class to use.
     */
    export function compose<T extends typeof Series>(
        SeriesClass: T,
        AxisClass: typeof Axis,
        PointClass: typeof Point
    ): (typeof SeriesComposition&T) {
        if (composedClasses.indexOf(SeriesClass) === -1) {
            composedClasses.push(SeriesClass);

            const seriesProto = SeriesClass.prototype as SeriesComposition;

            seriesProto.setCompare = seriesSetCompare;
            seriesProto.setCumulative = seriesSetCumulative;
            seriesProto.initCompare = initCompare;
            seriesProto.initCumulative = initCumulative;
            seriesProto.getCumulativeExtremes = getCumulativeExtremes;

            addEvent(SeriesClass, 'afterInit', afterInit);
            addEvent(SeriesClass, 'afterGetExtremes', afterGetExtremes);
            addEvent(SeriesClass, 'afterProcessData', afterProcessData);
        }

        if (composedClasses.indexOf(AxisClass) === -1) {
            composedClasses.push(AxisClass);

            const axisProto = AxisClass.prototype as AxisComposition;

            axisProto.setCompare = axisSetCompare;
            axisProto.setModifier = setModifier;
            axisProto.setCumulative = AxisSetCumulative;
        }

        if (composedClasses.indexOf(PointClass) === -1) {
            composedClasses.push(PointClass);

            const pointProto = PointClass.prototype as PointComposition;

            pointProto.tooltipFormatter = tooltipFormatter;
        }

        return SeriesClass as (typeof SeriesComposition&T);
    }

    /* ********************************************************************** *
     *  Start shared compare and cumulative logic                             *
     * ********************************************************************** */

    /**
     * Shared code for the axis.setCompare() and the axis.setCumulative()
     * methods. Inits the 'compare' or the 'cumulative' mode.
     * @private
     */
    function setModifier(
        this: Axis,
        mode: 'compare'|'cumulative',
        modeState?: boolean|null|string,
        redraw?: boolean
    ): void {
        if (!this.isXAxis) {
            this.series.forEach(function (series): void {
                if (
                    mode === 'compare' &&
                    (
                        isString(modeState) ||
                        typeof modeState === 'undefined' ||
                        modeState === null
                    )
                ) {
                    series.setCompare(modeState, false);
                } else if (
                    mode === 'cumulative' &&
                    (
                        typeof modeState === 'boolean' ||
                        typeof modeState === 'undefined' ||
                        modeState === null
                    )
                ) {
                    series.setCumulative(modeState, false);
                }
            });

            if (pick(redraw, true)) {
                this.chart.redraw();
            }
        }
    }

    /**
     * Extend the tooltip formatter by adding support for the point.change
     * variable as well as the changeDecimals option.
     *
     * @ignore
     * @function Highcharts.Point#tooltipFormatter
     *
     * @param {string} pointFormat
     */
    function tooltipFormatter(this: Point, pointFormat: string): string {
        const point: any = this,
            { numberFormatter } = point.series.chart,
            replace = function (value: string): void {
                pointFormat = pointFormat.replace(
                    '{point.' + value + '}',
                    (point[value] > 0 && value === 'change' ? '+' : '') +
                        numberFormatter(
                            point[value],
                            pick(point.series.tooltipOptions.changeDecimals, 2)
                        )
                );
            };

        if (defined(point.change)) {
            replace('change');
        }

        if (defined(point.cumulativeSum)) {
            replace('cumulativeSum');
        }

        return pointTooltipFormatter.apply(this, [pointFormat]);
    }

    /**
     * Extend series.init by adding a methods to modify the y values used
     * for plotting on the y axis. For compare mode, this method is called both
     * from the axis when finding dataMin and dataMax,
     * and from the series.translate method.
     *
     * @ignore
     * @function Highcharts.Series#init
     */
    function afterInit(this: Series): void {
        if (this.options.compare) {
            // Set comparison mode
            this.initCompare(this.options.compare);
        } else if (this.options.cumulative) {
            // Set Cumulative Sum mode
            this.initCumulative(this.options.cumulative);
        }
    }

    /**
     * Adjust the extremes (compare and cumulative modify the data).
     * @private
     */
    function afterGetExtremes(this: Series, e: AnyRecord|Event): void {
        const dataExtremes: DataExtremesObject = (e as any).dataExtremes,
            activeYData = dataExtremes.activeYData;

        if (this.modifyValue && dataExtremes) {
            let extremes;

            if (this.options.compare) {
                extremes = [
                    this.modifyValue(dataExtremes.dataMin),
                    this.modifyValue(dataExtremes.dataMax)
                ];
            } else if (
                this.options.cumulative &&
                isArray(activeYData) &&
                // If only one y visible, sum doesn't change
                // so no need to change extremes
                activeYData.length >= 2
            ) {
                extremes = this.getCumulativeExtremes(activeYData);
            }

            if (extremes) {
                dataExtremes.dataMin = arrayMin(extremes);
                dataExtremes.dataMax = arrayMax(extremes);
            }
        }
    }

    /* ********************************************************************** *
     *  End shared compare and cumulative logic                               *
     * ********************************************************************** */

    /* ********************************************************************** *
     *  Start value compare logic                                             *
     * ********************************************************************** */

    /**
     * Highcharts Stock only. Set the
     * [compare](https://api.highcharts.com/highstock/plotOptions.series.compare)
     * mode of the series after render time.
     * In most cases it is more useful running
     * {@link Axis#setCompare} on the X axis to update all its series.
     *
     * @function Highcharts.Series#setCompare
     *
     * @param {string|null} [compare]
     *        Can be one of `undefined` (default), `null`, `"percent"`
     *        or `"value"`.
     *
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart or to wait for a later call to
     *        {@link Chart#redraw}.
     */
    function seriesSetCompare(
        this: Series,
        compare?: string|null,
        redraw?: boolean
    ): void {
        this.initCompare(compare);

        // Survive to export, #5485
        this.options.compare = this.userOptions.compare = compare;

        if (pick(redraw, true)) {
            this.chart.redraw();
        }
    }

    /**
     * @ignore
     * @function Highcharts.Series#initCompare
     *
     * @param {string} [compare]
     *        Can be one of `null` (default), `"percent"` or `"value"`.
     */
    function initCompare(this: Series, compare?: string): void {
        if (compare === 'value' || compare === 'percent') {
            // Set the modifyValue method
            this.modifyValue = function (
                this: Series,
                value?: number|null,
                index?: number
            ): (number|undefined) {
                if (value === null) {
                    value = 0;
                }

                const compareValue = this.compareValue;

                if (
                    typeof value !== 'undefined' &&
                    typeof compareValue !== 'undefined'
                ) { // #2601, #5814

                    // Get the modified value
                    if (compare === 'value') {
                        value -= compareValue;
                    // Compare percent
                    } else {
                        value = 100 * (value / compareValue) -
                            (this.options.compareBase === 100 ? 0 : 100);
                    }

                    // record for tooltip etc.
                    if (typeof index !== 'undefined') {
                        const point = this.points[index];

                        if (point) {
                            point.change = value;
                        }
                    }

                    return value;
                }
                return 0;
            };
        } else {
            // When disabling,
            // unset the modifyValue method and clear the points
            this.modifyValue = null as any;
            this.points.forEach((point): void => {
                delete point.change;
            });
        }

        // Mark dirty
        if (this.chart.hasRendered) {
            this.isDirty = true;
        }
    }

    /**
     * Extend series.processData by finding the first y value in the plot area,
     * used for comparing the following values
     *
     * @ignore
     * @function Highcharts.Series#processData
     */
    function afterProcessData(this: Series): (boolean|undefined) {
        let series = this,
            i,
            keyIndex = -1,
            processedXData,
            processedYData,
            compareStart = series.options.compareStart === true ? 0 : 1,
            length,
            compareValue;

        if (series.xAxis && series.processedYData) { // not pies

            // local variables
            processedXData = series.processedXData;
            processedYData = series.processedYData;
            length = processedYData.length;

            // For series with more than one value (range, OHLC etc), compare
            // against close or the pointValKey (#4922, #3112, #9854)
            if (series.pointArrayMap) {
                keyIndex = series.pointArrayMap.indexOf(
                    series.options.pointValKey || series.pointValKey || 'y'
                );
            }

            // find the first value for comparison
            for (i = 0; i < length - compareStart; i++) {
                compareValue = processedYData[i] && keyIndex > -1 ?
                    (processedYData[i] as any)[keyIndex] :
                    processedYData[i];
                if (
                    isNumber(compareValue) &&
                    (processedXData as any)[i + compareStart] >=
                    (series.xAxis.min as any) &&
                    compareValue !== 0
                ) {
                    series.compareValue = compareValue;
                    break;
                }
            }
        }

        return;
    }

    /**
     * Highcharts Stock only. Set the compare mode on all series
     * belonging to a Y axis.
     *
     * @see [plotOptions.series.compare](https://api.highcharts.com/highstock/plotOptions.series.compare)
     *
     * @sample stock/members/axis-setcompare/
     *         Set compare
     *
     * @function Highcharts.Axis#setCompare
     *
     * @param {string|null} [compare]
     *        The compare mode. Can be one of `undefined` (default), `null`,
     *        `"value"` or `"percent"`.
     *
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart or to wait for a later call to
     *        {@link Chart#redraw}.
     */
    function axisSetCompare(
        this: Axis,
        compare?: string|null,
        redraw?: boolean
    ): void {
        this.setModifier('compare', compare, redraw);
    }

    /* ********************************************************************** *
     *  End value compare logic                                               *
     * ********************************************************************** */

    /* ********************************************************************** *
     *  Start Cumulative Sum logic, author: Rafal Sebestjanski                *
     * ********************************************************************** */

    /**
     * Highcharts Stock only. Set the
     * [cumulative](https://api.highcharts.com/highstock/plotOptions.series.cumulative)
     * mode of the series after render time.
     * In most cases it is more useful running
     * {@link Axis#setCumulative} on the Y axis to update all its series.
     *
     * @function Highcharts.Series#setCumulative
     *
     * @param {boolean} [cumulative=false]
     *        Either enable or disable Cumulative Sum mode.
     *        Can be one of `false` (default) or `true`.
     *
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart or to wait for a later call to
     *        {@link Chart#redraw}.
     */
    function seriesSetCumulative(
        this: Series,
        cumulative?: boolean|null,
        redraw?: boolean
    ): void {
        // Set default value to false
        cumulative = pick(cumulative, false);

        this.initCumulative(cumulative);

        // Survive to export, #5485
        this.options.cumulative = this.userOptions.cumulative = cumulative;

        if (pick(redraw, true)) {
            this.chart.redraw();
        }
    }

    /**
     * @ignore
     * @function Highcharts.Series#initCumulative
     */
    function initCumulative(this: Series, cumulative?: boolean): void {
        if (cumulative) {
            // Set the modifyValue method
            this.modifyValue = function (
                this: Series,
                value?: number|null,
                index?: number
            ): (number|undefined) {
                if (value === null) {
                    value = 0;
                }

                if (value !== void 0 && index !== void 0) {
                    const prevPoint = index > 0 ?
                        this.points[index - 1] : null;

                    // Get the modified value
                    if (prevPoint && prevPoint.cumulativeSum) {
                        value = correctFloat(prevPoint.cumulativeSum + value);
                    }

                    // Record for tooltip etc.
                    const point = this.points[index];

                    if (point) {
                        point.cumulativeSum = value;
                    }

                    return value;
                }

                return 0;
            };
        } else {
            // When disabling,
            // unset the modifyValue method and clear the points
            this.modifyValue = null as any;
            this.points.forEach((point): void => {
                delete point.cumulativeSum;
            });
        }

        // Mark dirty
        if (this.chart.hasRendered) {
            this.isDirty = true;
        }
    }

    /**
     * Highcharts Stock only. Set the cumulative mode on all series
     * belonging to a Y axis.
     *
     * @see [plotOptions.series.cumulative](https://api.highcharts.com/highstock/plotOptions.series.cumulative)
     *
     * @sample stock/members/axis-setcumulative/
     *         Set cumulative
     *
     * @function Highcharts.Axis#setCumulative
     *
     * @param {boolean} [cumulative]
     *        Whether to disable or enable the cumulative mode.
     *        Can be one of `undefined` (default, treated as `false`),
     *        `false` or `true`.
     *
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart or to wait for a later call to
     *        {@link Chart#redraw}.
     */
    function AxisSetCumulative(
        this: Axis,
        cumulative?: boolean,
        redraw?: boolean
    ): void {
        this.setModifier('cumulative', cumulative, redraw);
    }

    /**
     * @ignore
     * @function Highcharts.Series#getCumulativeExtremes
     *
     * @param {Array} [activeYData]
     *        An array cointaining all the points' y values in a visible range.
     */
    function getCumulativeExtremes(
        this: Series,
        activeYData: Array<number>
    ): [number, number] {
        let cumulativeDataMin = Infinity,
            cumulativeDataMax = -Infinity;

        activeYData.reduce((prev, cur): number => {
            const sum = prev + cur;

            cumulativeDataMin = Math.min(cumulativeDataMin, sum, prev);
            cumulativeDataMax = Math.max(cumulativeDataMax, sum, prev);

            return sum;
        });

        return [cumulativeDataMin, cumulativeDataMax];
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default CompareCumulativeComposition;

/* *
 *
 *  API Options
 *
 * */

/**
 * Compare the values of the series against the first non-null, non-
 * zero value in the visible range. The y axis will show percentage
 * or absolute change depending on whether `compare` is set to `"percent"`
 * or `"value"`. When this is applied to multiple series, it allows
 * comparing the development of the series against each other. Adds
 * a `change` field to every point object.
 *
 * @see [compareBase](#plotOptions.series.compareBase)
 * @see [Axis.setCompare()](/class-reference/Highcharts.Axis#setCompare)
 * @see [Series.setCompare()](/class-reference/Highcharts.Series#setCompare)
 *
 * @sample {highstock} stock/plotoptions/series-compare-percent/
 *         Percent
 * @sample {highstock} stock/plotoptions/series-compare-value/
 *         Value
 *
 * @type      {string}
 * @since     1.0.1
 * @product   highstock
 * @apioption plotOptions.series.compare
 */

/**
 * Defines if comparison should start from the first point within the visible
 * range or should start from the first point **before** the range.
 *
 * In other words, this flag determines if first point within the visible range
 * will have 0% (`compareStart=true`) or should have been already calculated
 * according to the previous point (`compareStart=false`).
 *
 * @sample {highstock} stock/plotoptions/series-comparestart/
 *         Calculate compare within visible range
 *
 * @type      {boolean}
 * @default   false
 * @since     6.0.0
 * @product   highstock
 * @apioption plotOptions.series.compareStart
 */

/**
 * When [compare](#plotOptions.series.compare) is `percent`, this option
 * dictates whether to use 0 or 100 as the base of comparison.
 *
 * @sample {highstock} stock/plotoptions/series-comparebase/
 *         Compare base is 100
 *
 * @type       {number}
 * @default    0
 * @since      5.0.6
 * @product    highstock
 * @validvalue [0, 100]
 * @apioption  plotOptions.series.compareBase
 */

/**
 * Cumulative Sum feature replaces points' values with the following formula:
 * `sum of all previous points' values + current point's value`.
 * Works only for points in a visible range.
 * Adds the `cumulativeSum` field to each point object that can be accessed
 * e.g. in the [tooltip.pointFormat](https://api.highcharts.com/highstock/tooltip.pointFormat).
 *
 * @see [Axis.setCumulative()](/class-reference/Highcharts.Axis#setCumulative)
 * @see [Series.setCumulative()](/class-reference/Highcharts.Series#setCumulative)
 *
 * @sample {highstock} stock/plotoptions/series-cumulative-sum/
 *         Cumulative Sum
 *
 * @type      {boolean}
 * @default   false
 * @since     next
 * @product   highstock
 * @apioption plotOptions.series.cumulative
 */

''; // keeps doclets above in transpiled file
