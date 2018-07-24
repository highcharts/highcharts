/**
 * (c) 2009-2018 Sebastian Bochann
 *
 * Price indicator for Highcharts
 *
 * License: www.highcharts.com/license
 */

'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
var addEvent = H.addEvent,
    merge = H.merge,
    isArray = H.isArray;

addEvent(H.Series, 'afterRender', function () {
    var serie = this,
        seriesOptions = serie.options,
        priceIndicator = seriesOptions.priceIndicator,
        showPrice = seriesOptions.showPrice;

    if ((showPrice || priceIndicator) &&
            seriesOptions.id !== 'highcharts-navigator-series') {

        var xAxis = serie.xAxis,
            yAxis = serie.yAxis,
            origOptions = yAxis.crosshair,
            origGraphic = yAxis.cross,
            origLabel = yAxis.crossLabel,
            points = serie.points,
            x = serie.xData[serie.xData.length - 1],
            y = serie.yData[serie.yData.length - 1],
            crop;

        if (showPrice.enabled) {

            yAxis.crosshair = yAxis.options.crosshair = seriesOptions.showPrice;

            yAxis.cross = serie.customPrice;

            yAxis.drawCrosshair(null, {
                x: x,
                y: isArray(y) ? y[3] : y,
                plotX: xAxis.toPixels(x, true),
                plotY: yAxis.toPixels(isArray(y) ? y[3] : y, true)
            });

            // Save price
            serie.customPrice = serie.yAxis.cross;

        }

        if (priceIndicator.enabled) {

            crop = points[points.length - 1].x === x ? 1 : 2;

            yAxis.crosshair = yAxis.options.crosshair = merge({
                color: 'transparent'
            }, seriesOptions.priceIndicator);

            yAxis.cross = serie.customPriceLabel;

            // Save price
            yAxis.drawCrosshair(null, points[points.length - crop]);

            serie.customPriceLabel = yAxis.cross;

            if (serie.crossLabel) {
                serie.crossLabel.destroy();
            }

            serie.crossLabel = yAxis.crossLabel;

        }

        // Restore crosshair:
        yAxis.crosshair = origOptions;
        yAxis.cross = origGraphic;
        yAxis.crossLabel = origLabel;

    }
});

