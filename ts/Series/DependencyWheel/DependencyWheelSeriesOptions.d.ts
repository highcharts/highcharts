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

/* *
 *
 *  Imports
 *
 * */

import { BorderRadiusOptionsObject } from '../../Extensions/BorderRadius';
import type DependencyWheelPointOptions from './DependencyWheelPointOptions';
import type DependencyWheelSeries from './DependencyWheelSeries';
import type {
    SankeySeriesNodeOptions,
    SankeySeriesOptions
} from '../Sankey/SankeySeriesOptions';
import type DataLabelOptions from '../../Core/Series/DataLabelOptions';
import type { PointShortOptions } from '../../Core/Series/PointOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

interface DependencyWheelSeriesNodeOptions extends SankeySeriesNodeOptions {
    // Nothing to add
}

/**
 * A dependency wheel chart is a type of flow diagram, where all nodes are laid
 * out in a circle, and the flow between the are drawn as link bands.
 *
 * A `dependencywheel` series. If the [type](#series.dependencywheel.type)
 * option is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @sample highcharts/demo/dependency-wheel/
 *         Dependency wheel
 *
 * @extends plotOptions.sankey
 *
 * @extends series,plotOptions.dependencywheel
 *
 * @exclude dataSorting, nodeAlignment, nodeDistance
 *
 * @exclude dataSorting
 *
 * @since 7.1.0
 *
 * @product highcharts
 *
 * @requires modules/dependency-wheel
 *
 * @requires modules/sankey
 */
export interface DependencyWheelSeriesOptions extends SankeySeriesOptions {

    /**
     * The corner radius of the border surrounding each node. A number
     * signifies pixels. A percentage string, like for example `50%`, signifies
     * a relative size. For nodes this is relative to the node width.
     *
     * @default 3
     *
     * @since 11.0.0
     *
     * @product highcharts
     */
    borderRadius?: (number|string|BorderRadiusOptionsObject);

    /**
     * The center of the wheel relative to the plot area. Can be
     * percentages or pixel values. The default behaviour is to
     * center the wheel inside the plot area.
     *
     * @type {Array<number|string|null>}
     *
     * @default [null, null]
     *
     * @product highcharts
     */
    center?: Array<(number|string|null)>;

    curveFactor?: number;

    /**
     * An array of data points for the series. For the `dependencywheel` series
     * type, points can be given in the following way:
     *
     * An array of objects with named values. The following snippet shows only a
     * few settings, see the complete options set below. If the total number of
     *  data
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
     * @type {Array<Array<string,string,number>|*>}
     *
     * @extends series.sankey.data
     *
     * @product highcharts
     *
     * @excluding outgoing, dataLabels
     *
     * @apioption series.dependencywheel.data
     */
    data?: Array<(DependencyWheelPointOptions|PointShortOptions)>;

    dataLabels?: Partial<DataLabelOptions>;

    /**
     * Individual data label for each node. The options are the same as
     * the ones for [series.dependencywheel.dataLabels](#series.dependencywheel.dataLabels).
     *
     * @apioption series.dependencywheel.nodes.dataLabels
     */

    /**
     * Callback to format data labels of nodes in the dependency wheel. The
     * `nodeFormat` option takes precedence over the `nodeFormatter` option.
     *
     * @apioption plotOptions.dependencywheel.dataLabels.nodeFormatter
     */

    /**
     * The format string specifying what to show for nodes in the sankey
     * diagram. By default the nodeFormatter returns `{point.name}`. Available
     * variables are the same as for `nodeFormatter`.
     *
     * @apioption plotOptions.dependencywheel.dataLabels.nodeFormat
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
     * A format string for data labels of the links between nodes. Available
     * variables are the same as for `formatter`.
     *
     * @see [nodeFormat](#nodeFormat) for formatting node labels
     *
     * @apioption plotOptions.dependencywheel.dataLabels.format
     */

    /**
     * Distance between the data label and the center of the node.
     *
     * @type {number}
     *
     * @default 0
     *
     * @apioption plotOptions.dependencywheel.dataLabels.distance
     */

    /**
     * A collection of options for the individual nodes. The nodes in a
     *  dependency
     * diagram are auto-generated instances of `Highcharts.Point`, but options
     *  can
     * be applied here and linked by the `id`.
     *
     * @extends series.sankey.nodes
     *
     * @product highcharts
     *
     * @excluding offset
     *
     * @apioption series.dependencywheel.nodes
     */
    nodes?: Array<DependencyWheelSeriesNodeOptions>;

    /**
     * Size of the wheel in pixel or percent relative to the canvas space.
     *
     * @type {number|string}
     *
     * @default 100%
     *
     * @apioption plotOptions.dependencywheel.size
     */
    size?: number|string;

    /**
     * The start angle of the dependency wheel, in degrees where 0 is up.
     */
    startAngle?: number;

    states?: SeriesStatesOptions<DependencyWheelSeries>;

}

/* *
 *
 *  Default Export
 *
 * */

export default DependencyWheelSeriesOptions;
