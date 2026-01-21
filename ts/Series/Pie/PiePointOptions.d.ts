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

import type { LegendItemClickCallback } from '../../Core/Legend/LegendOptions';
import type LinePointOptions from '../Line/LinePointOptions';
import type PieDataLabelOptions from './PieDataLabelOptions';
import type { PointEventsOptions } from '../../Core/Series/PointOptions';
import type { SeriesPointOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

/**
 * @optionparent plotOptions.pie.point.events
 */
export interface PiePointEventsOptions extends PointEventsOptions {

    /**
     * Fires when the legend item belonging to the pie point (slice) is
     * clicked. The `this` keyword refers to the point itself. One
     * parameter, `event`, is passed to the function, containing common
     * event information. The default action is to toggle the visibility of
     * the point. This can be prevented by calling `event.preventDefault()`.
     *
     * **Note:** This option is deprecated in favor of
     * Highcharts.LegendItemClickEventObject.
     *
     * @deprecated 11.4.4
     *
     * @type {Highcharts.PointLegendItemClickCallbackFunction}
     *
     * @since 1.2.0
     *
     * @product highcharts highmaps
     */
    legendItemClick: LegendItemClickCallback

}

/**
 * @optionparent plotOptions.pie.data
 */
export interface PiePointOptions extends LinePointOptions {

    /**
     * @type {Highcharts.SeriesPieDataLabelsOptionsObject}
     *
     * @product highcharts highmaps
     */
    dataLabels?: (PieDataLabelOptions|Array<PieDataLabelOptions>);

    /**
     * The sequential index of the data point in the legend.
     *
     * @type {number}
     *
     * @product highcharts highmaps
     *
     * @apioption series.pie.data.legendIndex
     */

    /**
     * Whether to display a slice offset from the center.
     *
     * @sample {highcharts} highcharts/point/sliced/
     *         One sliced point
     *
     * @type {boolean}
     *
     * @product highcharts highmaps
     */
    sliced?: boolean;

    visible?: boolean;

}

/**
 * @optionparent plotOptions.pie.point
 */
export interface PieSeriesPointOptions extends SeriesPointOptions {
    events?: PiePointEventsOptions;
}

/* *
 *
 *  Default Export
 *
 * */

export default PiePointOptions;
