/* *
 *
 *  Imports
 *
 * */

import type ColumnSeriesOptions from '../Column/ColumnSeriesOptions.js';
import type { Funnel3DPointOptions } from './Funnel3DPointOptions.js';
import type { PointShortOptions } from '../../Core/Series/PointOptions.js';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions.js';
import type DataLabelOptions from '../../Core/Series/DataLabelOptions.js';

/* *
 *
 *  Declarations
 *
 * */

/**
 * A funnel3d is a 3d version of funnel series type. Funnel charts are
 * a type of chart often used to visualize stages in a sales project,
 * where the top are the initial stages with the most clients.
 *
 * It requires that the `highcharts-3d.js`, `cylinder.js` and
 * `funnel3d.js` module are loaded.
 *
 * A `funnel3d` series. If the [type](#series.funnel3d.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @sample highcharts/demo/funnel3d/
 *         Funnel3d
 *
 * @excluding allAreas, boostThreshold, colorAxis, compare, compareBase,
 *            dataSorting, boostBlending
 *
 * @product highcharts
 *
 * @since 7.1.0
 *
 * @requires highcharts-3d
 * @requires modules/cylinder
 * @requires modules/funnel3d
 */
export interface Funnel3DSeriesOptions extends ColumnSeriesOptions {

    /** @default false */
    animation?: ColumnSeriesOptions['animation'];

    /**
     * @default ['50%', '50%']
     * @internal
     */
    center?: Array<(number|string|null)>;

    /** @default true */
    colorByPoint?: ColumnSeriesOptions['colorByPoint'];

    /**
     * An array of data points for the series. For the `funnel3d` series
     * type, points can be given in the following ways:
     *
     * 1.  An array of numerical values. In this case, the numerical values
     * will be interpreted as `y` options. The `x` values will be automatically
     * calculated, either starting at 0 and incremented by 1, or from
     *  `pointStart`
     * and `pointInterval` given in the series options. If the axis has
     * categories, these will be used. Example:
     *
     *  ```js
     *  data: [0, 5, 3, 5]
     *  ```
     *
     * 2.  An array of objects with named values. The following snippet shows
     *  only a
     * few settings, see the complete options set below. If the total number of
     *  data
     * points exceeds the series' [turboThreshold](#series.funnel3d.turboThreshold),
     * this option is not available.
     *
     *  ```js
     *     data: [{
     *         y: 2,
     *         name: "Point2",
     *         color: "#00FF00"
     *     }, {
     *         y: 4,
     *         name: "Point1",
     *         color: "#FF00FF"
     *     }]
     *  ```
     *
     * @sample {highcharts} highcharts/chart/reflow-true/
     *         Numerical values
     *
     * @sample {highcharts} highcharts/series/data-array-of-arrays/
     *         Arrays of numeric x and y
     *
     * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/
     *         Arrays of datetime x and y
     *
     * @sample {highcharts} highcharts/series/data-array-of-name-value/
     *         Arrays of point.name and y
     *
     * @sample {highcharts} highcharts/series/data-array-of-objects/
     *         Config objects
     *
     * @basic
     */
    data?: Array<(Funnel3DPointOptions|PointShortOptions)>;

    /**
     * @default {align: 'right', crop: false, inside: false, overflow: 'allow'}
     */
    dataLabels?: Partial<DataLabelOptions>;

    /**
     * The width of the outline around the top and bottom ellipses of each
     * funnel segment. Its color is set by `edgeColor` and defaults to the
     * point color.
     *
     * @default 0
     */
    edgeWidth?: number;

    /**
     * By default sides fill is set to a gradient through this option being
     * set to `true`. Set to `false` to get solid color for the sides.
     *
     * @default true
     */
    gradientForSides?: boolean;

    /**
     * The height of the series. If it is a number it defines
     * the pixel height, if it is a percentage string it is the percentage
     * of the plot area height.
     *
     * @sample highcharts/demo/funnel3d/
     *         Funnel3d
     *
     * @default '100%'
     */
    height?: (number|string);

    /**
     * Equivalent to [chart.ignoreHiddenSeries](#chart.ignoreHiddenSeries),
     * this option tells whether the series shall be redrawn as if the
     * hidden point were `null`.
     *
     * @default false
     */
    ignoreHiddenPoint?: boolean;

    /**
     * The height of the neck, the lower part of the funnel. A number
     * defines pixel width, a percentage string defines a percentage
     * of the plot area height.
     *
     * @sample highcharts/demo/funnel3d/
     *         Funnel3d
     *
     * @default '25%'
     */
    neckHeight?: (number|string);

    /**
     * The width of the neck, the lower part of the funnel. A number defines
     * pixel width, a percentage string defines a percentage of the plot
     * area width.
     *
     * @sample highcharts/demo/funnel3d/
     *         Funnel3d
     *
     * @default '30%'
     */
    neckWidth?: (number|string);

    /**
     * A reversed funnel has the widest area down. A reversed funnel with
     * no neck width and neck height is a pyramid.
     *
     * @default false
     */
    reversed?: boolean;

    /** @default false */
    showInLegend?: boolean;

    states?: SeriesStatesOptions<Funnel3DSeriesOptions>;

    /**
     * The max width of the series compared to the width of the plot area,
     * or the pixel width if it is a number.
     *
     * @sample highcharts/demo/funnel3d/
     *         Funnel3d
     *
     * @default '90%'
     */
    width?: (number|string);
}

export default Funnel3DSeriesOptions;
