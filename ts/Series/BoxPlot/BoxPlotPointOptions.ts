/* *
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

import type BoxPlotPoint from './BoxPlotPoint';
import type ColumnPointOptions from '../Column/ColumnPointOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface BoxPlotPointOptions extends ColumnPointOptions {

    /**
     * The dash style of the box.
     *
     * @sample {highcharts} highcharts/plotoptions/box-plot-styling/
     *         Box plot styling
     *
     * @sample {highcharts} highcharts/css/boxplot/
     *         Box plot in styled mode
     *
     * @default Solid
     *
     * @since 8.1.0
     *
     * @product highcharts
     */
    boxDashStyle?: BoxPlotPoint['boxDashStyle'];

    /**
     * The `high` value for each data point, signifying the highest value
     * in the sample set. The top whisker is drawn here.
     *
     * @product highcharts
     */
    high?: BoxPlotPoint['high'];

    /**
     * The `low` value for each data point, signifying the lowest value
     * in the sample set. The bottom whisker is drawn here.
     *
     * @product highcharts
     */
    low?: BoxPlotPoint['low'];

    /**
     * The length of a BoxPlot point's lower whisker. Overrides BoxPlot series'
     * [lowerWhiskerLength](#boxplot.options.lowerWhiskerLength) and
     * [whiskerLength](#boxplot.options.whiskerLength), as well as
     * [lowerWhiskerLength](#boxplot.point.lowerWhiskerLength)
     *
     * @sample {highcharts} highcharts/series-boxplot/whisker-length
     *         Configuring whisker lengths
     *
     * @product highcharts
     */
    lowerWhiskerLength?: BoxPlotPoint['lowerWhiskerLength'];

    /**
     * The median for each data point. This is drawn as a line through the
     * middle area of the box.
     *
     * @product highcharts
     */
    median?: BoxPlotPoint['median'];

    /**
     * The dash style of the median.
     *
     * @sample {highcharts} highcharts/plotoptions/box-plot-styling/
     *         Box plot styling
     *
     * @sample {highcharts} highcharts/css/boxplot/
     *         Box plot in styled mode
     *
     * @default Solid
     *
     * @since 8.1.0
     *
     * @product highcharts
     */
    medianDashStyle?: BoxPlotPoint['medianDashStyle'];

    /**
     * The lower quartile for each data point. This is the bottom of the
     * box.
     *
     * @product highcharts
     */
    q1?: BoxPlotPoint['q1'];

    /**
     * The higher quartile for each data point. This is the top of the box.
     *
     * @product highcharts
     */
    q3?: BoxPlotPoint['q3'];

    /**
     * The dash style of the stem.
     *
     * @sample {highcharts} highcharts/plotoptions/box-plot-styling/
     *         Box plot styling
     *
     * @sample {highcharts} highcharts/css/boxplot/
     *         Box plot in styled mode
     *
     * @default Solid
     *
     * @since 8.1.0
     *
     * @product highcharts
     */
    stemDashStyle?: BoxPlotPoint['stemDashStyle'];

    /**
     * The length of a BoxPlot point's upper whisker. Overrides BoxPlot series'
     * [upperWhiskerLength](#boxplot.options.upperWhiskerLength) and
     * [whiskerLength](#boxplot.options.whiskerLength), as well as
     * [upperWhiskerLength](#boxplot.point.upperWhiskerLength)
     *
     * @sample {highcharts} highcharts/series-boxplot/whisker-length
     *         Configuring whisker length
     *
     * @product highcharts
     */
    upperWhiskerLength?: BoxPlotPoint['upperWhiskerLength'];

    /**
     * The dash style of the whiskers.
     *
     * @sample {highcharts} highcharts/plotoptions/box-plot-styling/
     *         Box plot styling
     *
     * @sample {highcharts} highcharts/css/boxplot/
     *         Box plot in styled mode
     *
     * @default Solid
     *
     * @since 8.1.0
     *
     * @product highcharts
     */
    whiskerDashStyle?: BoxPlotPoint['whiskerDashStyle'];

    /**
     * The length of the whiskers, the horizontal lines marking low and
     * high values. It can be a numerical pixel value, or a percentage
     * value of the box width. Set `0` to disable whiskers.
     *
     * Individual lengths for upper and lower whiskers can be defined on the
     * boxplot series and on specific boxplot points. Whisker lengths defined
     * on points override whisker lengths defined on a boxplot series.
     *
     * Overrides [whiskerLength](#boxplot.options.whiskerLength).
     *
     * @sample {highcharts} highcharts/series-boxplot/whisker-length
     *         Configuring whisker lengths
     *
     * @since 3.0
     *
     * @product highcharts
     */
    whiskerLength?: BoxPlotPoint['whiskerLength'];
}

/* *
 *
 *  Default Export
 *
 * */

export default BoxPlotPointOptions;
