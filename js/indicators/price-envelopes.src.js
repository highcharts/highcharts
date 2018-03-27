'use strict';

import H from '../parts/Globals.js';
import '../parts/Utilities.js';

var each = H.each,
    merge = H.merge,
    isArray = H.isArray,
    SMA = H.seriesTypes.sma;

H.seriesType('priceenvelopes', 'sma',
    /**
     * Price envelopes indicator based on [SMA](#plotOptions.sma) calculations.
     * This series requires the `linkedTo` option to be set and should be loaded
     * after the `stock/indicators/indicators.js` file.
     *
     * @extends {plotOptions.sma}
     * @product highstock
     * @sample {highstock} stock/indicators/price-envelopes
     *                     Price envelopes
     * @since 6.0.0
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
             *
             * @type {Number}
             * @since 6.0.0
             * @product highstock
             */
            topBand: 0.1,
            /**
             * Percentage below the moving average that should be displayed.
             * 0.1 means 90%. Relative to the calculated value.
             *
             * @type {Number}
             * @since 6.0.0
             * @product highstock
             */
            bottomBand: 0.1
        },
        /**
         * Bottom line options.
         *
         * @since 6.0.0
         * @product highstock
         */
        bottomLine: {
            styles: {
                /**
                 * Pixel width of the line.
                 *
                 * @type {Number}
                 * @since 6.0.0
                 * @product highstock
                 */
                lineWidth: 1,
                /**
                 * Color of the line. If not set, it's inherited from
                 * [plotOptions.priceenvelopes.color](
                 * #plotOptions.priceenvelopes.color).
                 *
                 * @type {String}
                 * @since 6.0.0
                 * @product highstock
                 */
                lineColor: undefined
            }
        },
        /**
         * Top line options.
         *
         * @extends {plotOptions.priceenvelopes.bottomLine}
         * @since 6.0.0
         * @product highstock
         */
        topLine: {
            styles: {
                lineWidth: 1
            }
        },
        dataGrouping: {
            approximation: 'averages'
        }
    }, /** @lends Highcharts.Series.prototype */ {
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
            var indicator = this,
                translatedEnvelopes = ['plotTop', 'plotMiddle', 'plotBottom'];

            SMA.prototype.translate.apply(indicator);

            each(indicator.points, function (point) {
                each(
                    [point.top, point.middle, point.bottom],
                    function (value, i) {
                        if (value !== null) {
                            point[translatedEnvelopes[i]] =
                                indicator.yAxis.toPixels(value, true);
                        }
                    }
                );
            });
        },
        drawGraph: function () {
            var indicator = this,
                middleLinePoints = indicator.points,
                pointsLength = middleLinePoints.length,
                middleLineOptions = indicator.options,
                middleLinePath = indicator.graph,
                gappedExtend = {
                    options: {
                        gapSize: middleLineOptions.gapSize
                    }
                },
                deviations = [[], []], // top and bottom point place holders
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
            each(['topLine', 'bottomLine'], function (lineName, i) {
                indicator.points = deviations[i];
                indicator.options = merge(
                    middleLineOptions[lineName].styles,
                    gappedExtend
                );
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
            var period = params.period,
                topPercent = params.topBand,
                botPercent = params.bottomBand,
                xVal = series.xData,
                yVal = series.yData,
                yValLen = yVal ? yVal.length : 0,
                PE = [], // 0- date, 1-top line, 2-middle line, 3-bottom line
                ML, TL, BL, // middle line, top line and bottom line
                date,
                xData = [],
                yData = [],
                slicedX,
                slicedY,
                point,
                i;

            // Price envelopes requires close value
            if (
                xVal.length < period ||
                !isArray(yVal[0]) ||
                yVal[0].length !== 4
            ) {
                return false;
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
    }
);

/**
 * A price envelopes indicator. If the [type](#series.priceenvelopes.type)
 * option is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @type {Object}
 * @since 6.0.0
 * @extends series,plotOptions.priceenvelopes
 * @excluding data,dataParser,dataURL
 * @product highstock
 * @apioption series.priceenvelopes
 */

/**
 * An array of data points for the series. For the `priceenvelopes` series type,
 * points are calculated dynamically.
 *
 * @type {Array<Object|Array>}
 * @since 6.0.0
 * @extends series.line.data
 * @product highstock
 * @apioption series.priceenvelopes.data
 */
