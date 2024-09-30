/* *
 *
 *  Dependency wheel module
 *
 *  (c) 2018-2024 Torstein Honsi
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

import type DependencyWheelSeriesOptions from './DependencyWheelSeriesOptions';

/* *
 *
 *  API Options
 *
 * */

/**
 * A dependency wheel chart is a type of flow diagram, where all nodes are laid
 * out in a circle, and the flow between the are drawn as link bands.
 *
 * @sample highcharts/demo/dependency-wheel/
 *         Dependency wheel
 *
 * @extends      plotOptions.sankey
 * @exclude      dataSorting, nodeAlignment, nodeDistance
 * @since        7.1.0
 * @product      highcharts
 * @requires     modules/dependency-wheel
 * @optionparent plotOptions.dependencywheel
 */
const DependencyWheelSeriesDefaults: DependencyWheelSeriesOptions = {

    /**
     * The corner radius of the border surrounding each node. A number
     * signifies pixels. A percentage string, like for example `50%`, signifies
     * a relative size. For nodes this is relative to the node width.
     *
     * @type    {number|string|Highcharts.BorderRadiusOptionsObject}
     * @default 3
     * @product highcharts
     * @since   11.0.0
     * @apioption plotOptions.dependencywheel.borderRadius
    */

    /**
     * Distance between the data label and the center of the node.
     *
     * @type      {number}
     * @default   0
     * @apioption plotOptions.dependencywheel.dataLabels.distance
     */

    /**
     * A format string for data labels of the links between nodes. Available
     * variables are the same as for `formatter`.
     *
     * @see [nodeFormat](#nodeFormat) for formatting node labels
     *
     * @apioption plotOptions.dependencywheel.dataLabels.format
     */

    /**
     * Callback to format data labels of the links between nodes. The `format`
     * option takes precedence over the `formatter` option.
     *
     * @see [nodeFormatter](#nodeFormatter) for formatting node labels
     *
     * @apioption plotOptions.dependencywheel.dataLabels.formatter
     */

    /**
     * The format string specifying what to show for nodes in the sankey
     * diagram. By default the nodeFormatter returns `{point.name}`. Available
     * variables are the same as for `nodeFormatter`.
     *
     * @apioption plotOptions.dependencywheel.dataLabels.nodeFormat
     */

    /**
     * Callback to format data labels of nodes in the dependency wheel. The
     * `nodeFormat` option takes precedence over the `nodeFormatter` option.
     *
     * @apioption plotOptions.dependencywheel.dataLabels.nodeFormatter
     */

    /**
     * Size of the wheel in pixel or percent relative to the canvas space.
     *
     * @type      {number|string}
     * @default   100%
     * @apioption plotOptions.dependencywheel.size
     */

    /**
     * The center of the wheel relative to the plot area. Can be
     * percentages or pixel values. The default behaviour is to
     * center the wheel inside the plot area.
     *
     * @type    {Array<number|string|null>}
     * @default [null, null]
     * @product highcharts
     */
    center: [null, null],

    curveFactor: 0.6,

    /**
     * The start angle of the dependency wheel, in degrees where 0 is up.
     */
    startAngle: 0,

    dataLabels: {
        textPath: {
            /**
             * Enable or disable `textPath` option for link's or marker's data
             * labels.
             *
             * @type      {boolean}
             * @default   false
             * @since     7.1.0
             * @apioption plotOptions.series.dataLabels.textPath.enabled
             */
            enabled: false,

            attributes: {
                /**
                * Text path shift along its y-axis.
                *
                * @type      {Highcharts.SVGAttributes}
                * @default   5
                * @since     7.1.0
                * @apioption plotOptions.dependencywheel.dataLabels.textPath.attributes.dy
                */
                dy: 5
            }
        }
    }

};

/**
 * A `dependencywheel` series. If the [type](#series.dependencywheel.type)
 * option is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.dependencywheel
 * @exclude   dataSorting
 * @product   highcharts
 * @requires  modules/sankey
 * @requires  modules/dependency-wheel
 * @apioption series.dependencywheel
 */

/**
 * A collection of options for the individual nodes. The nodes in a dependency
 * diagram are auto-generated instances of `Highcharts.Point`, but options can
 * be applied here and linked by the `id`.
 *
 * @extends   series.sankey.nodes
 * @type      {Array<*>}
 * @product   highcharts
 * @excluding offset
 * @apioption series.dependencywheel.nodes
 */

/**
 * An array of data points for the series. For the `dependencywheel` series
 * type, points can be given in the following way:
 *
 * An array of objects with named values. The following snippet shows only a
 * few settings, see the complete options set below. If the total number of data
 * points exceeds the series' [turboThreshold](#series.area.turboThreshold),
 * this option is not available.
 *
 *  ```js
 *     data: [{
 *         from: 'Category1',
 *         to: 'Category2',
 *         weight: 2
 *     }, {
 *         from: 'Category1',
 *         to: 'Category3',
 *         weight: 5
 *     }]
 *  ```
 *
 * @type      {Array<Array<string,string,number>|*>}
 * @extends   series.sankey.data
 * @product   highcharts
 * @excluding outgoing, dataLabels
 * @apioption series.dependencywheel.data
 */

/**
 * Individual data label for each node. The options are the same as
 * the ones for [series.dependencywheel.dataLabels](#series.dependencywheel.dataLabels).
 *
 * @apioption series.dependencywheel.nodes.dataLabels
 */

''; // Keeps doclets above separate

/* *
 *
 *  Default Export
 *
 * */

export default DependencyWheelSeriesDefaults;
