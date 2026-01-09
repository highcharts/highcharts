/* *
 *
 *  Highcharts funnel module
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type FunnelDataLabelOptions from './FunnelDataLabelOptions';
import type FunnelPointOptions from './FunnelPointOptions';
import type PieSeriesOptions from '../Pie/PieSeriesOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Funnel charts are a type of chart often used to visualize stages in a
 * sales project, where the top are the initial stages with the most
 * clients. It requires that the modules/funnel.js file is loaded.
 *
 * A `funnel` series. If the [type](#series.funnel.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @sample highcharts/demo/funnel/
 *         Funnel demo
 *
 * @extends plotOptions.pie
 *
 * @extends series,plotOptions.funnel
 *
 * @excluding innerSize,size,dataSorting
 *
 * @excluding dataParser, dataURL, stack, xAxis, yAxis, dataSorting,
 *            boostBlending, boostThreshold
 *
 * @product highcharts
 *
 * @requires modules/funnel
 */
export interface FunnelSeriesOptions extends PieSeriesOptions {

    /**
     * Initial animation is by default disabled for the funnel chart.
     */
    animation?: boolean;

    /**
     * The corner radius of the border surrounding all points or series. A
     * number signifies pixels. A percentage string, like for example `50%`,
     * signifies a size relative to the series width.
     *
     * @sample highcharts/plotoptions/funnel-border-radius
     *         Funnel and pyramid with rounded border
     */
    borderRadius?: number;

    /**
     * The center of the series. By default, it is centered in the middle
     * of the plot area, so it fills the plot area height.
     *
     * @default ["50%", "50%"]
     *
     * @since 3.0
     */
    center?: [(number|string|null), (number|string|null)];

    /**
     * An array of data points for the series. For the `funnel` series type,
     * points can be given in the following ways:
     *
     * 1.  An array of numerical values. In this case, the numerical values
     * will be interpreted as `y` options. Example:
     *
     *  ```js
     *  data: [0, 5, 3, 5]
     *  ```
     *
     * 2.  An array of objects with named values. The following snippet shows
     *  only a
     * few settings, see the complete options set below. If the total number of
     *  data
     * points exceeds the series' [turboThreshold](#series.funnel.turboThreshold),
     * this option is not available.
     *
     *  ```js
     *     data: [{
     *         y: 3,
     *         name: "Point2",
     *         color: "#00FF00"
     *     }, {
     *         y: 1,
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
     * @type {Array<number|null|*>}
     *
     * @extends series.pie.data
     *
     * @excluding sliced
     *
     * @product highcharts
     */
    data?: Array<(number|null|FunnelPointOptions)>;

    dataLabels?: FunnelDataLabelOptions;

    /**
     * The height of the funnel or pyramid. If it is a number it defines
     * the pixel height, if it is a percentage string it is the percentage
     * of the plot area height.
     *
     * @sample {highcharts} highcharts/demo/funnel/
     *         Funnel demo
     *
     * @since 3.0
     */
    height?: (number|string);

    /**
     * The height of the neck, the lower part of the funnel. A number
     * defines pixel width, a percentage string defines a percentage of the
     * plot area height.
     */
    neckHeight?: (number|string);

    /**
     * The width of the neck, the lower part of the funnel. A number defines
     * pixel width, a percentage string defines a percentage of the plot
     * area width.
     *
     * @sample {highcharts} highcharts/demo/funnel/
     *         Funnel demo
     *
     * @since 3.0
     */
    neckWidth?: (number|string);

    /**
     * A reversed funnel has the widest area down. A reversed funnel with
     * no neck width and neck height is a pyramid.
     *
     * @since 3.0.10
     */
    reversed?: boolean;

    /**
     * To avoid adapting the data label size in Pie.drawDataLabels.
     *
     * @ignore-option
     */
    size?: undefined;

    /**
     * Options for the series states.
     */
    states?: SeriesStatesOptions<FunnelSeriesOptions>;

    /**
     * @excluding halo, marker, lineWidth, lineWidthPlus
     *
     * @apioption plotOptions.funnel.states.hover
     */

    /**
     * Options for a selected funnel item.
     *
     * @excluding halo, marker, lineWidth, lineWidthPlus
     *
     * @apioption series.funnel.states.select
     */

    /**
     * The width of the funnel compared to the width of the plot area,
     * or the pixel width if it is a number.
     *
     * @since 3.0
     */
    width?: (number|string);

}

/* *
 *
 *  Default Export
 *
 * */

export default FunnelSeriesOptions;
