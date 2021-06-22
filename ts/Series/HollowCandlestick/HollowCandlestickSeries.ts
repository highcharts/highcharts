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
     * @sample stock/demo/hollowcandlestick/
     *         Hollow Candlestick chart
     *
     * @extends      plotOptions.candlestick
     * @excluding    borderColor,borderRadius,borderWidth
     * @product      highstock
     * @optionparent plotOptions.hollowcandlestick
     */
    public static defaultOptions: HollowCandlestickSeriesOptions = merge(CandlestickSeries.defaultOptions, {

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
     * @private
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

        attribs.fill = pick((point as any).fill || attribs.fill);

        return attribs;
    }

    /**
     * Translate from value to pixel as a base method and loop through points
     * in order to calculate the fill.
     * @private
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
            // The first point always color red.
            (points[0] as any).fill = palette.negativeColor;

            for (let i = 1; i < points.length; i++) {
                const point = points[i],
                    previousPoint = points[i - 1];

                (point as any).fill = point.getPointFill(previousPoint);
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
