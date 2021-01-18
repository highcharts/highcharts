/* *
 *
 *  Solid angular gauge module
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

import type SolidGaugePoint from './SolidGaugePoint';
import type SolidGaugeSeriesOptions from './SolidGaugeSeriesOptions';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';
import LegendSymbolMixin from '../../Mixins/LegendSymbol.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        gauge: GaugeSeries,
        pie: {
            prototype: pieProto
        }
    }
} = SeriesRegistry;
import SolidGaugeAxis from '../../Core/Axis/SolidGaugeAxis.js';
import U from '../../Core/Utilities.js';
const {
    clamp,
    extend,
    isNumber,
    merge,
    pick,
    pInt
} = U;

import './SolidGaugeComposition.js';

/**
 * A solid gauge is a circular gauge where the value is indicated by a filled
 * arc, and the color of the arc may variate with the value.
 *
 * @sample highcharts/demo/gauge-solid/
 *         Solid gauges
 *
 * @extends      plotOptions.gauge
 * @excluding    dial, pivot, wrap
 * @product      highcharts
 * @requires     modules/solid-gauge
 * @optionparent plotOptions.solidgauge
 */
var solidGaugeOptions: SolidGaugeSeriesOptions = {
    /**
     * The inner radius for points in a solid gauge. Can be given as a number
     * (pixels) or percentage string.
     *
     * @sample {highcharts} highcharts/plotoptions/solidgauge-radius/
     *         Individual radius and innerRadius
     *
     * @type      {number|string}
     * @default   60
     * @since     4.1.6
     * @product   highcharts
     * @apioption plotOptions.solidgauge.innerRadius
     */

    /**
     * Whether the strokes of the solid gauge should be `round` or `square`.
     *
     * @sample {highcharts} highcharts/demo/gauge-activity/
     *         Rounded gauge
     *
     * @type       {string}
     * @default    round
     * @since      4.2.2
     * @product    highcharts
     * @validvalue ["square", "round"]
     * @apioption  plotOptions.solidgauge.linecap
     */

    /**
     * Allow the gauge to overshoot the end of the perimeter axis by this
     * many degrees. Say if the gauge axis goes from 0 to 60, a value of
     * 100, or 1000, will show 5 degrees beyond the end of the axis when this
     * option is set to 5.
     *
     * @type      {number}
     * @default   0
     * @since     3.0.10
     * @product   highcharts
     * @apioption plotOptions.solidgauge.overshoot
     */

    /**
     * The outer radius for points in a solid gauge. Can be given as a number
     * (pixels) or percentage string.
     *
     * @sample {highcharts} highcharts/plotoptions/solidgauge-radius/
     *         Individual radius and innerRadius
     *
     * @type      {number|string}
     * @default   100
     * @since     4.1.6
     * @product   highcharts
     * @apioption plotOptions.solidgauge.radius
     */

    /**
     * Wether to draw rounded edges on the gauge.
     *
     * @sample {highcharts} highcharts/demo/gauge-activity/
     *         Activity Gauge
     *
     * @type      {boolean}
     * @default   false
     * @since     5.0.8
     * @product   highcharts
     * @apioption plotOptions.solidgauge.rounded
     */

    /**
     * The threshold or base level for the gauge.
     *
     * @sample {highcharts} highcharts/plotoptions/solidgauge-threshold/
     *         Zero threshold with negative and positive values
     *
     * @type      {number|null}
     * @since     5.0.3
     * @product   highcharts
     * @apioption plotOptions.solidgauge.threshold
     */

    /**
     * Whether to give each point an individual color.
     */
    colorByPoint: true,

    dataLabels: {
        y: 0
    }

};


/* *
 *
 *  Class
 *
 * */

/**
 * SolidGauge series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.solidgauge
 *
 * @augments Highcarts.Series
 */
class SolidGaugeSeries extends GaugeSeries {

    /* *
     *
     *  Static properties
     *
     * */

    public static defaultOptions: SolidGaugeSeriesOptions = merge(GaugeSeries.defaultOptions,
        solidGaugeOptions as SolidGaugeSeriesOptions);

