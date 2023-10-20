/**
 * (c) 2009-2021 Sebastian Bochann
 *
 * Price indicator for Highcharts
 *
 * License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type { AxisCrosshairOptions } from '../Core/Axis/AxisOptions';
import type ColorType from '../Core/Color/ColorType';
import type Series from '../Core/Series/Series';
import type SVGElement from '../Core/Renderer/SVG/SVGElement';

import U from '../Core/Utilities.js';
const {
    addEvent,
    isArray,
    merge,
    pushUnique
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../Core/Series/SeriesLike' {
    interface SeriesLike {
        lastPrice?: SVGElement;
        lastPriceLabel?: SVGElement;
        lastVisiblePrice?: SVGElement;
        lastVisiblePriceLabel?: SVGElement;
    }
}

declare module '../Core/Series/SeriesOptions' {
    interface SeriesOptions {
        lastPrice?: LastPriceOptions;
        lastVisiblePrice?: LastVisiblePriceOptions;
    }
}

export interface LastPriceOptions extends AxisCrosshairOptions {
    enabled?: boolean;
}

export interface LastVisiblePriceOptions {
    enabled?: boolean;
    label?: LastVisiblePriceLabelOptions;
}

export interface LastVisiblePriceLabelOptions {
    enabled: true;
    color?: ColorType;
}

/* *
 *
 *  Constants
 *
 * */

const composedMembers: Array<unknown> = [];

/* *
 *
 *  Composition
 *
 * */

/** @private */
function compose(
    SeriesClass: typeof Series
): void {

    if (pushUnique(composedMembers, SeriesClass)) {
        addEvent(SeriesClass, 'afterRender', onSeriesAfterRender);
    }
}

/** @private */
function onSeriesAfterRender(
    this: Series
): void {
    const series = this,
        seriesOptions = series.options,
        lastVisiblePrice = seriesOptions.lastVisiblePrice,
        lastPrice = seriesOptions.lastPrice;

    if (
        (lastVisiblePrice || lastPrice) &&
         seriesOptions.id !== 'highcharts-navigator-series'
    ) {
        const xAxis = series.xAxis,
            yAxis = series.yAxis,
            origOptions = yAxis.crosshair,
            origGraphic = yAxis.cross,
            origLabel = yAxis.crossLabel,
            points = series.points,
            yLength = (series.yData as any).length,
            pLength = points.length,
            x = (series.xData as any)[(series.xData as any).length - 1],
            y = (series.yData as any)[yLength - 1];

        let yValue;

        if (lastPrice && lastPrice.enabled) {
            yAxis.crosshair = yAxis.options.crosshair = seriesOptions.lastPrice;

            if (!series.chart.styledMode &&
                    yAxis.crosshair &&
                    yAxis.options.crosshair &&
                    seriesOptions.lastPrice
            ) {
                // Set the default color from the series, #14888.
                yAxis.crosshair.color = yAxis.options.crosshair.color =
                    seriesOptions.lastPrice.color || series.color;
            }

            yAxis.cross = series.lastPrice;
            yValue = isArray(y) ? y[3] : y;

            if (series.lastPriceLabel) {
                series.lastPriceLabel.destroy();
            }

            delete yAxis.crossLabel;

            yAxis.drawCrosshair((null as any), ({
                x: x,
                y: yValue,
                plotX: xAxis.toPixels(x, true),
                plotY: yAxis.toPixels(yValue, true)
            }) as any);

            // Save price
            if (series.yAxis.cross) {
                series.lastPrice = series.yAxis.cross;
                series.lastPrice.addClass(
                    'highcharts-color-' + series.colorIndex
                ); // #15222
                series.lastPrice.y = yValue;
            }

            series.lastPriceLabel = yAxis.crossLabel;
        }

        if (lastVisiblePrice && lastVisiblePrice.enabled && pLength > 0) {
            yAxis.crosshair = yAxis.options.crosshair = merge({
                color: 'transparent' // line invisible by default
            }, seriesOptions.lastVisiblePrice);

            yAxis.cross = series.lastVisiblePrice;
            const lastPoint = points[pLength - 1].isInside ?
                points[pLength - 1] : points[pLength - 2];

            if (series.lastVisiblePriceLabel) {
                series.lastVisiblePriceLabel.destroy();
            }
            // Set to undefined to avoid collision with
            // the yAxis crosshair #11480
            // Delete the crossLabel each time the code is invoked, #13876.
            delete yAxis.crossLabel;

            // Save price
            yAxis.drawCrosshair((null as any), lastPoint);

            if (yAxis.cross) {
                series.lastVisiblePrice = yAxis.cross;
                if (lastPoint && typeof lastPoint.y === 'number') {
                    series.lastVisiblePrice.y = lastPoint.y;
                }
            }

            series.lastVisiblePriceLabel = yAxis.crossLabel;
        }

        // Restore crosshair:
        yAxis.crosshair = yAxis.options.crosshair = origOptions;
        yAxis.cross = origGraphic;
        yAxis.crossLabel = origLabel;
    }
}

/* *
 *
 *  Default Export
 *
 * */

const PriceIndication = {
    compose
};

export default PriceIndication;

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

''; // keeps doclets above in JS file
