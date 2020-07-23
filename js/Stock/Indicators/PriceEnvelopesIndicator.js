/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from '../../Core/Globals.js';
import U from '../../Core/Utilities.js';
var isArray = U.isArray, merge = U.merge, seriesType = U.seriesType;
var SMA = H.seriesTypes.sma;
/**
 * The Price Envelopes series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.priceenvelopes
 *
 * @augments Highcharts.Series
 */
seriesType('priceenvelopes', 'sma', 
/**
 * Price envelopes indicator based on [SMA](#plotOptions.sma) calculations.
 * This series requires the `linkedTo` option to be set and should be loaded
 * after the `stock/indicators/indicators.js` file.
 *
 * @sample stock/indicators/price-envelopes
 *         Price envelopes
 *
 * @extends      plotOptions.sma
 * @since        6.0.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/price-envelopes
 * @optionparent plotOptions.priceenvelopes
 */
{
    marker: {
        enabled: false
    },
    tooltip: {
        pointFormat: '<span style="color:{point.color}">\u25CF</span><b> {series.name}</b><br/>Top: {point.top}<br/>Middle: {point.middle}<br/>Bottom: {point.bottom}<br/>'
    },
    params: {
        period: 20,
        /**
         * Percentage above the moving average that should be displayed.
         * 0.1 means 110%. Relative to the calculated value.
         */
        topBand: 0.1,
        /**
         * Percentage below the moving average that should be displayed.
         * 0.1 means 90%. Relative to the calculated value.
         */
        bottomBand: 0.1
    },
    /**
     * Bottom line options.
     */
    bottomLine: {
        styles: {
            /**
             * Pixel width of the line.
             */
            lineWidth: 1,
            /**
             * Color of the line. If not set, it's inherited from
             * [plotOptions.priceenvelopes.color](
             * #plotOptions.priceenvelopes.color).
             *
             * @type {Highcharts.ColorString}
             */
            lineColor: void 0
        }
    },
    /**
     * Top line options.
     *
     * @extends plotOptions.priceenvelopes.bottomLine
     */
    topLine: {
        styles: {
            lineWidth: 1
        }
    },
    dataGrouping: {
        approximation: 'averages'
    }
}, 
/**
 * @lends Highcharts.Series#
 */
{
    nameComponents: ['period', 'topBand', 'bottomBand'],
    nameBase: 'Price envelopes',
    pointArrayMap: ['top', 'middle', 'bottom'],
    parallelArrays: ['x', 'y', 'top', 'bottom'],
    pointValKey: 'middle',
    init: function () {
        SMA.prototype.init.apply(this, arguments);
        // Set default color for lines:
        this.options = merge({
            topLine: {
                styles: {
                    lineColor: this.color
                }
            },
            bottomLine: {
                styles: {
                    lineColor: this.color
                }
            }
        }, this.options);
    },
    toYData: function (point) {
        return [point.top, point.middle, point.bottom];
    },
    translate: function () {
        var indicator = this, translatedEnvelopes = ['plotTop', 'plotMiddle', 'plotBottom'];
        SMA.prototype.translate.apply(indicator);
        indicator.points.forEach(function (point) {
            [point.top, point.middle, point.bottom].forEach(function (value, i) {
                if (value !== null) {
                    point[translatedEnvelopes[i]] =
                        indicator.yAxis.toPixels(value, true);
                }
            });
        });
    },
    drawGraph: function () {
        var indicator = this, middleLinePoints = indicator.points, pointsLength = middleLinePoints.length, middleLineOptions = (indicator.options), middleLinePath = indicator.graph, gappedExtend = {
            options: {
                gapSize: middleLineOptions.gapSize
            }
        }, deviations = [[], []], // top and bottom point place holders
        point;
        // Generate points for top and bottom lines:
        while (pointsLength--) {
            point = middleLinePoints[pointsLength];
            deviations[0].push({
                plotX: point.plotX,
                plotY: point.plotTop,
                isNull: point.isNull
            });
            deviations[1].push({
                plotX: point.plotX,
                plotY: point.plotBottom,
                isNull: point.isNull
            });
        }
        // Modify options and generate lines:
        ['topLine', 'bottomLine'].forEach(function (lineName, i) {
            indicator.points = deviations[i];
            indicator.options = merge(middleLineOptions[lineName].styles, gappedExtend);
            indicator.graph = indicator['graph' + lineName];
            SMA.prototype.drawGraph.call(indicator);
            // Now save lines:
            indicator['graph' + lineName] = indicator.graph;
        });
        // Restore options and draw a middle line:
        indicator.points = middleLinePoints;
        indicator.options = middleLineOptions;
        indicator.graph = middleLinePath;
        SMA.prototype.drawGraph.call(indicator);
    },
    getValues: function (series, params) {
        var period = params.period, topPercent = params.topBand, botPercent = params.bottomBand, xVal = series.xData, yVal = series.yData, yValLen = yVal ? yVal.length : 0, 
        // 0- date, 1-top line, 2-middle line, 3-bottom line
        PE = [], 
        // middle line, top line and bottom line
        ML, TL, BL, date, xData = [], yData = [], slicedX, slicedY, point, i;
        // Price envelopes requires close value
        if (xVal.length < period ||
            !isArray(yVal[0]) ||
            yVal[0].length !== 4) {
            return;
        }
        for (i = period; i <= yValLen; i++) {
            slicedX = xVal.slice(i - period, i);
            slicedY = yVal.slice(i - period, i);
            point = SMA.prototype.getValues.call(this, {
                xData: slicedX,
                yData: slicedY
            }, params);
            date = point.xData[0];
            ML = point.yData[0];
            TL = ML * (1 + topPercent);
            BL = ML * (1 - botPercent);
            PE.push([date, TL, ML, BL]);
            xData.push(date);
            yData.push([TL, ML, BL]);
        }
        return {
            values: PE,
            xData: xData,
            yData: yData
        };
    }
});
/**
 * A price envelopes indicator. If the [type](#series.priceenvelopes.type)
 * option is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.priceenvelopes
 * @since     6.0.0
 * @excluding dataParser, dataURL
 * @product   highstock
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/price-envelopes
 * @apioption series.priceenvelopes
 */
''; // to include the above in the js output
