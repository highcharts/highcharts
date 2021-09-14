/* *
 *
 *  (c) 2010-2021 Pawel Lysy
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

import type HLCSeriesOptions from './HLCSeriesOptions';
import type { StatesOptionsKey } from '../../Core/Series/StatesOptions';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';
import HLCPoint from './HLCPoint.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        column: ColumnSeries
    }
} = SeriesRegistry;
import U from '../../Core/Utilities.js';
const {
    extend,
    merge
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * The hlc series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.hlc
 *
 * @augments Highcharts.Series
 */
class HLCSeries extends ColumnSeries {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * An HLC chart is a style of financial chart used to describe price
     * movements over time. It displays high, low and close values per
     * data point.
     *
     * @sample stock/demo/hlc/
     *         HLC chart
     *
     * @extends      plotOptions.column
     * @excluding    borderColor, borderRadius, borderWidth, crisp, stacking,
     *               stack
     * @product      highstock
     * @optionparent plotOptions.hlc
     */
    public static defaultOptions: HLCSeriesOptions = merge(ColumnSeries.defaultOptions, {

        /**
         * The approximate pixel width of each group. If for example a series
         * with 30 points is displayed over a 600 pixel wide plot area, no
         * grouping is performed. If however the series contains so many points
         * that the spacing is less than the groupPixelWidth, Highcharts will
         * try to group it into appropriate groups so that each is more or less
         * two pixels wide. Defaults to `5`.
         *
         * @type      {number}
         * @default   5
         * @product   highstock
         * @apioption plotOptions.hlc.dataGrouping.groupPixelWidth
         */

        /**
         * @type      {Highcharts.DataGroupingApproximationValue|Function}
         * @default   hlc
         * @product   highstock
         * @apioption plotOptions.hlc.dataGrouping.approximation
         */

        /**
         * @default   close
         * @apioption plotOptions.hlc.colorKey
         */

        /**
         * The pixel width of the line/border. Defaults to `1`.
         *
         * @sample {highstock} stock/plotoptions/hlc-linewidth/
         *         A greater line width
         *
         * @type    {number}
         * @default 1
         * @product highstock
         *
         * @public
         */
        lineWidth: 1,

        tooltip: {
            pointFormat: '<span style="color:{point.color}">\u25CF</span> ' +
            '<b> {series.name}</b><br/>' +
            'High: {point.high}<br/>' +
            'Low: {point.low}<br/>' +
            'Close: {point.close}<br/>'
        },

        threshold: null as any,

        states: {

            /**
             * @extends plotOptions.column.states.hover
             * @product highstock
             */
            hover: {

                /**
                 * The pixel width of the line representing the HLC point.
                 *
                 * @type    {number}
                 * @default 3
                 * @product highstock
                 */
                lineWidth: 3
            }
        },

        /**
         * Determines which one of  `high`, `low`, `close` values should
         * be represented as `point.y`, which is later used to set dataLabel
         * position and [compare](#plotOptions.series.compare).
         *
         * @sample {highstock} stock/plotoptions/hlc-pointvalkey/
         *         Possible values
         *
         * @type       {string}
         * @default    close
         * @validvalue ["high", "low", "close"]
         * @product    highstock
         * @apioption  plotOptions.hlc.pointValKey
         */

        /**
         * @default   close
         * @apioption plotOptions.hlc.colorKey
         */

        stickyTracking: true

    } as HLCSeriesOptions);

    /* *
     *
     *  Properties
     *
     * */

    public data: Array<HLCPoint> = void 0 as any;

    public options: HLCSeriesOptions = void 0 as any;

    public points: Array<HLCPoint> = void 0 as any;

    public yData: Array<Array<number>> = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * Extend the path if close is not between high and low.
     *
     * @param {SVGPath} path the path array of the point
     * @param {number} halfStrokeWidth
     * @param {number} value value of the point to which the stem should be extended
     */

    protected extendStem(
        path: SVGPath,
        halfStrokeWidth: number,
        value: number
    ): void {
        const start = path[0];
        const end = path[1];

        // We don't need to worry about crisp - close value
        // is already crisped and halfStrokeWidth should remove it.
        if (typeof start[2] === 'number') {
            start[2] = Math.max(
                value + halfStrokeWidth,
                start[2]
            );
        }
        if (typeof end[2] === 'number') {
            end[2] = Math.min(
                value - halfStrokeWidth,
                end[2]
            );
        }

    }

    /**
     * Function to create SVGPath of the point based on the
     * plot positions of this point.
     *
     * @param {SVGPath} point
     * @param {SVGElement} graphic
     * @returns {SVGPath}
     */

    protected getPointPath(point: HLCPoint, graphic: SVGElement): SVGPath {
        // crisp vector coordinates
        const strokeWidth = graphic.strokeWidth(),
            series = point.series,
            crispCorr = (strokeWidth % 2) / 2,
            // #2596:
            crispX = Math.round(point.plotX as any) - crispCorr,
            halfWidth = Math.round((point.shapeArgs as any).width / 2);

        let path: SVGPath,
            plotClose = point.plotClose;

        // the vertical stem
        path = [
            ['M', crispX, Math.round(point.yBottom as any)],
            ['L', crispX, Math.round(point.plotHigh as any)]
        ];

        // close
        if (point.close !== null) {
            plotClose = Math.round(point.plotClose) + crispCorr;
            path.push(
                ['M', crispX, plotClose],
                ['L', crispX + halfWidth, plotClose]
            );

            series.extendStem(path, strokeWidth / 2, plotClose);
        }
        return path;
    }


