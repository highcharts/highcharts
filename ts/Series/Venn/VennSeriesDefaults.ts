/* *
 *
 *  Experimental Highcharts module which enables visualization of a Venn
 *  diagram.
 *
 *  (c) 2016-2021 Highsoft AS
 *  Authors: Jon Arild Nygard
 *
 *  Layout algorithm by Ben Frederickson:
 *  https://www.benfrederickson.com/better-venn-diagrams/
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

import type VennSeriesOptions from './VennSeriesOptions';

import { Palette } from '../../Core/Color/Palettes.js';

/* *
 *
 *  API Options
 *
 * */

/**
 * A Venn diagram displays all possible logical relations between a
 * collection of different sets. The sets are represented by circles, and
 * the relation between the sets are displayed by the overlap or lack of
 * overlap between them. The venn diagram is a special case of Euler
 * diagrams, which can also be displayed by this series type.
 *
 * @sample {highcharts} highcharts/demo/venn-diagram/
 *         Venn diagram
 * @sample {highcharts} highcharts/demo/euler-diagram/
 *         Euler diagram
 * @sample {highcharts} highcharts/series-venn/point-legend/
 *         Venn diagram with a legend
 *
 * @extends      plotOptions.scatter
 * @excluding    connectEnds, connectNulls, cropThreshold, dragDrop,
 *               findNearestPointBy, getExtremesFromAll, jitter, label,
 *               linecap, lineWidth, linkedTo, marker, negativeColor,
 *               pointInterval, pointIntervalUnit, pointPlacement,
 *               pointStart, softThreshold, stacking, steps, threshold,
 *               xAxis, yAxis, zoneAxis, zones, dataSorting, boostThreshold,
 *               boostBlending
 * @product      highcharts
 * @requires     modules/venn
 * @optionparent plotOptions.venn
 */
const VennSeriesDefaults: VennSeriesOptions = {

    borderColor: Palette.neutralColor20,

    borderDashStyle: 'solid' as any,

    borderWidth: 1,

    brighten: 0,

    clip: false,

    colorByPoint: true,

    dataLabels: {

        enabled: true,

        verticalAlign: 'middle',

        formatter: function (): (string|undefined) {
            return this.point.name;
        }

    },

    /**
     * @default   true
     * @extends   plotOptions.series.inactiveOtherPoints
     * @private
     */
    inactiveOtherPoints: true,

    /**
     * @ignore-option
     * @private
     */
    marker: false as any,

    opacity: 0.75,

    showInLegend: false,

    /**
     * @ignore-option
     *
     * @private
     */
    legendType: 'point',

    states: {

        /**
         * @excluding halo
         */
        hover: {

            opacity: 1,

            borderColor: Palette.neutralColor80

        },

        /**
         * @excluding halo
         */
        select: {

            color: Palette.neutralColor20,

            borderColor: Palette.neutralColor100,

            animation: false

        },

        inactive: {

            opacity: 0.075

        }
    },

    tooltip: {

        pointFormat: '{point.name}: {point.value}'

    },

    legendSymbol: 'rectangle'

};

/**
 * A `venn` series. If the [type](#series.venn.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.venn
 * @excluding connectEnds, connectNulls, cropThreshold, dataParser, dataURL,
 *            findNearestPointBy, getExtremesFromAll, label, linecap, lineWidth,
 *            linkedTo, marker, negativeColor, pointInterval, pointIntervalUnit,
 *            pointPlacement, pointStart, softThreshold, stack, stacking, steps,
 *            threshold, xAxis, yAxis, zoneAxis, zones, dataSorting,
 *            boostThreshold, boostBlending
 * @product   highcharts
 * @requires  modules/venn
 * @apioption series.venn
 */

/**
 * @type      {Array<*>}
 * @extends   series.scatter.data
 * @excluding marker, x, y
 * @product   highcharts
 * @apioption series.venn.data
 */

/**
 * The name of the point. Used in data labels and tooltip. If name is not
 * defined then it will default to the joined values in
 * [sets](#series.venn.sets).
 *
 * @sample {highcharts} highcharts/demo/venn-diagram/
 *         Venn diagram
 * @sample {highcharts} highcharts/demo/euler-diagram/
 *         Euler diagram
 *
 * @type      {number}
 * @since     7.0.0
 * @product   highcharts
 * @apioption series.venn.data.name
 */

/**
 * The value of the point, resulting in a relative area of the circle, or area
 * of overlap between two sets in the venn or euler diagram.
 *
 * @sample {highcharts} highcharts/demo/venn-diagram/
 *         Venn diagram
 * @sample {highcharts} highcharts/demo/euler-diagram/
 *         Euler diagram
 *
 * @type      {number}
 * @since     7.0.0
 * @product   highcharts
 * @apioption series.venn.data.value
 */

/**
 * The set or sets the options will be applied to. If a single entry is defined,
 * then it will create a new set. If more than one entry is defined, then it
 * will define the overlap between the sets in the array.
 *
 * @sample {highcharts} highcharts/demo/venn-diagram/
 *         Venn diagram
 * @sample {highcharts} highcharts/demo/euler-diagram/
 *         Euler diagram
 *
 * @type      {Array<string>}
 * @since     7.0.0
 * @product   highcharts
 * @apioption series.venn.data.sets
 */

/**
 * @excluding halo
 * @apioption series.venn.states.hover
 */

/**
 * @excluding halo
 * @apioption series.venn.states.select
 */

''; // detach doclets above

/* *
 *
 *  Default Export
 *
 * */

export default VennSeriesDefaults;
