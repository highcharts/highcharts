/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import SeriesRegistry from '../../../Core/Series/SeriesRegistry.js';
var SMAIndicator = SeriesRegistry.seriesTypes.sma;
import U from '../../../Core/Utilities.js';
var extend = U.extend, isArray = U.isArray, merge = U.merge;
/**
 * The Price Envelopes series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.priceenvelopes
 *
 * @augments Highcharts.Series
 */
var PriceEnvelopesIndicator = /** @class */ (function (_super) {
    __extends(PriceEnvelopesIndicator, _super);
    function PriceEnvelopesIndicator() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.data = void 0;
        _this.options = void 0;
        _this.points = void 0;
        return _this;
    }
    PriceEnvelopesIndicator.prototype.init = function () {
        SeriesRegistry.seriesTypes.sma.prototype.init.apply(this, arguments);
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
    };
    PriceEnvelopesIndicator.prototype.toYData = function (point) {
        return [point.top, point.middle, point.bottom];
    };
    PriceEnvelopesIndicator.prototype.translate = function () {
        var indicator = this, translatedEnvelopes = ['plotTop', 'plotMiddle', 'plotBottom'];
        SeriesRegistry.seriesTypes.sma.prototype.translate.apply(indicator);
        indicator.points.forEach(function (point) {
            [point.top, point.middle, point.bottom].forEach(function (value, i) {
                if (value !== null) {
                    point[translatedEnvelopes[i]] =
                        indicator.yAxis.toPixels(value, true);
                }
            });
        });
    };
    PriceEnvelopesIndicator.prototype.drawGraph = function () {
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
            SeriesRegistry.seriesTypes.sma.prototype.drawGraph.call(indicator);
            // Now save lines:
            indicator['graph' + lineName] = indicator.graph;
        });
        // Restore options and draw a middle line:
        indicator.points = middleLinePoints;
        indicator.options = middleLineOptions;
        indicator.graph = middleLinePath;
        SeriesRegistry.seriesTypes.sma.prototype.drawGraph.call(indicator);
    };
    PriceEnvelopesIndicator.prototype.getValues = function (series, params) {
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
            point = SeriesRegistry.seriesTypes.sma.prototype.getValues.call(this, {
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
    };
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
    PriceEnvelopesIndicator.defaultOptions = merge(SMAIndicator.defaultOptions, {
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
    });
    return PriceEnvelopesIndicator;
}(SMAIndicator));
extend(PriceEnvelopesIndicator.prototype, {
    nameComponents: ['period', 'topBand', 'bottomBand'],
    nameBase: 'Price envelopes',
    pointArrayMap: ['top', 'middle', 'bottom'],
    parallelArrays: ['x', 'y', 'top', 'bottom'],
    pointValKey: 'middle'
});
SeriesRegistry.registerSeriesType('priceenvelopes', PriceEnvelopesIndicator);
/* *
 *
 *  Default Export
 *
 * */
export default PriceEnvelopesIndicator;
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
