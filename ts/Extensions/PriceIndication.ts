/**
 * (c) 2018-2026 Highsoft AS
 * Author: Sebastian Bochan
 *
 * Price indicator for Highcharts Stock
 *
 * A commercial license may be required depending on use.
 * See www.highcharts.com/license
 *
 */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type { AxisCrosshairOptions } from '../Core/Axis/AxisOptions';
import type Series from '../Core/Series/Series';
import type SVGElement from '../Core/Renderer/SVG/SVGElement';

import H from '../Core/Globals.js';
const { composed } = H;
import { addEvent, merge, pushUnique } from '../Shared/Utilities.js';

/* *
 *
 *  Declarations
 *
 * */

/** @internal */
declare module '../Core/Series/SeriesBase' {
    interface SeriesBase {
        lastPrice?: SVGElement;
        lastPriceLabel?: SVGElement;
        lastVisiblePrice?: SVGElement;
        lastVisiblePriceLabel?: SVGElement;
    }
}

declare module '../Core/Series/SeriesOptions' {
    interface SeriesOptions {
        /**
         * The line marks the last price from all points.
         *
         * @sample {highstock} stock/indicators/last-price
         *         Last price
         *
         * @since     7.0.0
         * @product   highstock
         * @requires  modules/price-indicator
         */
        lastPrice?: LastPriceOptions;

        /**
         * The line marks the last price from visible range of points.
         *
         * @sample {highstock} stock/indicators/last-visible-price
         *         Last visible price
         *
         * @since     7.0.0
         * @product   highstock
         * @requires  modules/price-indicator
         */
        lastVisiblePrice?: LastVisiblePriceOptions;
    }
}

export interface LastPriceOptions extends AxisCrosshairOptions {
    /**
     * The color of the line of last price.
     * If not set, the line has the same color as the series.
     *
     * @default undefined
     */
    color?: AxisCrosshairOptions['color'];

    /**
     * Enable or disable the indicator.
     *
     * @default false
     */
    enabled?: boolean;
}

export interface LastVisiblePriceOptions extends LastPriceOptions {
    /**
     * The color of the line of last visible price.
     * By default, the line is not visible.
     *
     * @default 'transparent'
     */
    color?: LastPriceOptions['color'];
}

/* *
 *
 *  Composition
 *
 * */

/**
 * Extends series class with price indication.
 * @internal
 */
export function composePriceIndication(
    SeriesClass: typeof Series
): void {
    if (pushUnique(composed, 'PriceIndication')) {
        addEvent(SeriesClass, 'afterRender', onSeriesAfterRender);
        addEvent(SeriesClass, 'hide', onSeriesHide);
    }
}

/**
 * Hides price indication when parent series is hidden. Showing the indicator is
 * handled by the `onSeriesAfterRender` function.
 *
 * @internal
 */
function onSeriesHide(
    this: Series
): void {
    const series = this;
    ([
        'lastPrice',
        'lastPriceLabel',
        'lastVisiblePrice',
        'lastVisiblePriceLabel'
    ] as const).forEach((key): void => {
        series[key]?.hide();
    });
}

/**
 * Sets up price indication after series is rendered.
 * @internal
 */
