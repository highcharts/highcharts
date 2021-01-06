/* *
 *
 *  (c) 2010-2021 Sebastian Bochan, Rafal Sebestjanski
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

import type LollipopSeriesOptions from './LollipopSeriesOptions';
import LollipopPoint from './LollipopPoint.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        area: {
            prototype: areaProto
        },
        column: {
            prototype: colProto
        },
        dumbbell: DumbbellSeries
    }
} = SeriesRegistry;
import U from '../../Core/Utilities.js';
const {
    pick,
    merge,
    extend
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * lollipop series type
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.lollipop
 *
 * @augments Highcharts.Series
 *
 */
class LollipopSeries extends DumbbellSeries {

    /* *
     *
     *  Static properties
     *
     * */

    /**
     * The lollipop series is a carteseian series with a line anchored from
     * the x axis and a dot at the end to mark the value.
     * Requires `highcharts-more.js`, `modules/dumbbell.js` and
     * `modules/lollipop.js`.
     *
     * @sample {highcharts} highcharts/demo/lollipop/
     *         Lollipop chart
     * @sample {highcharts} highcharts/series-dumbbell/styled-mode-dumbbell/
     *         Styled mode
     *
     * @extends      plotOptions.dumbbell
     * @product      highcharts highstock
     * @excluding    fillColor, fillOpacity, lineWidth, stack, stacking,
     *               lowColor, stickyTracking, trackByArea
     * @since 8.0.0
     * @optionparent plotOptions.lollipop
     */
    public static defaultOptions: LollipopSeriesOptions = merge(
        DumbbellSeries.defaultOptions,
        {
            /** @ignore-option */
            lowColor: void 0,
            /** @ignore-option */
            threshold: 0,
            /** @ignore-option */
            connectorWidth: 1,
            /** @ignore-option */
            groupPadding: 0.2,
            /** @ignore-option */
            pointPadding: 0.1,
            /** @ignore-option */
            states: {
                hover: {
                    /** @ignore-option */
                    lineWidthPlus: 0,
                    /** @ignore-option */
                    connectorWidthPlus: 1,
                    /** @ignore-option */
                    halo: false
                }
            },
            tooltip: {
                pointFormat: '<span style="color:{series.color}">●</span> {series.name}: <b>{point.y}</b><br/>'
            }
        } as LollipopSeriesOptions);

    /* *
     *
     *  Properties
     *
     * */

    public data: Array<LollipopPoint> = void 0 as any;
    public options: LollipopSeriesOptions = void 0 as any;
    public points: Array<LollipopPoint> = void 0 as any;

    public toYData(point: LollipopPoint): Array<number> {
        return [pick(point.y, point.low)];
    }

}

/* *
 *
 *  Prototype properties
 *
 * */

interface LollipopSeries {
    pointClass: typeof LollipopPoint;
    pointArrayMap: Array<string>;
    pointValKey: string;
    translatePoint: typeof areaProto['translate'];
    drawPoint: typeof areaProto['drawPoints'];
    drawDataLabels: typeof colProto['drawDataLabels'];
    setShapeArgs: typeof colProto['translate'];
}

extend(LollipopSeries.prototype, {
    pointArrayMap: ['y'],
    pointValKey: 'y',
    translatePoint: areaProto.translate,
    drawPoint: areaProto.drawPoints,
    drawDataLabels: colProto.drawDataLabels,
    setShapeArgs: colProto.translate,
    pointClass: LollipopPoint
});

/* *
 *
 *  Registry
 *
 * */

/**
 * @private
 */
declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        lollipop: typeof LollipopSeries;
    }
}

SeriesRegistry.registerSeriesType('lollipop', LollipopSeries);

/* *
 *
 *  Default export
 *
 * */

export default LollipopSeries;

/**
 * The `lollipop` series. If the [type](#series.lollipop.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.lollipop,
 * @excluding boostThreshold, boostBlending
 * @product   highcharts highstock
 * @requires  highcharts-more
 * @requires  modules/dumbbell
 * @requires  modules/lollipop
 * @apioption series.lollipop
 */
/**
 * An array of data points for the series. For the `lollipop` series type,
 * points can be given in the following ways:
 *
 * 1. An array of numerical values. In this case, the numerical values will be
 *    interpreted as `y` options. The `x` values will be automatically
 *    calculated, either starting at 0 and incremented by 1, or from
 *    `pointStart` and `pointInterval` given in the series options. If the axis
 *    has categories, these will be used. Example:
 *    ```js
 *    data: [0, 5, 3, 5]
 *    ```
 *
 * 2. An array of arrays with 2 values. In this case, the values correspond to
 *    `x,y`. If the first value is a string, it is applied as the name of the
 *    point, and the `x` value is inferred.
 *    ```js
 *    data: [
 *        [0, 6],
 *        [1, 2],
 *        [2, 6]
 *    ]
 *    ```
 *
 * 3. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.lollipop.turboThreshold), this option is not
 *    available.
 *    ```js
 *    data: [{
 *        x: 1,
 *        y: 9,
 *        name: "Point2",
 *        color: "#00FF00",
 *        connectorWidth: 3,
 *        connectorColor: "#FF00FF"
 *    }, {
 *        x: 1,
 *        y: 6,
 *        name: "Point1",
 *        color: "#FF00FF"
 *    }]
 *    ```
 *
 * @sample {highcharts} highcharts/chart/reflow-true/
 *         Numerical values
 * @sample {highcharts} highcharts/series/data-array-of-arrays/
 *         Arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/
 *         Arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/
 *         Arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/
 *         Config objects
 *
 * @type      {Array<number|Array<(number|string),(number|null)>|null|*>}
 * @extends   series.dumbbell.data
 * @excluding high, low, lowColor
 * @product   highcharts highstock
 * @apioption series.lollipop.data
 */

/**
* The y value of the point.
*
* @type      {number|null}
* @product   highcharts highstock
* @apioption series.line.data.y
*/
''; // adds doclets above to transpiled file
