/* *
 *
 *  (c) 2010-2024 Torstein Honsi
 *
 *  Extension for radial axes
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

import type RadialAxisOptions from './RadialAxisOptions';

/**
     * Circular axis around the perimeter of a polar chart.
     * @private
     */
const defaultCircularOptions: DeepPartial<RadialAxisOptions> = {
    gridLineWidth: 1, // Spokes
    labels: {
        align: void 0, // Auto
        x: 0,
        y: void 0, // Auto
        style: {
            textOverflow: 'none' // Wrap lines by default (#7248)
        }
    },
    maxPadding: 0,
    minPadding: 0,
    showLastLabel: false,
    tickLength: 0
};

/**
 * The default options extend defaultYAxisOptions.
 * @private
 */
const defaultRadialGaugeOptions: DeepPartial<RadialAxisOptions> = {
    endOnTick: false,
    gridLineWidth: 0,
    labels: {
        align: 'center',
        distance: -25,
        x: 0,
        y: void 0 // Auto
    },
    lineWidth: 1,
    minorGridLineWidth: 0,
    minorTickInterval: 'auto',
    minorTickLength: 10,
    minorTickPosition: 'inside',
    minorTickWidth: 1,
    startOnTick: false,
    tickLength: 10,
    tickPixelInterval: 100,
    tickPosition: 'inside',
    tickWidth: 2,
    title: {
        rotation: 0,
        text: ''
    },
    zIndex: 2 // Behind dials, points in the series group
};

/**
 * Radial axis, like a spoke in a polar chart.
 * @private
 */
const defaultRadialOptions: DeepPartial<RadialAxisOptions> = {

    /**
     * In a polar chart, this is the angle of the Y axis in degrees, where
     * 0 is up and 90 is right. The angle determines the position of the
     * axis line and the labels, though the coordinate system is unaffected.
     * Since v8.0.0 this option is also applicable for X axis (inverted
     * polar).
     *
     * @sample {highcharts} highcharts/xaxis/angle/
     *         Custom X axis' angle on inverted polar chart
     * @sample {highcharts} highcharts/yaxis/angle/
     *         Dual axis polar chart
     *
     * @type      {number}
     * @default   0
     * @since     4.2.7
     * @product   highcharts
     * @apioption xAxis.angle
     */

    /**
     * Polar charts only. Whether the grid lines should draw as a polygon
     * with straight lines between categories, or as circles. Can be either
     * `circle` or `polygon`. Since v8.0.0 this option is also applicable
     * for X axis (inverted polar).
     *
     * @sample {highcharts} highcharts/demo/polar-spider/
     *         Polygon grid lines
     * @sample {highcharts} highcharts/xaxis/gridlineinterpolation/
     *         Circle and polygon on inverted polar
     * @sample {highcharts} highcharts/yaxis/gridlineinterpolation/
     *         Circle and polygon
     *
     * @type       {string}
     * @product    highcharts
     * @validvalue ["circle", "polygon"]
     * @apioption  xAxis.gridLineInterpolation
     */
    gridLineInterpolation: 'circle',
    gridLineWidth: 1,
    labels: {
        align: 'right',
        padding: 5,
        x: -3,
        y: -2
    },
    showLastLabel: false,
    title: {
        x: 4,
        text: null,
        rotation: 90
    }
};

/* *
 *
 *  Default Export
 *
 * */

const RadialAxisDefaults = {
    circular: defaultCircularOptions,
    radial: defaultRadialOptions,
    radialGauge: defaultRadialGaugeOptions
};

export default RadialAxisDefaults;