function onSeriesAfterRender(
    this: Series
): void {
    const series = this,
        seriesOptions = series.options,
        lastVisiblePrice = seriesOptions.lastVisiblePrice,
        lastPrice = seriesOptions.lastPrice;

    if (
        (lastVisiblePrice || lastPrice) &&
        seriesOptions.id !== 'highcharts-navigator-series' &&
        series.visible
    ) {
        const { points, xAxis, yAxis } = series,
            { cross, crosshair, crossLabel } = yAxis,
            pLength = points.length,
            dataLength = series.dataTable.rowCount,
            x = series.getColumn('x')[dataLength - 1],
            y = series.getColumn('y')[dataLength - 1] ??
                series.getColumn('close')[dataLength - 1];

        if (lastPrice?.enabled) {
            yAxis.crosshair = yAxis.options.crosshair = seriesOptions.lastPrice;

            if (
                !series.chart.styledMode &&
                yAxis.crosshair &&
                yAxis.options.crosshair &&
                seriesOptions.lastPrice
            ) {
                // Set the default color from the series, #14888.
                yAxis.crosshair.color = yAxis.options.crosshair.color =
                    seriesOptions.lastPrice.color || series.color;
            }

            yAxis.cross = series.lastPrice;

            if (series.lastPriceLabel) {
                series.lastPriceLabel.destroy();
            }

            delete yAxis.crossLabel;

            yAxis.drawCrosshair(void 0, ({
                x: x,
                y,
                plotX: xAxis.toPixels(x, true),
                plotY: yAxis.toPixels(y, true)
            }) as any);

            // Save price
            if (series.yAxis.cross) {
                series.lastPrice = series.yAxis.cross;
                series.lastPrice.addClass(
                    'highcharts-color-' + series.colorIndex
                ); // #15222
                series.lastPrice.y = y;
            }

            series.lastPriceLabel = yAxis.crossLabel;
        }

        if (lastVisiblePrice?.enabled && pLength > 0) {
            yAxis.crosshair = yAxis.options.crosshair = merge({
                color: 'transparent' // Line invisible by default
            }, seriesOptions.lastVisiblePrice);

            yAxis.cross = series.lastVisiblePrice;

            const lastPoint = points[pLength - 1].isInside ?
                points[pLength - 1] :
                points[pLength - 2];

            series.lastVisiblePriceLabel?.destroy();

            // Set to undefined to avoid collision with
            // the yAxis crosshair #11480
            // Delete the crossLabel each time the code is invoked, #13876.
            delete yAxis.crossLabel;

            // Save price
            yAxis.drawCrosshair(void 0, lastPoint);

            if (yAxis.cross) {
                series.lastVisiblePrice = yAxis.cross;
                if (lastPoint && typeof lastPoint.y === 'number') {
                    series.lastVisiblePrice.y = lastPoint.y;
                }
            }

            series.lastVisiblePriceLabel = yAxis.crossLabel;
        }

        // Restore crosshair:
        yAxis.crosshair = yAxis.options.crosshair = crosshair;
        yAxis.cross = cross;
        yAxis.crossLabel = crossLabel;
    }
}

/* *
 *
 *  API Options
 *
 * */

/**
 * The line marks the last price from visible range of points.
 *
 * @sample {highstock} stock/indicators/last-visible-price
 *         Last visible price
 *
 * @declare   Highcharts.SeriesLastVisiblePriceOptionsObject
 * @product   highstock
 * @requires  modules/price-indicator
 * @apioption plotOptions.series.lastVisiblePrice
 */

/**
 * The color of the line of last visible price.
 * By default, color is not applied and the line is not visible.
 *
 * @type      {string}
 * @product   highstock
 * @apioption plotOptions.series.lastVisiblePrice.color
 *
 */

/**
 * Name of the dash style to use for the line of last visible price.
 *
 * @sample {highstock} highcharts/plotoptions/series-dashstyle-all/
 *         Possible values demonstrated
 *
 * @type      {Highcharts.DashStyleValue}
 * @product   highstock
 * @default   Solid
 * @apioption plotOptions.series.lastVisiblePrice.dashStyle
 *
 */

/**
 * Width of the last visible price line.
 *
 * @type      {number}
 * @product   highstock
 * @default   1
 * @apioption plotOptions.series.lastVisiblePrice.width
 *
 */

/**
 * Enable or disable the indicator.
 *
 * @type      {boolean}
 * @product   highstock
 * @default   false
 * @apioption plotOptions.series.lastVisiblePrice.enabled
 */

/**
 * @declare   Highcharts.SeriesLastVisiblePriceLabelOptionsObject
 * @extends   yAxis.crosshair.label
 * @since     7.0.0
 * @apioption plotOptions.series.lastVisiblePrice.label
 */

/**
 * @since     7.0.0
 * @apioption plotOptions.series.lastVisiblePrice.label.align
 */

/**
 * @since     7.0.0
 * @apioption plotOptions.series.lastVisiblePrice.label.backgroundColor
 */

/**
 * The border color for the `lastVisiblePrice` label.
 *
 * @type      {Highcharts.ColorType}
 * @since     7.0.0
 * @product   highstock
 * @apioption plotOptions.series.lastVisiblePrice.label.borderColor
 */

/**
 * The border corner radius of the `lastVisiblePrice` label.
 *
 * @type      {number}
 * @default   3
 * @since     7.0.0
 * @product   highstock
 * @apioption plotOptions.series.lastVisiblePrice.label.borderRadius
*/

/**
 * Flag to enable `lastVisiblePrice` label.
 *
 *
 * @type      {boolean}
 * @default   false
 * @since     7.0
 * @product   highstock
 * @apioption plotOptions.series.lastVisiblePrice.label.enabled
 */

/**
 * A format string for the `lastVisiblePrice` label. Defaults to `{value}` for
 * numeric axes and `{value:%b %d, %Y}` for datetime axes.
 *
 * @type      {string}
 * @since     7.0
 * @product   highstock
 * @apioption plotOptions.series.lastVisiblePrice.label.format
*/

/**
 * @since     7.0.0
 * @apioption plotOptions.series.lastVisiblePrice.label.formatter
 */

/**
 * @since     7.0.0
 * @apioption plotOptions.series.lastVisiblePrice.label.padding
 */