    /* *
     *
     *  Properties
     *
     * */

    public data: Array<SolidGaugePoint> = void 0 as any;
    public points: Array<SolidGaugePoint> = void 0 as any;
    public options: SolidGaugeSeriesOptions = void 0 as any;

    public axis: SolidGaugeAxis = void 0 as any;
    public yAxis: SolidGaugeAxis = void 0 as any;
    public startAngleRad: SolidGaugeSeries['thresholdAngleRad'] = void 0 as any;
    public thresholdAngleRad: number = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    // Extend the translate function to extend the Y axis with the necessary
    // decoration (#5895).
    public translate(): void {
        var axis = this.yAxis;

        SolidGaugeAxis.init(axis);

        // Prepare data classes
        if (!axis.dataClasses && axis.options.dataClasses) {
            axis.initDataClasses(axis.options);
        }
        axis.initStops(axis.options);

        // Generate points and inherit data label position
        GaugeSeries.prototype.translate.call(this);
    }

    // Draw the points where each point is one needle.
    public drawPoints(): void {
        var series = this,
            yAxis = series.yAxis,
            center = yAxis.center,
            options = series.options,
            renderer = series.chart.renderer,
            overshoot = options.overshoot,
            overshootVal = isNumber(overshoot) ?
                overshoot / 180 * Math.PI :
                0,
            thresholdAngleRad: (number | undefined);

        // Handle the threshold option
        if (isNumber(options.threshold)) {
            thresholdAngleRad = yAxis.startAngleRad + (yAxis.translate(
                options.threshold,
                null,
                null,
                null,
                true
            ) as any);
        }
        this.thresholdAngleRad = pick(
            thresholdAngleRad, yAxis.startAngleRad
        );


        series.points.forEach(function (
            point: SolidGaugePoint
        ): void {
            // #10630 null point should not be draw
            if (!point.isNull) { // condition like in pie chart
                var graphic = point.graphic,
                    rotation = (yAxis.startAngleRad +
                        (yAxis.translate(
                            point.y as any,
                            null,
                            null,
                            null,
                            true
                        ) as any)),
                    radius = ((
                        pInt(
                            pick(
                                point.options.radius,
                                options.radius,
                                100
                            )
                        ) * center[2]
                    ) / 200),
                    innerRadius = ((
                        pInt(
                            pick(
                                point.options.innerRadius,
                                options.innerRadius,
                                60
                            )
                        ) * center[2]
                    ) / 200),
                    shapeArgs: (SVGAttributes | undefined),
                    d: (string | SVGPath | undefined),
                    toColor = yAxis.toColor(point.y as any, point),
                    axisMinAngle = Math.min(
                        yAxis.startAngleRad,
                        yAxis.endAngleRad
                    ),
                    axisMaxAngle = Math.max(
                        yAxis.startAngleRad,
                        yAxis.endAngleRad
                    ),
                    minAngle,
                    maxAngle;

                if (toColor === 'none') { // #3708
                    toColor = point.color || series.color || 'none';
                }
                if (toColor !== 'none') {
                    point.color = toColor;
                }

                // Handle overshoot and clipping to axis max/min
                rotation = clamp(
                    rotation,
                    axisMinAngle - overshootVal,
                    axisMaxAngle + overshootVal
                );

                // Handle the wrap option
                if (options.wrap === false) {
                    rotation = clamp(rotation, axisMinAngle, axisMaxAngle);
                }

                minAngle = Math.min(rotation, series.thresholdAngleRad);
                maxAngle = Math.max(rotation, series.thresholdAngleRad);

                if (maxAngle - minAngle > 2 * Math.PI) {
                    maxAngle = minAngle + 2 * Math.PI;
                }

                point.shapeArgs = shapeArgs = {
                    x: center[0],
                    y: center[1],
                    r: radius,
                    innerR: innerRadius,
                    start: minAngle,
                    end: maxAngle,
                    rounded: options.rounded
                };
                point.startR = radius; // For PieSeries.animate

                if (graphic) {
                    d = shapeArgs.d;
                    graphic.animate(extend({ fill: toColor }, shapeArgs));
                    if (d) {
                        shapeArgs.d = d; // animate alters it
                    }
                } else {
                    point.graphic = graphic = renderer.arc(shapeArgs)
                        .attr({
                            fill: toColor,
                            'sweep-flag': 0
                        })
                        .add(series.group);
                }

                if (!series.chart.styledMode) {
                    if (options.linecap !== 'square') {
                        graphic.attr({
                            'stroke-linecap': 'round',
                            'stroke-linejoin': 'round'
                        });
                    }
                    graphic.attr({
                        stroke: options.borderColor || 'none',
                        'stroke-width': options.borderWidth || 0
                    });
                }

                if (graphic) {
                    graphic.addClass(point.getClassName(), true);
                }
            }
        });
    }

