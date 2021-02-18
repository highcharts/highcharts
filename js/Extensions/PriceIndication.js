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
import Series from '../Core/Series/Series.js';
import U from '../Core/Utilities.js';
var addEvent = U.addEvent, isArray = U.isArray, merge = U.merge;
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
 * @default   true
 * @apioption plotOptions.series.lastVisiblePrice.enabled
 */
/**
 * @declare   Highcharts.SeriesLastVisiblePriceLabelOptionsObject
 * @apioption plotOptions.series.lastVisiblePrice.label
 */
/**
 * Enable or disable the label.
 *
 * @type      {boolean}
 * @product   highstock
 * @default   true
 * @apioption plotOptions.series.lastVisiblePrice.label.enabled
 *
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
 * @default   true
 * @apioption plotOptions.series.lastPrice.enabled
 */
/**
 * The color of the line of last price.
 *
 * @type      {string}
 * @product   highstock
 * @default   red
 * @apioption plotOptions.series.lastPrice.color
 *
 */
/* eslint-disable no-invalid-this */
addEvent(Series, 'afterRender', function () {
    var series = this, seriesOptions = series.options, pointRange = seriesOptions.pointRange, lastVisiblePrice = seriesOptions.lastVisiblePrice, lastPrice = seriesOptions.lastPrice;
    if ((lastVisiblePrice || lastPrice) &&
        seriesOptions.id !== 'highcharts-navigator-series') {
        var xAxis = series.xAxis, yAxis = series.yAxis, origOptions = yAxis.crosshair, origGraphic = yAxis.cross, origLabel = yAxis.crossLabel, points = series.points, yLength = series.yData.length, pLength = points.length, x = series.xData[series.xData.length - 1], y = series.yData[yLength - 1], lastPoint, yValue, crop;
        if (lastPrice && lastPrice.enabled) {
            yAxis.crosshair = yAxis.options.crosshair = seriesOptions.lastPrice;
            yAxis.cross = series.lastPrice;
            yValue = isArray(y) ? y[3] : y;
            yAxis.drawCrosshair(null, ({
                x: x,
                y: yValue,
                plotX: xAxis.toPixels(x, true),
                plotY: yAxis.toPixels(yValue, true)
            }));
            // Save price
            if (series.yAxis.cross) {
                series.lastPrice = series.yAxis.cross;
                series.lastPrice.y = yValue;
            }
        }
        if (lastVisiblePrice &&
            lastVisiblePrice.enabled &&
            pLength > 0) {
            crop = (points[pLength - 1].x === x) || pointRange === null ? 1 : 2;
            yAxis.crosshair = yAxis.options.crosshair = merge({
                color: 'transparent'
            }, seriesOptions.lastVisiblePrice);
            yAxis.cross = series.lastVisiblePrice;
            lastPoint = points[pLength - crop];
            if (series.crossLabel) {
                series.crossLabel.destroy();
            }
            // Set to undefined to avoid collision with
            // the yAxis crosshair #11480
            // Delete the crossLabel each time the code is invoked, #13876.
            delete yAxis.crossLabel;
            // Save price
            yAxis.drawCrosshair(null, lastPoint);
            if (yAxis.cross) {
                series.lastVisiblePrice = yAxis.cross;
                if (typeof lastPoint.y === 'number') {
                    series.lastVisiblePrice.y = lastPoint.y;
                }
            }
            series.crossLabel = yAxis.crossLabel;
        }
        // Restore crosshair:
        yAxis.crosshair = yAxis.options.crosshair = origOptions;
        yAxis.cross = origGraphic;
        yAxis.crossLabel = origLabel;
    }
});