/**
 * @since     7.0.0
 * @apioption plotOptions.series.lastVisiblePrice.label.shape
 */

/**
 * Text styles for the `lastVisiblePrice` label.
 *
 * @type      {Highcharts.CSSObject}
 * @default   {"color": "white", "fontWeight": "normal", "fontSize": "11px", "textAlign": "center"}
 * @since     7.0
 * @product   highstock
 * @apioption plotOptions.series.lastVisiblePrice.label.style
 */

/**
 * The border width for the `lastVisiblePrice` label.
 *
 * @type      {number}
 * @default   0
 * @since     7.0
 * @product   highstock
 * @apioption plotOptions.series.lastVisiblePrice.label.borderWidth
*/

/**
 * Padding inside the `lastVisiblePrice` label.
 *
 * @type      {number}
 * @default   8
 * @since     7.0
 * @product   highstock
 * @apioption plotOptions.series.lastVisiblePrice.label.padding
 */

/**
 * The line marks the last price from all points.
 *
 * @sample {highstock} stock/indicators/last-price
 *         Last price
 *
 * @declare   Highcharts.SeriesLastPriceOptionsObject
 * @product   highstock
 * @requires  modules/price-indicator
 * @apioption plotOptions.series.lastPrice
 */

/**
 * Enable or disable the indicator.
 *
 * @type      {boolean}
 * @product   highstock
 * @default   false
 * @apioption plotOptions.series.lastPrice.enabled
 */

/**
 * @declare   Highcharts.SeriesLastPriceLabelOptionsObject
 * @extends   yAxis.crosshair.label
 * @since     7.0.0
 * @apioption plotOptions.series.lastPrice.label
 */

/**
 * @since     7.0.0
 * @apioption plotOptions.series.lastPrice.label.align
 * */

/**
 * @since     7.0.0
 * @apioption plotOptions.series.lastPrice.label.backgroundColor
 * */

/**
 * The border color of `lastPrice` label.
 * @since     7.0.0
 * @apioption plotOptions.series.lastPrice.label.borderColor
 * */

/**
 * The border radius of `lastPrice` label.
 * @since     7.0.0
 * @apioption plotOptions.series.lastPrice.label.borderRadius
 * */

/**
 * The border width of `lastPrice` label.
 * @since     7.0.0
 * @apioption plotOptions.series.lastPrice.label.borderWidth
 * */

/**
 * Flag to enable `lastPrice` label.
 * @since     7.0.0
 * @apioption plotOptions.series.lastPrice.label.enabled
 * */

/**
 * A format string for the `lastPrice` label. Defaults to `{value}` for
 * numeric axes and `{value:%b %d, %Y}` for datetime axes.
 *
 * @type      {string}
 * @since     7.0
 * @product   highstock
 * @apioption plotOptions.series.lastPrice.label.format
*/

/**
 * @since     7.0.0
 * @apioption plotOptions.series.lastPrice.label.formatter
 */

/**
 * @since     7.0.0
 * @apioption plotOptions.series.lastPrice.label.padding
 */

/**
 * @since     7.0.0
 * @apioption plotOptions.series.lastPrice.label.shape
 */

/**
 * Text styles for the `lastPrice` label.
 *
 * @type      {Highcharts.CSSObject}
 * @default   {"color": "white", "fontWeight": "normal", "fontSize": "11px", "textAlign": "center"}
 * @since     7.0
 * @product   highstock
 * @apioption plotOptions.series.lastPrice.label.style
 */

/**
 * The border width for the `lastPrice` label.
 *
 * @type      {number}
 * @default   0
 * @since     7.0
 * @product   highstock
 * @apioption plotOptions.series.lastPrice.label.borderWidth
*/

/**
 * Padding inside the `lastPrice` label.
 *
 * @type      {number}
 * @default   8
 * @since     7.0
 * @product   highstock
 * @apioption plotOptions.series.lastPrice.label.padding
 */

/**
 * The color of the line of last price.
 * By default, the line has the same color as the series.
 *
 * @type      {string}
 * @product   highstock
 * @apioption plotOptions.series.lastPrice.color
 *
 */

/**
 * Name of the dash style to use for the line of last price.
 *
 * @sample {highstock} highcharts/plotoptions/series-dashstyle-all/
 *         Possible values demonstrated
 *
 * @type      {Highcharts.DashStyleValue}
 * @product   highstock
 * @default   Solid
 * @apioption plotOptions.series.lastPrice.dashStyle
 *
 */

/**
 * Width of the last price line.
 *
 * @type      {number}
 * @product   highstock
 * @default   1
 * @apioption plotOptions.series.lastPrice.width
 *
 */

''; // Keeps doclets above in JS file