    /**
     * @private
     * draw single point
     */

    public drawSinglePoint(point: HLCPoint): void {

        const series = point.series,
            chart = series.chart;
        let path: SVGPath,
            graphic = point.graphic,
            isNew = !graphic;

        if (typeof point.plotY !== 'undefined') {

            // Create and/or update the graphic
            if (!graphic) {
                point.graphic = graphic = chart.renderer.path()
                    .add(series.group);
            }

            if (!chart.styledMode) {
                graphic.attr(
                    series.pointAttribs(
                        point,
                        (point.selected && 'select') as any
                    )
                ); // #3897
            }

            // crisp vector coordinates
            path = series.getPointPath(point, graphic);
            graphic[isNew ? 'attr' : 'animate']({ d: path })
                .addClass(point.getClassName(), true);

        }
    }

    /**
     * Draw the data points
     * @private
     */

    public drawPoints(): void {
        this.points.forEach(this.drawSinglePoint);
    }

    /**
     * @private
     * @function Highcharts.seriesTypes.hlc#init
     * @return {void}
     */
    public init(): void {
        super.init.apply(this, arguments as any);

        this.options.stacking = void 0; // #8817
    }

    /**
     * Postprocess mapping between options and SVG attributes
     * @private
     */
    public pointAttribs(
        point: HLCPoint,
        state: StatesOptionsKey
    ): SVGAttributes {
        const attribs = super.pointAttribs.call(
            this,
            point,
            state
        );

        delete attribs.fill;

        return attribs;
    }

    public toYData(point: HLCPoint): Array<number> {
        // return a plain array for speedy calculation
        return [point.high, point.low, point.close];
    }

    /**
     * Translate data points from raw values x and y to plotX and plotY
     *
     * @private
     * @function Highcharts.seriesTypes.hlc#translate
     * @return {void}
     */

    public translate(): void {
        const series = this,
            yAxis = series.yAxis,
            names = (this.pointArrayMap && this.pointArrayMap.slice()) || [],
            translated = names.map(
                (name: string): string =>
                    `plot${name.charAt(0).toUpperCase() + name.slice(1)}`
            );
        translated.push('yBottom');
        names.push('low');
        super.translate.apply(series);

        // Do the translation
        series.points.forEach(function (point): void {
            names.forEach(
                function (name: string, i: number): void {
                    let value = (point as any)[name];
                    if (value !== null) {
                        if (
                            series.dataModify &&
                            series.dataModify.modifyValue
                        ) {
                            value = series.dataModify.modifyValue(value);
                        }
                        (point as any)[translated[i]] =
                            yAxis.toPixels(value, true);
                    }
                });

            // Align the tooltip to the high value to avoid covering the
            // point
            (point.tooltipPos as any)[1] =
                (point.plotHigh as any) + yAxis.pos - series.chart.plotTop;
        });
    }

    /* eslint-enable valid-jsdoc */

}

/* *
 *
 *  Prototype Properties
 *
 * */

interface HLCSeries {
    pointAttrToOptions: Record<string, string>;
    pointClass: typeof HLCPoint;
    init(): void;
    toYData(point: HLCPoint): Array<number>;
}
extend(HLCSeries.prototype, {
    animate: null as any, // Disable animation
    directTouch: false,
    pointArrayMap: ['high', 'low', 'close'],
    pointAttrToOptions: {
        stroke: 'color',
        'stroke-width': 'lineWidth'
    },
    pointValKey: 'close'
});

HLCSeries.prototype.pointClass = HLCPoint;

/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        hlc: typeof HLCSeries;
    }
}
SeriesRegistry.registerSeriesType('hlc', HLCSeries);

/* *
 *
 *  Default Export
 *
 * */

export default HLCSeries;

/* *
 *
 *  API Options
 *
 * */

/**
 * A `hlc` series. If the [type](#series.hlc.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.hlc
 * @excluding dataParser, dataURL
 * @product   highstock
 * @apioption series.hlc
 */

/**
 * An array of data points for the series. For the `hlc` series type,
 * points can be given in the following ways:
 *
 * 1. An array of arrays with 4 or 3 values. In this case, the values correspond
 *    to `x,high,low,close`. If the first value is a string, it is applied
 *    as the name of the point, and the `x` value is inferred. The `x` value can
 *    also be omitted, in which case the inner arrays should be of length of 3\.
 *    Then the `x` value is automatically calculated, either starting at 0 and
 *    incremented by 1, or from `pointStart` and `pointInterval` given in the
 *    series options.
 *    ```js
 *    data: [
 *        [0, 5, 6, 7],
 *        [1, 4, 8, 2],
 *        [2, 3, 4, 10]
 *    ]
 *    ```
 *
 * 2. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.hlc.turboThreshold), this option is not
 *    available.
 *    ```js
 *    data: [{
 *        x: 1,
 *        high: 4,
 *        low: 5,
 *        close: 2,
 *        name: "Point2",
 *        color: "#00FF00"
 *    }, {
 *        x: 1,
 *        high: 3,
 *        low: 6,
 *        close: 7,
 *        name: "Point1",
 *        color: "#FF00FF"
 *    }]
 *    ```
 *
 * @type      {Array<Array<(number|string),number,number>|Array<(number|string),number,number,number>|*>}
 * @extends   series.arearange.data
 * @excluding y, marker
 * @product   highstock
 * @apioption series.hlc.data
 */

/**
 * The closing value of each data point.
 *
 * @type      {number}
 * @product   highstock
 * @apioption series.hlc.data.close
 */

''; // adds doclets above to transpilat
