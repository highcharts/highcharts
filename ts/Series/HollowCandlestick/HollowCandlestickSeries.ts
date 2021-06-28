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

/* *
 *
 *  Imports
 *
 * */

import HollowCandlestickPoint from './HollowCandlestickPoint.js';
import type HollowCandlestickSeriesOptions from './HollowCandlestickSeriesOptions';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import U from '../../Core/Utilities.js';
import { StatesOptionsKey } from '../../Core/Series/StatesOptions.js';
import SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes.js';
import palette from '../../Core/Color/Palette.js';

const {
    seriesTypes: {
        candlestick: CandlestickSeries
    }
} = SeriesRegistry;

const {
    extend,
    merge,
    pick
} = U;

/* *
 *
 *  Code
 *
 * */

/**
 * The hollowcandlestick series.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.hollowcandlestick
 *
 * @augments Highcharts.seriesTypes.ohlc
 */
class HollowCandlestickSeries extends CandlestickSeries {

    /* *
     *
     * Static properties
     *
     * */

    /**
     * A hollow candlestick chart is a style of financial chart used to
     * describe price movements over time.
     *
     * @sample stock/demo/hollow-candlestick/
     *         Hollow Candlestick chart
     *
     * @extends      plotOptions.candlestick
     * @excluding    borderColor,borderRadius,borderWidth
     * @product      highstock
     * @optionparent plotOptions.hollowcandlestick
     */
    public static defaultOptions: HollowCandlestickSeriesOptions = merge(CandlestickSeries.defaultOptions, {
        /**
         * The fill color of the candlestick when the current
         * close is lower than the previous one.
         *
         * @sample stock/demo/hollow-candlestick/
         *     Custom colors
         * @sample {highstock} highcharts/css/hollow-candlestick/
         *         Colors in styled mode
         *
         * @type    {ColorType}
         * @default #f21313
         * @product highstock
         */
        color: palette.negativeColor,

        /**
         * The color of the line/border of the hollow candlestick when
         * the current close is lower than the previous one.
         *
         * @sample stock/demo/hollow-candlestick/
         *     Custom colors
         * @sample {highstock} highcharts/css/hollow-candlestick/
         *         Colors in styled mode
         *
         * @type    {ColorType}
         * @default #f21313
         * @product highstock
         */
        lineColor: palette.negativeColor,

        /**
         * The fill color of the candlestick when the current
         * close is higher than the previous one.
         *
         * @sample stock/demo/hollow-candlestick/
         *     Custom colors
         * @sample {highstock} highcharts/css/hollow-candlestick/
         *         Colors in styled mode
         *
         * @type    {ColorType}
         * @default #06b535
         * @product highstock
         */
        upColor: palette.positiveColor,

        /**
         * The color of the line/border of the hollow candlestick when
         * the current close is higher than the previous one.
         *
         * @sample stock/demo/hollow-candlestick/
         *     Custom colors
         * @sample {highstock} highcharts/css/hollow-candlestick/
         *         Colors in styled mode
         *
         * @type    {ColorType}
         * @default #06b535
         * @product highstock
         */
        upLineColor: palette.positiveColor

    } as HollowCandlestickSeriesOptions);

    /* *
     *
     * Properties
     *
     * */
    public data: Array<HollowCandlestickPoint> = void 0 as any;

    public options: HollowCandlestickSeriesOptions = void 0 as any;

    public points: Array<HollowCandlestickPoint> = void 0 as any;

    /* *
     *
     * Functions
     *
     * */

    /**
     * Add fill attribute for each points based on
     * the previously calculated value.
     *
     * @function Highcharts.seriesTypes.hollowcandlestick#pointAttribs
     *
     * @param {HollowCandlestickPoint} point
     *        Point to which we are adding attributes.
     * @param {StatesOptionsKey} state
     *        Current point state.
     *
     * @return {SVGAttributes}
     *
     */
    public pointAttribs(
        point: HollowCandlestickPoint,
        state?: StatesOptionsKey
    ): SVGAttributes {
        let attribs = super.pointAttribs.call(this, point, state);

        attribs.fill = point.candleFill || attribs.fill;
        attribs.stroke = point.color || attribs.stroke;
        return attribs;
    }

