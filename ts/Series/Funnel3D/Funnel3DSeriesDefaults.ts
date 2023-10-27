/* *
 *
 *  Imports
 *
 * */

import type Funnel3DSeriesOptions from './Funnel3DSeriesOptions';

/* *
 *
 *  API Options
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
 * @sample highcharts/demo/funnel3d/
 *         Funnel3d
 *
 * @extends      plotOptions.column
 * @excluding    allAreas, boostThreshold, colorAxis, compare, compareBase,
 *               dataSorting, boostBlending
 * @product      highcharts
 * @since        7.1.0
 * @requires     highcharts-3d
 * @requires     modules/cylinder
 * @requires     modules/funnel3d
 * @optionparent plotOptions.funnel3d
 */
const Funnel3DSeriesDefaults: Funnel3DSeriesOptions = {

    /** @ignore-option */
    center: ['50%', '50%'],

    /**
     * The max width of the series compared to the width of the plot area,
     * or the pixel width if it is a number.
     *
     * @type    {number|string}
     * @sample  {highcharts} highcharts/demo/funnel3d/ Funnel3d demo
     * @product highcharts
     */
    width: '90%',

    /**
     * The width of the neck, the lower part of the funnel. A number defines
     * pixel width, a percentage string defines a percentage of the plot
     * area width.
     *
     * @type    {number|string}
     * @sample  {highcharts} highcharts/demo/funnel3d/ Funnel3d demo
     * @product highcharts
     */
    neckWidth: '30%',

    /**
     * The height of the series. If it is a number it defines
     * the pixel height, if it is a percentage string it is the percentage
     * of the plot area height.
     *
     * @type    {number|string}
     * @sample  {highcharts} highcharts/demo/funnel3d/ Funnel3d demo
     * @product highcharts
     */
    height: '100%',

    /**
     * The height of the neck, the lower part of the funnel. A number
     * defines pixel width, a percentage string defines a percentage
     * of the plot area height.
     *
     * @type    {number|string}
     * @sample  {highcharts} highcharts/demo/funnel3d/ Funnel3d demo
     * @product highcharts
     */
    neckHeight: '25%',

    /**
     * A reversed funnel has the widest area down. A reversed funnel with
     * no neck width and neck height is a pyramid.
     *
     * @product highcharts
     */
    reversed: false,

    /**
     * By deafult sides fill is set to a gradient through this option being
     * set to `true`. Set to `false` to get solid color for the sides.
     *
     * @product highcharts
     */
    gradientForSides: true,

    animation: false,

    edgeWidth: 0,

    colorByPoint: true,

    showInLegend: false,

    dataLabels: {

        align: 'right',

        crop: false,

        inside: false,

        overflow: 'allow'

    }

};

/**
 * A `funnel3d` series. If the [type](#series.funnel3d.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @sample {highcharts} highcharts/demo/funnel3d/
 *         Funnel3d demo
 *
 * @since     7.1.0
 * @extends   series,plotOptions.funnel3d
 * @excluding allAreas,boostThreshold,colorAxis,compare,compareBase
 * @product   highcharts
 * @requires  highcharts-3d
 * @requires  modules/cylinder
 * @requires  modules/funnel3d
 * @apioption series.funnel3d
 */

/**
 * An array of data points for the series. For the `funnel3d` series
 * type, points can be given in the following ways:
 *
 * 1.  An array of numerical values. In this case, the numerical values
 * will be interpreted as `y` options. The `x` values will be automatically
 * calculated, either starting at 0 and incremented by 1, or from `pointStart`
 * and `pointInterval` given in the series options. If the axis has
 * categories, these will be used. Example:
 *
 *  ```js
 *  data: [0, 5, 3, 5]
 *  ```
 *
 * 2.  An array of objects with named values. The following snippet shows only a
 * few settings, see the complete options set below. If the total number of data
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
 * @sample {highcharts} highcharts/series/data-array-of-arrays/
 *         Arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/
 *         Arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/
 *         Arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/
 *         Config objects
 *
 * @type      {Array<number|Array<number>|*>}
 * @extends   series.column.data
 * @product   highcharts
 * @apioption series.funnel3d.data
 */


/**
 * By deafult sides fill is set to a gradient through this option being
 * set to `true`. Set to `false` to get solid color for the sides.
 *
 * @type      {boolean}
 * @product   highcharts
 * @apioption series.funnel3d.data.gradientForSides
 */

''; // detachs doclets above

/* *
 *
 *  Default Export
 *
 * */

export default Funnel3DSeriesDefaults;