    // Extend the pie slice animation by animating from start angle and up.
    public animate(init?: boolean): void {
        if (!init) {
            this.startAngleRad = this.thresholdAngleRad;
            pieProto.animate.call(this, init);
        }
    }
}

/* *
 *
 *  Prototype properties
 *
 * */

interface SolidGaugeSeries {
    pointClass: typeof SolidGaugePoint;
    drawLegendSymbol: typeof LegendSymbolMixin.drawRectangle;
}
extend(SolidGaugeSeries.prototype, {
    drawLegendSymbol: LegendSymbolMixin.drawRectangle
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
        solidgauge: typeof SolidGaugeSeries;
    }
}

SeriesRegistry.registerSeriesType('solidgauge', SolidGaugeSeries);

/* *
 *
 *  Default export
 *
 * */

export default SolidGaugeSeries;

/**
 * A `solidgauge` series. If the [type](#series.solidgauge.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 *
 * @extends   series,plotOptions.solidgauge
 * @excluding animationLimit, boostThreshold, connectEnds, connectNulls,
 *            cropThreshold, dashStyle, dataParser, dataURL, dial,
 *            findNearestPointBy, getExtremesFromAll, marker, negativeColor,
 *            pointPlacement, pivot, shadow, softThreshold, stack, stacking,
 *            states, step, threshold, turboThreshold, wrap, zoneAxis, zones,
 *            dataSorting, boostBlending
 * @product   highcharts
 * @requires  modules/solid-gauge
 * @apioption series.solidgauge
 */

/**
 * An array of data points for the series. For the `solidgauge` series
 * type, points can be given in the following ways:
 *
 * 1. An array of numerical values. In this case, the numerical values will be
 *    interpreted as `y` options. Example:
 *    ```js
 *    data: [0, 5, 3, 5]
 *    ```
 *
 * 2. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.solidgauge.turboThreshold), this option is not
 *    available.
 *    ```js
 *    data: [{
 *        y: 5,
 *        name: "Point2",
 *        color: "#00FF00"
 *    }, {
 *        y: 7,
 *        name: "Point1",
 *        color: "#FF00FF"
 *    }]
 *    ```
 *
 * The typical gauge only contains a single data value.
 *
 * @sample {highcharts} highcharts/chart/reflow-true/
 *         Numerical values
 * @sample {highcharts} highcharts/series/data-array-of-objects/
 *         Config objects
 *
 * @type      {Array<number|null|*>}
 * @extends   series.gauge.data
 * @product   highcharts
 * @apioption series.solidgauge.data
 */

/**
 * The inner radius of an individual point in a solid gauge. Can be given as a
 * number (pixels) or percentage string.
 *
 * @sample {highcharts} highcharts/plotoptions/solidgauge-radius/
 *         Individual radius and innerRadius
 *
 * @type      {number|string}
 * @since     4.1.6
 * @product   highcharts
 * @apioption series.solidgauge.data.innerRadius
 */

/**
 * The outer radius of an individual point in a solid gauge. Can be
 * given as a number (pixels) or percentage string.
 *
 * @sample {highcharts} highcharts/plotoptions/solidgauge-radius/
 *         Individual radius and innerRadius
 *
 * @type      {number|string}
 * @since     4.1.6
 * @product   highcharts
 * @apioption series.solidgauge.data.radius
 */

''; // adds doclets above to transpiled file