    /**
     * Translate from value to pixel as a base method and loop through points
     * in order to calculate the fill.
     *
     * @function Highcharts.seriesTypes.hollowcandlestick#translate
     *
     * @return {void}
     *
     */
    public translate(): void {
        // Run the base method.
        super.translate.apply(this);

        const series = this,
            points = series.points;

        if (points && points.length) {
            // The first point always without fill,
            // because of lacking the previous point.
            points[0].candleFill = 'transparent';

            for (let i = 1; i < points.length; i++) {
                const point = points[i],
                    previousPoint = points[i - 1];

                point.candleFill = point.getPointFill(previousPoint);
                point.color = point.getLineColor(previousPoint);
            }
        }
    }

    /**
     * In order to distinguish two types of bearish points,
     * add the class to a point if needed.
     *
     * @function Highcharts.seriesTypes.hollowcandlestick#drawPoints
     *
     * @return {void}
     *
     */
    public drawPoints(): void {
        // Run the base method.
        super.drawPoints.apply(this);

        const series = this,
            points = series.points;

        if (points && points.length) {
            for (let i = 1; i < points.length; i++) {
                const point = points[i],
                    previousPoint = points[i - 1];
                if (point.graphic && point.close > previousPoint.close && point.candleFill !== 'transparent') {
                    point.graphic.addClass(point.getClassName() + '-bearish-up', true);
                }
            }
        }

    }
    /* eslint-disable valid-jsdoc */
}

/* *
 *
 *  Prototype Properties
 *
 * */

interface HollowCandlestickSeries {

}
extend(HollowCandlestickSeries.prototype, {

});

HollowCandlestickSeries.prototype.pointClass = HollowCandlestickPoint;

/* *
 *
 * Registry
 *
 * */

declare module '../../Core/Series/SeriesType'{
    interface SeriesTypeRegistry {
        hollowcandlestick: typeof HollowCandlestickSeries;
    }
}

SeriesRegistry.registerSeriesType('hollowcandlestick', HollowCandlestickSeries);

/* *
 *
 * Default Export
 *
 * */
export default HollowCandlestickSeries;

/* *
 *
 * API Options
 *
 * */
/**
 * A `hollowcandlestick` series. If the [type](#series.candlestick.type)
 * option is not specified, it is inherited from [chart.type](
 * #chart.type).
 *
 * @type      {*}
 * @extends   series,plotOptions.hollowcandlestick
 * @excluding dataParser, dataURL, marker
 * @product   highstock
 * @apioption series.hollowcandlestick
 */

/**
 * An array of data points for the series. For the `hollowcandlestick` series
 * type, points can be given in the following ways:
 *
 * 1. An array of arrays with 5 or 4 values. In this case, the values correspond
 *    to `x,open,high,low,close`. If the first value is a string, it is applied
 *    as the name of the point, and the `x` value is inferred. The `x` value can
 *    also be omitted, in which case the inner arrays should be of length 4.
 *    Then the `x` value is automatically calculated, either starting at 0 and
 *    incremented by 1, or from `pointStart` and `pointInterval` given in the
 *    series options.
 *    ```js
 *    data: [
 *        [0, 7, 2, 0, 4],
 *        [1, 1, 4, 2, 8],
 *        [2, 3, 3, 9, 3]
 *    ]
 *    ```
 *
 * 2. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.hollowcandlestick.turboThreshold), this option is not
 *    available.
 *    ```js
 *    data: [{
 *        x: 1,
 *        open: 9,
 *        high: 2,
 *        low: 4,
 *        close: 6,
 *        name: "Point2",
 *        color: "#00FF00"
 *    }, {
 *        x: 1,
 *        open: 1,
 *        high: 4,
 *        low: 7,
 *        close: 7,
 *        name: "Point1",
 *        color: "#FF00FF"
 *    }]
 *    ```
 *
 * @type      {Array<Array<(number|string),number,number,number>|Array<(number|string),number,number,number,number>|*>}
 * @extends   series.candlestick.data
 * @excluding y
 * @product   highstock
 * @apioption series.hollowcandlestick.data
 */

''; // adds doclets above to transpilat
