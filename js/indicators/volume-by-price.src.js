/**
 * (c) 2010-2017 Paweł Dalek
 *
 * Volume By Price (VBP) indicator for Highstock
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';

// Utils
function arrayExtremesOHLC(data) {
    var dataLength = data.length,
        min = data[0][3],
        max = min,
        i = 1,
        currentPoint;

    for (; i < dataLength; i++) {
        currentPoint = data[i][3];
        if (currentPoint < min) {
            min = currentPoint;
        }

        if (currentPoint > max) {
            max = currentPoint;
        }
    }

    return {
        min: min,
        max: max
    };
}

var abs = Math.abs,
    each = H.each,
    noop = H.noop,
    addEvent = H.addEvent,
    correctFloat = H.correctFloat,
    seriesType = H.seriesType,
    columnPrototype = H.seriesTypes.column.prototype;

/**
 * The Volume By Price (VBP) series type.
 *
 * @constructor seriesTypes.vbp
 * @augments seriesTypes.vbp
 */
seriesType('vbp', 'sma',
    /**
     * Volume By Price indicator.
     *
     * This series requires `linkedTo` option to be set.
     *
     * @extends {plotOptions.sma}
     * @product highstock
     * @sample {highstock} stock/indicators/volume-by-price
     *                     Volume By Price indicator
     * @since 6.0.0
     * @optionparent plotOptions.vbp
     */
    {
        /**
         * @excluding index,period
         */
        params: {
            /**
             * The number of price zones.
             *
             * @type {Number}
             * @since 6.0.0
             * @product highstock
             */
            ranges: 12,
            /**
             * The id of volume series which is mandatory. For example using
             * OHLC data, volumeSeriesID='volume' means the indicator will be
             * calculated using OHLC and volume values.
             *
             * @type {String}
             * @since 6.0.0
             * @product highstock
             */
            volumeSeriesID: 'volume'
        },
        /**
         * The styles for lines which determine price zones.
         *
         * @type {Object}
         * @since 6.0.0
         * @product highstock
         */
        zoneLines: {
            /**
             * Enable/disable zone lines.
             *
             * @type {Boolean}
             * @since 6.0.0
             * @default true
             * @product highstock
             */
            enabled: true,
            styles: {
                /**
                 * Color of zone lines.
                 *
                 * @type {Color}
                 * @since 6.0.0
                 * @product highstock
                 */
                color: '#0A9AC9',
                /**
                 * The dash style of zone lines.
                 *
                 * @type {String}
                 * @since 6.0.0
                 * @product highstock
                 */
                dashStyle: 'LongDash',
                /**
                 * Pixel width of zone lines.
                 *
                 * @type {Number}
                 * @since 6.0.0
                 * @product highstock
                 */
                lineWidth: 1
            }
        },
        /**
         * The styles for bars when volume is divided into positive/negative.
         *
         * @type {Object}
         * @since 6.0.0
         * @product highstock
         */
        volumeDivision: {
            /**
             * Option to control if volume is divided.
             *
             * @type {Boolean}
             * @since 6.0.0
             * @product highstock
             */
            enabled: true,
            styles: {
                /**
                 * Color of positive volume bars.
                 *
                 * @type {Color}
                 * @since 6.0.0
                 * @product highstock
                 */
                positiveColor: 'rgba(144, 237, 125, 0.8)',
                /**
                 * Color of negative volume bars.
                 *
                 * @type {Color}
                 * @since 6.0.0
                 * @product highstock
                 */
                negativeColor: 'rgba(244, 91, 91, 0.8)'
            }
        },
        // To enable series animation; must be animationLimit > pointCount
        animationLimit: 1000,
        enableMouseTracking: false,
        pointPadding: 0,
        zIndex: -1,
        crisp: true,
        dataGrouping: {
            enabled: false
        },
        dataLabels: {
            enabled: true,
            allowOverlap: true,
            verticalAlign: 'top',
            format: 'P: {point.volumePos:.2f} | N: {point.volumeNeg:.2f}',
            padding: 0,
            style: {
                fontSize: '7px'
            }
        }
    }, {
        nameBase: 'Volume by Price',
        bindTo: {
            series: false,
            eventName: 'afterSetExtremes'
        },
        calculateOn: 'render',
        markerAttribs: noop,
        drawGraph: noop,
        getColumnMetrics: columnPrototype.getColumnMetrics,
        crispCol: columnPrototype.crispCol,
        init: function (chart) {
            var indicator = this,
                params,
                baseSeries,
                volumeSeries;

            H.seriesTypes.sma.prototype.init.apply(indicator, arguments);

            params = indicator.options.params;
            baseSeries = indicator.linkedParent;
            volumeSeries = chart.get(params.volumeSeriesID);

            indicator.addCustomEvents(baseSeries, volumeSeries);

            return indicator;
        },
        // Adds events related with removing series
        addCustomEvents: function (baseSeries, volumeSeries) {
            var indicator = this;

            function toEmptyIndicator() {
                indicator.chart.redraw();

                indicator.setData([]);
                indicator.zoneStarts = [];

                if (indicator.zoneLinesSVG) {
                    indicator.zoneLinesSVG.destroy();
                    delete indicator.zoneLinesSVG;
                }
            }

            // If base series is deleted, indicator series data is filled with
            // an empty array
            indicator.dataEventsToUnbind.push(
                addEvent(baseSeries, 'remove', function () {
                    toEmptyIndicator();
                })
            );

            // If volume series is deleted, indicator series data is filled with
            // an empty array
            if (volumeSeries) {
                indicator.dataEventsToUnbind.push(
                    addEvent(volumeSeries, 'remove', function () {
                        toEmptyIndicator();
                    })
                );
            }

            return indicator;
        },
        // Initial animation
        animate: function (init) {
            var series = this,
                attr = {};

            if (H.svg && !init) {
                attr.translateX = series.yAxis.pos;
                series.group.animate(
                    attr,
                    H.extend(H.animObject(series.options.animation), {
                        step: function (val, fx) {
                            series.group.attr({
                                scaleX: Math.max(0.001, fx.pos)
                            });
                        }
                    })
                );

                // Delete this function to allow it only once
                series.animate = null;
            }
        },
        drawPoints: function () {
            var indicator = this;

            if (indicator.options.volumeDivision.enabled) {
                indicator.posNegVolume(true, true);
                columnPrototype.drawPoints.apply(indicator, arguments);
                indicator.posNegVolume(false, false);
            }

            columnPrototype.drawPoints.apply(indicator, arguments);
        },
        // Function responsible for dividing volume into positive and negative
        posNegVolume: function (initVol, pos) {
            var indicator = this,
                signOrder = pos ?
                    ['positive', 'negative'] :
                    ['negative', 'positive'],
                volumeDivision = indicator.options.volumeDivision,
                pointLength = indicator.points.length,
                posWidths = [],
                negWidths = [],
                i = 0,
                pointWidth,
                priceZone,
                wholeVol,
                point;

            if (initVol) {
                indicator.posWidths = posWidths;
                indicator.negWidths = negWidths;
            } else {
                posWidths = indicator.posWidths;
                negWidths = indicator.negWidths;
            }

            for (; i < pointLength; i++) {
                point = indicator.points[i];
                point[signOrder[0] + 'Graphic'] = point.graphic;
                point.graphic = point[signOrder[1] + 'Graphic'];

                if (initVol) {
                    pointWidth = point.shapeArgs.width;
                    priceZone = indicator.priceZones[i];
                    wholeVol = priceZone.wholeVolumeData;

                    if (wholeVol) {
                        posWidths.push(
                            pointWidth / wholeVol * priceZone.positiveVolumeData
                        );
                        negWidths.push(
                            pointWidth / wholeVol * priceZone.negativeVolumeData
                        );
                    } else {
                        posWidths.push(0);
                        negWidths.push(0);
                    }
                }

                point.color = pos ?
                    volumeDivision.styles.positiveColor :
                    volumeDivision.styles.negativeColor;
                point.shapeArgs.width = pos ?
                    indicator.posWidths[i] :
                    indicator.negWidths[i];
                point.shapeArgs.x = pos ?
                    point.shapeArgs.x :
                    indicator.posWidths[i];
            }
        },
        translate: function () {
            var indicator = this,
                options = indicator.options,
                chart = indicator.chart,
                yAxis = indicator.yAxis,
                yAxisMin = yAxis.min,
                zoneLinesOptions = indicator.options.zoneLines,
                priceZones = indicator.priceZones,
                yBarOffset = 0,
                indicatorPoints,
                volumeDataArray,
                maxVolume,
                primalBarWidth,
                barHeight,
                barHeightP,
                oldBarHeight,
                barWidth,
                pointPadding,
                chartPlotTop,
                barX,
                barY;

            columnPrototype.translate.apply(indicator);
            indicatorPoints = indicator.points;

            // Do translate operation when points exist
            if (indicatorPoints.length) {
                pointPadding = options.pointPadding < 0.5 ?
                    options.pointPadding :
                    0.1;
                volumeDataArray = indicator.volumeDataArray;
                maxVolume = H.arrayMax(volumeDataArray);
                primalBarWidth = chart.plotWidth / 2;
                chartPlotTop = chart.plotTop;
                barHeight = abs(yAxis.toPixels(yAxisMin) -
                    yAxis.toPixels(yAxisMin + indicator.rangeStep));
                oldBarHeight = abs(yAxis.toPixels(yAxisMin) -
                    yAxis.toPixels(yAxisMin + indicator.rangeStep));

                if (pointPadding) {
                    barHeightP = abs(barHeight * (1 - 2 * pointPadding));
                    yBarOffset = abs((barHeight - barHeightP) / 2);
                    barHeight = abs(barHeightP);
                }

                each(indicatorPoints, function (point, index) {
                    barX = point.barX = point.plotX = 0;
                    barY = point.plotY = (
                        yAxis.toPixels(priceZones[index].start) -
                        chartPlotTop -
                        (
                            yAxis.reversed ?
                                (barHeight - oldBarHeight) :
                                barHeight
                        ) -
                        yBarOffset
                    );
                    barWidth = correctFloat(
                        primalBarWidth *
                        priceZones[index].wholeVolumeData / maxVolume
                    );
                    point.pointWidth = barWidth;

                    point.shapeArgs = indicator.crispCol.apply(
                        indicator,
                        [barX, barY, barWidth, barHeight]
                    );

                    point.volumeNeg = priceZones[index].negativeVolumeData;
                    point.volumePos = priceZones[index].positiveVolumeData;
                    point.volumeAll = priceZones[index].wholeVolumeData;
                });

                if (zoneLinesOptions.enabled) {
                    indicator.drawZones(
                        chart,
                        yAxis,
                        indicator.zoneStarts,
                        zoneLinesOptions.styles
                    );
                }
            }
        },
        getValues: function (series, params) {
            var indicator = this,
                xValues = series.processedXData,
                yValues = series.processedYData,
                chart = series.chart,
                ranges = params.ranges,
                VBP = [],
                xData = [],
                yData = [],
                isOHLC,
                volumeSeries,
                priceZones;

            // Checks if base series exists
            if (!chart) {
                return H.error(
                    'Base series not found! In case it has been removed, add ' +
                    'a new one.',
                    true
                );
            }

            // Checks if volume series exists
            if (!(volumeSeries = chart.get(params.volumeSeriesID))) {
                return H.error(
                    'Series ' +
                    params.volumeSeriesID +
                    ' not found! Check `volumeSeriesID`.',
                    true
                );
            }

            // Checks if series data fits the OHLC format
            isOHLC = H.isArray(yValues[0]);

            if (isOHLC && yValues[0].length !== 4) {
                return H.error(
                    'Type of ' +
                    series.name +
                    ' series is different than line, OHLC or candlestick.',
                    true
                );
            }

            // Price zones contains all the information about the zones (index,
            // start, end, volumes, etc.)
            priceZones = indicator.priceZones = indicator.specifyZones(
                isOHLC,
                xValues,
                yValues,
                ranges,
                volumeSeries
            );

            each(priceZones, function (zone, index) {
                VBP.push([zone.x, zone.end]);
                xData.push(VBP[index][0]);
                yData.push(VBP[index][1]);
            });

            return {
                values: VBP,
                xData: xData,
                yData: yData
            };
        },
        // Specifing where each zone should start ans end
        specifyZones: function (
            isOHLC,
            xValues,
            yValues,
            ranges,
            volumeSeries
        ) {
            var indicator = this,
                rangeExtremes = isOHLC ? arrayExtremesOHLC(yValues) : false,
                lowRange = rangeExtremes ?
                    rangeExtremes.min :
                    H.arrayMin(yValues),
                highRange = rangeExtremes ?
                    rangeExtremes.max :
                    H.arrayMax(yValues),
                zoneStarts = indicator.zoneStarts = [],
                priceZones = [],
                i = 0,
                j = 1,
                rangeStep,
                zoneStartsLength;

            if (!lowRange || !highRange) {
                if (this.points.length) {
                    this.setData([]);
                    this.zoneStarts = [];
                    this.zoneLinesSVG.destroy();
                }
                return [];
            }

            rangeStep = indicator.rangeStep =
                correctFloat(highRange - lowRange) / ranges;
            zoneStarts.push(lowRange);

            for (; i < ranges - 1; i++) {
                zoneStarts.push(correctFloat(zoneStarts[i] + rangeStep));
            }

            zoneStarts.push(highRange);
            zoneStartsLength = zoneStarts.length;

            //    Creating zones
            for (; j < zoneStartsLength; j++) {
                priceZones.push({
                    index: j - 1,
                    x: xValues[0],
                    start: zoneStarts[j - 1],
                    end: zoneStarts[j]
                });
            }

            return indicator.volumePerZone(
                isOHLC,
                priceZones,
                volumeSeries,
                xValues,
                yValues
            );
        },
        // Calculating sum of volume values for a specific zone
        volumePerZone: function (
            isOHLC,
            priceZones,
            volumeSeries,
            xValues,
            yValues
        ) {
            var indicator = this,
                volumeXData = volumeSeries.processedXData,
                volumeYData = volumeSeries.processedYData,
                lastZoneIndex = priceZones.length - 1,
                baseSeriesLength = yValues.length,
                volumeSeriesLength = volumeYData.length,
                previousValue,
                startFlag,
                endFlag,
                value,
                i;

            // Checks if each point has a corresponding volume value
            if (abs(baseSeriesLength - volumeSeriesLength)) {
                // If the first point don't have volume, add 0 value at the
                // beggining of the volume array
                if (xValues[0] !== volumeXData[0]) {
                    volumeYData.unshift(0);
                }

                // If the last point don't have volume, add 0 value at the end
                // of the volume array
                if (
                    xValues[baseSeriesLength - 1] !==
                    volumeXData[volumeSeriesLength - 1]
                ) {
                    volumeYData.push(0);
                }
            }

            indicator.volumeDataArray = [];

            each(priceZones, function (zone) {
                zone.wholeVolumeData = 0;
                zone.positiveVolumeData = 0;
                zone.negativeVolumeData = 0;

                for (i = 0; i < baseSeriesLength; i++) {
                    startFlag = false;
                    endFlag = false;
                    value = isOHLC ? yValues[i][3] : yValues[i];
                    previousValue = i ?
                        (isOHLC ? yValues[i - 1][3] : yValues[i - 1]) :
                        value;

                    // Checks if this is the point with the lowest close value
                    // and if so, adds it calculations
                    if (value <= zone.start && zone.index === 0) {
                        startFlag = true;
                    }

                    // Checks if this is the point with the highest close value
                    // and if so, adds it calculations
                    if (value >= zone.end && zone.index === lastZoneIndex) {
                        endFlag = true;
                    }

                    if (
                        (value > zone.start || startFlag) &&
                        (value < zone.end || endFlag)
                    ) {
                        zone.wholeVolumeData += volumeYData[i];

                        if (previousValue > value) {
                            zone.negativeVolumeData += volumeYData[i];
                        } else {
                            zone.positiveVolumeData += volumeYData[i];
                        }
                    }
                }
                indicator.volumeDataArray.push(zone.wholeVolumeData);
            });

            return priceZones;
        },
        // Function responsoble for drawing additional lines indicating zones
        drawZones: function (chart, yAxis, zonesValues, zonesStyles) {
            var indicator = this,
                renderer = chart.renderer,
                zoneLinesSVG = indicator.zoneLinesSVG,
                zoneLinesPath = [],
                leftLinePos = 0,
                rightLinePos = chart.plotWidth,
                verticalOffset = chart.plotTop,
                verticalLinePos;

            each(zonesValues, function (value) {
                verticalLinePos = yAxis.toPixels(value) - verticalOffset;
                zoneLinesPath = zoneLinesPath.concat(chart.renderer.crispLine([
                    'M',
                    leftLinePos,
                    verticalLinePos,
                    'L',
                    rightLinePos,
                    verticalLinePos
                ], zonesStyles.lineWidth));
            });

            // Create zone lines one path or update it while animating
            if (zoneLinesSVG) {
                zoneLinesSVG.animate({
                    d: zoneLinesPath
                });
            } else {
                zoneLinesSVG = indicator.zoneLinesSVG =
                    renderer.path(zoneLinesPath).attr({
                        'stroke-width': zonesStyles.lineWidth,
                        'stroke': zonesStyles.color,
                        'dashstyle': zonesStyles.dashStyle,
                        'zIndex': indicator.group.zIndex + 0.1
                    })
                    .add(indicator.group);
            }
        }
    }, {
        // Required for destroying negative part of volume
        destroy: function () {
            if (this.negativeGraphic) {
                this.negativeGraphic = this.negativeGraphic.destroy();
            }
            return H.Point.prototype.destroy.apply(this, arguments);
        }
    });

/**
 * A `Volume By Price (VBP)` series. If the [type](#series.vbp.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @type {Object}
 * @since 6.0.0
 * @extends series,plotOptions.vbp
 * @excluding data,dataParser,dataURL
 * @product highstock
 * @apioption series.vbp
 */

/**
 * @extends series.sma.data
 * @product highstock
 * @apioption series.vbp.data
 */
