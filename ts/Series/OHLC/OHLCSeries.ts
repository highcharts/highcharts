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

import type OHLCSeriesOptions from './OHLCSeriesOptions';
import type { StatesOptionsKey } from '../../Core/Series/StatesOptions';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';
import OHLCPoint from './OHLCPoint.js';
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
 * The ohlc series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.ohlc
 *
 * @augments Highcharts.Series
 */
class OHLCSeries extends ColumnSeries {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * An OHLC chart is a style of financial chart used to describe price
     * movements over time. It displays open, high, low and close values per
     * data point.
     *
     * @sample stock/demo/ohlc/
     *         OHLC chart
     *
     * @extends      plotOptions.column
     * @excluding    borderColor, borderRadius, borderWidth, crisp, stacking,
     *               stack
     * @product      highstock
     * @optionparent plotOptions.ohlc
     */
    public static defaultOptions: OHLCSeriesOptions = merge(ColumnSeries.defaultOptions, {

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
         * @apioption plotOptions.ohlc.dataGrouping.groupPixelWidth
         */

        /**
         * The pixel width of the line/border. Defaults to `1`.
         *
         * @sample {highstock} stock/plotoptions/ohlc-linewidth/
         *         A greater line width
         *
         * @type    {number}
         * @default 1
         * @product highstock
         *
         * @private
         */
        lineWidth: 1,

        tooltip: {
            pointFormat: '<span style="color:{point.color}">\u25CF</span> ' +
            '<b> {series.name}</b><br/>' +
            'Open: {point.open}<br/>' +
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
                 * The pixel width of the line representing the OHLC point.
                 *
                 * @type    {number}
                 * @default 3
                 * @product highstock
                 */
                lineWidth: 3
            }
        },

        /**
         * Determines which one of `open`, `high`, `low`, `close` values should
         * be represented as `point.y`, which is later used to set dataLabel
         * position and [compare](#plotOptions.series.compare).
         *
         * @sample {highstock} stock/plotoptions/ohlc-pointvalkey/
         *         Possible values
         *
         * @type       {string}
         * @default    close
         * @validvalue ["open", "high", "low", "close"]
         * @product    highstock
         * @apioption  plotOptions.ohlc.pointValKey
         */

        /**
         * @default   close
         * @apioption plotOptions.ohlc.colorKey
         */

        /**
         * Line color for up points.
         *
         * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @product   highstock
         * @apioption plotOptions.ohlc.upColor
         */

        stickyTracking: true

    } as OHLCSeriesOptions);

    /* *
     *
     *  Properties
     *
     * */

    public data: Array<OHLCPoint> = void 0 as any;

    public options: OHLCSeriesOptions = void 0 as any;

    public points: Array<OHLCPoint> = void 0 as any;

    public yData: Array<Array<number>> = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * Draw the data points
     * @private
     */
    public drawPoints(): void {
        var series = this,
            points = series.points,
            chart = series.chart,
            /**
             * Extend vertical stem to open and close values.
             */
            extendStem = function (
                path: SVGPath,
                halfStrokeWidth: number,
                openOrClose: number
            ): void {
                const start = path[0];
                const end = path[1];

                // We don't need to worry about crisp - openOrClose value
                // is already crisped and halfStrokeWidth should remove it.
                if (typeof start[2] === 'number') {
                    start[2] = Math.max(
                        openOrClose + halfStrokeWidth,
                        start[2]
                    );
                }
                if (typeof end[2] === 'number') {
                    end[2] = Math.min(
                        openOrClose - halfStrokeWidth,
                        end[2]
                    );
                }
            };


        points.forEach(function (point): void {
            var plotOpen,
                plotClose,
                crispCorr,
                halfWidth,
                path: SVGPath,
                graphic = point.graphic,
                crispX,
                isNew = !graphic,
                strokeWidth;

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
                strokeWidth = graphic.strokeWidth();
                crispCorr = (strokeWidth % 2) / 2;
                // #2596:
                crispX = Math.round(point.plotX as any) - crispCorr;
                halfWidth = Math.round((point.shapeArgs as any).width / 2);

                // the vertical stem
                path = [
                    ['M', crispX, Math.round(point.yBottom as any)],
                    ['L', crispX, Math.round(point.plotHigh as any)]
                ];

                // open
                if (point.open !== null) {
                    plotOpen = Math.round(point.plotOpen) + crispCorr;
                    path.push(
                        ['M', crispX, plotOpen],
                        ['L', crispX - halfWidth, plotOpen]
                    );

                    extendStem(path, strokeWidth / 2, plotOpen);
                }

                // close
                if (point.close !== null) {
                    plotClose = Math.round(point.plotClose) + crispCorr;
                    path.push(
                        ['M', crispX, plotClose],
                        ['L', crispX + halfWidth, plotClose]
                    );

                    extendStem(path, strokeWidth / 2, plotClose);
                }

                graphic[isNew ? 'attr' : 'animate']({ d: path })
                    .addClass(point.getClassName(), true);

            }


        });

    }

    /**
     * @private
     * @function Highcarts.seriesTypes.ohlc#init
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
        point: OHLCPoint,
        state: StatesOptionsKey
    ): SVGAttributes {
        var attribs = super.pointAttribs.call(
                this,
                point,
                state
            ),
            options = this.options;

        delete attribs.fill;

        if (
            !point.options.color &&
        options.upColor &&
        point.open < point.close
        ) {
            attribs.stroke = options.upColor;
        }

        return attribs;
    }

    public toYData(point: OHLCPoint): OHLCPoint.PointShortOptions {
        // return a plain array for speedy calculation
        return [point.open, point.high, point.low, point.close];
    }

    /**
     * Translate data points from raw values x and y to plotX and plotY
     *
     * @private
     * @function Highcharts.seriesTypes.ohlc#translate
     * @return {void}
     */
    public translate(): void {
        var series = this,
            yAxis = series.yAxis,
            hasModifyValue = !!series.modifyValue,
            translated = [
                'plotOpen',
                'plotHigh',
                'plotLow',
                'plotClose',
                'yBottom'
            ]; // translate OHLC for

        super.translate.apply(series);

        // Do the translation
        series.points.forEach(function (point): void {
            [point.open, point.high, point.low, point.close, point.low]
                .forEach(
                    function (value, i): void {
                        if (value !== null) {
                            if (hasModifyValue) {
                                value = (series.modifyValue as any)(value);
                            }
                            (point as any)[translated[i]] =
                                yAxis.toPixels(value, true);
                        }
                    }
                );

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

interface OHLCSeries {
    pointAttrToOptions: Record<string, string>;
    pointClass: typeof OHLCPoint;
    init(): void;
    toYData(point: OHLCPoint): OHLCPoint.PointShortOptions;
}
extend(OHLCSeries.prototype, {
    animate: null as any, // Disable animation
    directTouch: false,
    pointArrayMap: ['open', 'high', 'low', 'close'],
    pointAttrToOptions: {
        stroke: 'color',
        'stroke-width': 'lineWidth'
    },
    pointValKey: 'close'
});

OHLCSeries.prototype.pointClass = OHLCPoint;

/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        ohlc: typeof OHLCSeries;
    }
}
SeriesRegistry.registerSeriesType('ohlc', OHLCSeries);

/* *
 *
 *  Default Export
 *
 * */

export default OHLCSeries;

/* *
 *
 *  API Options
 *
 * */

/**
 * A `ohlc` series. If the [type](#series.ohlc.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.ohlc
 * @excluding dataParser, dataURL
 * @product   highstock
 * @apioption series.ohlc
 */

/**
 * An array of data points for the series. For the `ohlc` series type,
 * points can be given in the following ways:
 *
 * 1. An array of arrays with 5 or 4 values. In this case, the values correspond
 *    to `x,open,high,low,close`. If the first value is a string, it is applied
 *    as the name of the point, and the `x` value is inferred. The `x` value can
 *    also be omitted, in which case the inner arrays should be of length 4\.
 *    Then the `x` value is automatically calculated, either starting at 0 and
 *    incremented by 1, or from `pointStart` and `pointInterval` given in the
 *    series options.
 *    ```js
 *    data: [
 *        [0, 6, 5, 6, 7],
 *        [1, 9, 4, 8, 2],
 *        [2, 6, 3, 4, 10]
 *    ]
 *    ```
 *
 * 2. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.ohlc.turboThreshold), this option is not
 *    available.
 *    ```js
 *    data: [{
 *        x: 1,
 *        open: 3,
 *        high: 4,
 *        low: 5,
 *        close: 2,
 *        name: "Point2",
 *        color: "#00FF00"
 *    }, {
 *        x: 1,
 *        open: 4,
 *        high: 3,
 *        low: 6,
 *        close: 7,
 *        name: "Point1",
 *        color: "#FF00FF"
 *    }]
 *    ```
 *
 * @type      {Array<Array<(number|string),number,number,number>|Array<(number|string),number,number,number,number>|*>}
 * @extends   series.arearange.data
 * @excluding y, marker
 * @product   highstock
 * @apioption series.ohlc.data
 */

/**
 * The closing value of each data point.
 *
 * @type      {number}
 * @product   highstock
 * @apioption series.ohlc.data.close
 */

/**
 * The opening value of each data point.
 *
 * @type      {number}
 * @product   highstock
 * @apioption series.ohlc.data.open
 */

''; // adds doclets above to transpilat
