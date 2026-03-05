/* *
 *
 *  Highcharts pyramid3d series module
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Kacper Madej
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

import type Funnel3DSeriesOptions from '../Funnel3D/Funnel3DSeriesOptions';
import type Pyramid3DPointOptions from './Pyramid3DPointOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

/**
 * A pyramid3d is a 3d version of pyramid series type. Pyramid charts are
 * a type of chart often used to visualize stages in a sales project,
 * where the top are the initial stages with the most clients.
 *
 * A `pyramid3d` series. If the [type](#series.pyramid3d.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @sample highcharts/demo/pyramid3d/
 *         Pyramid3d
 *
 * @sample {highcharts} highcharts/demo/pyramid3d/ Pyramid3d
 *
 * @extends plotOptions.funnel3d
 *
 * @extends series,plotOptions.pyramid3d
 *
 * @excluding neckHeight, neckWidth, dataSorting
 *
 * @excluding allAreas,boostThreshold,colorAxis,compare,compareBase,dataSorting
 *
 * @product highcharts
 *
 * @since 7.1.0
 *
 * @requires highcharts-3d
 *
 * @requires modules/cylinder
 *
 * @requires modules/funnel3d
 *
 * @requires modules/pyramid3d
 */
export interface Pyramid3DSeriesOptions extends Funnel3DSeriesOptions {

    /**
     * An array of data points for the series. For the `pyramid3d` series
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
     * points exceeds the series'
     * [turboThreshold](#series.pyramid3d.turboThreshold),
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
     * @type {Array<number|Array<number>|*>}
     *
     * @extends series.funnel3d.data
     *
     * @product highcharts
     *
     * @apioption series.pyramid3d.data
     */
    data?: Array<(number|Array<number>|Pyramid3DPointOptions)>;

    neckWidth?: number;

    neckHeight?: number;

    /**
     * A reversed pyramid3d is funnel3d, but the latter supports neck
     * related options: neckHeight and neckWidth
     *
     * @product highcharts
     */
    reversed?: boolean;

    states?: SeriesStatesOptions<Pyramid3DSeriesOptions>;

}

/* *
 *
 *  Default Export
 *
 * */

export default Pyramid3DSeriesOptions;
