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

    /**
     * The `high` value for each data point, signifying the highest value
     * in the sample set. The top whisker is drawn here.
     *
     * @product highcharts
     */
    high?: number;

    /**
     * The `low` value for each data point, signifying the lowest value
     * in the sample set. The bottom whisker is drawn here.
     *
     * @product highcharts
     */
    low?: number;

    /**
     * The length of a BoxPlot point's lower whisker. Overrides BoxPlot series'
     * [lowerWhiskerLength](#boxplot.options.lowerWhiskerLength) and
     * [whiskerLength](#boxplot.options.whiskerLength), as well as
     * [lowerWhiskerLength](#boxplotPoint.options.whiskerLength)
     *
     * @sample {highcharts} highcharts/series-boxplot/whisker-length
     *         Configuring whisker lengths
     *
     * @product highcharts
     */
    lowerWhiskerLength?: (number|string);

    /**
     * The median for each data point. This is drawn as a line through the
     * middle area of the box.
     *
     * @product highcharts
     */
    median?: number;

    /**
     * The lower quartile for each data point. This is the bottom of the
     * box.
     *
     * @product highcharts
     */
    q1?: number;

    /**
     * The higher quartile for each data point. This is the top of the box.
     *
     * @product highcharts
     */
    q3?: number;

    /**
     * The length of a BoxPlot point's upper whisker. Overrides BoxPlot series'
     * [upperWhiskerLength](#boxplot.options.upperWhiskerLength) and
     * [whiskerLength](#boxplot.options.whiskerLength), as well as
     * [upperWhiskerLength](#boxplotPoint.options.whiskerLength)
     *
     * @sample {highcharts} highcharts/series-boxplot/whisker-length
     *         Configuring whisker length
     *
     * @product highcharts
     */
    upperWhiskerLength?: (number|string);

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
    whiskerLength?: (number|string);
}

/* *
 *
 *  Default Export
 *
 * */

export default BoxPlotPointOptions;
