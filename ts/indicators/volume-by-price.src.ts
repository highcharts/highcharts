/* *
 *
 *  (c) 2010-2019 Paweł Dalek
 *
 *  Volume By Price (VBP) indicator for Highstock
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import H from '../parts/Globals.js';


/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        class VBPIndicator extends SMAIndicator {
            public addCustomEvents(
                baseSeries: Series,
                volumeSeries: Series
            ): VBPIndicator;
            public animate(init: boolean): void;
            public crispCol: ColumnSeries['crispCol'];
            public data: Array<VBPIndicatorPoint>;
            public drawPoints(): void;
            public drawZones(
                chart: Chart,
                yAxis: Axis,
                zonesValues: Array<number>,
                zonesStyles: CSSObject
            ): void;
            public getColumnMetrics: ColumnSeries['getColumnMetrics'];
            public getValues<TLinkedSeries extends Series>(
                series: TLinkedSeries,
                params: VBPIndicatorParamsOptions
            ): (IndicatorValuesObject<TLinkedSeries>|undefined);
            public init(chart: Chart): Highcharts.VBPIndicator;
            public nameBase: string;
            public negWidths: Array<number>;
            public options: VBPIndicatorOptions;
            public posNegVolume(initVol: boolean, pos: boolean): void;
            public pointClass: typeof VBPIndicatorPoint;
            public points: Array<VBPIndicatorPoint>;
            public posWidths: Array<number>;
            public priceZones: Array<VBPIndicatorPriceZoneObject>;
            public rangeStep: number;
            public specifyZones(
                isOHLC: boolean,
                xValues: Array<number>,
                yValues: Array<Array<number>>,
                ranges: number,
                volumeSeries: Series
            ): Array<VBPIndicatorPriceZoneObject>;
            public translate(): void;
            public volumePerZone(
                isOHLC: boolean,
                priceZones: Array<VBPIndicatorPriceZoneObject>,
                volumeSeries: Series,
                xValues: Array<number>,
                yValues: Array<Array<number>>
            ): Array<VBPIndicatorPriceZoneObject>;
            public volumeDataArray: Array<number>;
            public zoneStarts: Array<number>;
            public zoneLinesSVG: SVGElement;
        }

        interface VBPIndicatorParamsOptions extends SMAIndicatorParamsOptions {
            ranges?: number;
            volumeSeriesID?: string;
        }

        interface VBPIndicatorPriceZoneObject {
            end: number;
            index: number;
            negativeVolumeData: number;
            positiveVolumeData: number;
            start: number;
            wholeVolumeData: number;
            x: number;
        }

        interface VBPIndicatorStyleOptions {
            enabled?: boolean;
            styles?: CSSObject;
        }

        class VBPIndicatorPoint extends SMAIndicatorPoint {
            public barX: number;
            public destroy(): void;
            public negativeGraphic: unknown;
            public pointWidth: number;
            public series: VBPIndicator;
            public volumeAll: number;
            public volumeNeg: number;
            public volumePos: number;
        }

        interface VBPIndicatorOptions extends SMAIndicatorOptions {
            animationLimit?: number;
            crisp?: boolean;
            dataGrouping?: DataGroupingOptionsObject;
            dataLabels?: DataLabelsOptionsObject;
            enableMouseTracking?: boolean;
            params?: VBPIndicatorParamsOptions;
            pointPadding?: number;
            volumeDivision?: VBPIndicatorStyleOptions;
            zIndex?: number;
            zoneLines?: VBPIndicatorStyleOptions;
        }

        interface SeriesTypesDictionary {
            vpb: typeof VBPIndicator;
        }
    }
}

import U from '../parts/Utilities.js';
const {
    animObject,
    arrayMax,
    arrayMin,
    correctFloat,
    extend,
    isArray
} = U;

/* eslint-disable require-jsdoc */

// Utils
function arrayExtremesOHLC(
    data: Array<Array<number>>
): Highcharts.Dictionary<number> {
    var dataLength: number = data.length,
        min: number = data[0][3],
        max: number = min,
        i = 1,
        currentPoint: number;

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

/* eslint-enable require-jsdoc */

var abs = Math.abs,
    noop = H.noop,
    addEvent = H.addEvent,
    seriesType = H.seriesType,
    columnPrototype = H.seriesTypes.column.prototype;

/**
 * The Volume By Price (VBP) series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.vbp
 *
 * @augments Highcharts.Series
 */
seriesType<Highcharts.VBPIndicator>(
    'vbp',
    'sma',
    /**
     * Volume By Price indicator.
     *
     * This series requires `linkedTo` option to be set.
     *
     * @sample stock/indicators/volume-by-price
     *         Volume By Price indicator
     *
     * @extends      plotOptions.sma
     * @since        6.0.0
     * @product      highstock
     * @requires     stock/indicators/indicators
     * @requires     stock/indicators/volume-by-price
     * @optionparent plotOptions.vbp
     */
    {
        /**
         * @excluding index, period
         */
        params: {
            /**
             * The number of price zones.
             */
            ranges: 12,
            /**
             * The id of volume series which is mandatory. For example using
             * OHLC data, volumeSeriesID='volume' means the indicator will be
             * calculated using OHLC and volume values.
             */
            volumeSeriesID: 'volume'
        },
        /**
         * The styles for lines which determine price zones.
         */
        zoneLines: {
            /**
             * Enable/disable zone lines.
             */
            enabled: true,
            /**
             * Specify the style of zone lines.
             *
             * @type    {Highcharts.CSSObject}
             * @default {"color": "#0A9AC9", "dashStyle": "LongDash", "lineWidth": 1}
             */
            styles: {
                /** @ignore-options */
                color: '#0A9AC9',
                /** @ignore-options */
                dashStyle: 'LongDash',
                /** @ignore-options */
                lineWidth: 1
            }
        },
        /**
         * The styles for bars when volume is divided into positive/negative.
         */
        volumeDivision: {
            /**
             * Option to control if volume is divided.
             */
            enabled: true,
            styles: {
                /**
                 * Color of positive volume bars.
                 *
                 * @type {Highcharts.ColorString}
                 */
                positiveColor: 'rgba(144, 237, 125, 0.8)',
                /**
                 * Color of negative volume bars.
                 *
                 * @type {Highcharts.ColorString}
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
            allowOverlap: true,
            enabled: true,
            format: 'P: {point.volumePos:.2f} | N: {point.volumeNeg:.2f}',
            padding: 0,
            style: {
                /** @internal */
                fontSize: '7px'
            },
            verticalAlign: 'top'
        }
    },
    /**
     * @lends Highcharts.Series#
     */
    {
        nameBase: 'Volume by Price',
        bindTo: {
            series: false,
            eventName: 'afterSetExtremes'
        },
        calculateOn: 'render',
        markerAttribs: (noop as any),
        drawGraph: (noop as any),
        getColumnMetrics: columnPrototype.getColumnMetrics,
        crispCol: columnPrototype.crispCol,
        init: function (
            this: Highcharts.VBPIndicator,
            chart: Highcharts.Chart
        ): Highcharts.VBPIndicator {
            var indicator = this,
                params: Highcharts.VBPIndicatorParamsOptions,
                baseSeries: Highcharts.Series,
                volumeSeries: Highcharts.Series;

            H.seriesTypes.sma.prototype.init.apply(indicator, arguments);

            params = (indicator.options.params as any);
            baseSeries = indicator.linkedParent;
            volumeSeries = (chart.get((params.volumeSeriesID as any)) as any);

            indicator.addCustomEvents(baseSeries, volumeSeries);

            return indicator;
        },
        // Adds events related with removing series
        addCustomEvents: function (
            this: Highcharts.VBPIndicator,
            baseSeries: Highcharts.Series,
            volumeSeries: Highcharts.Series
        ): Highcharts.VBPIndicator {
            var indicator = this;

            /* eslint-disable require-jsdoc */
            function toEmptyIndicator(): void {
                indicator.chart.redraw();

                indicator.setData([]);
                indicator.zoneStarts = [];

                if (indicator.zoneLinesSVG) {
                    indicator.zoneLinesSVG.destroy();
                    delete indicator.zoneLinesSVG;
                }
            }
            /* eslint-enable require-jsdoc */

            // If base series is deleted, indicator series data is filled with
            // an empty array
            indicator.dataEventsToUnbind.push(
                addEvent(baseSeries, 'remove', function (): void {
                    toEmptyIndicator();
                })
            );

            // If volume series is deleted, indicator series data is filled with
            // an empty array
            if (volumeSeries) {
                indicator.dataEventsToUnbind.push(
                    addEvent(volumeSeries, 'remove', function (): void {
                        toEmptyIndicator();
                    })
                );
            }

            return indicator;
        },
        // Initial animation
        animate: function (
            this: Highcharts.VBPIndicator,
            init: boolean
        ): void {
            var series = this,
                attr: Highcharts.SVGAttributes = {};

            if (H.svg && !init) {
                attr.translateX = series.yAxis.pos;
                (series.group as any).animate(
                    attr,
                    extend(animObject(series.options.animation), {
                        step: function (val: any, fx: any): void {
                            (series.group as any).attr({
                                scaleX: Math.max(0.001, fx.pos)
                            });
                        }
                    })
                );

                // Delete this function to allow it only once
                (series.animate as any) = null;
            }
        },
        drawPoints: function (this: Highcharts.VBPIndicator): void {
            var indicator = this;

            if ((indicator.options.volumeDivision as any).enabled) {
                indicator.posNegVolume(true, true);
                columnPrototype.drawPoints.apply(indicator, arguments);
                indicator.posNegVolume(false, false);
            }

            columnPrototype.drawPoints.apply(indicator, arguments);
        },
        // Function responsible for dividing volume into positive and negative
        posNegVolume: function (
            this: Highcharts.VBPIndicator,
            initVol: boolean,
            pos: boolean
        ): void {
            var indicator = this,
                signOrder: Array<string> = pos ?
                    ['positive', 'negative'] :
                    ['negative', 'positive'],
                volumeDivision: Highcharts.VBPIndicatorStyleOptions = (
                    indicator.options.volumeDivision as any
                ),
                pointLength: number = indicator.points.length,
                posWidths: Array<number> = [],
                negWidths: Array<number> = [],
                i = 0,
                pointWidth: number,
                priceZone: Highcharts.VBPIndicatorPriceZoneObject,
                wholeVol: number,
                point: Highcharts.VBPIndicatorPoint;

            if (initVol) {
                indicator.posWidths = posWidths;
                indicator.negWidths = negWidths;
            } else {
                posWidths = indicator.posWidths;
                negWidths = indicator.negWidths;
            }

            for (; i < pointLength; i++) {
                point = indicator.points[i];
                (point as any)[signOrder[0] + 'Graphic'] = point.graphic;
                point.graphic = (point as any)[signOrder[1] + 'Graphic'];

                if (initVol) {
                    pointWidth = (point.shapeArgs as any).width;
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
                    (volumeDivision.styles as any).positiveColor :
                    (volumeDivision.styles as any).negativeColor;
                (point.shapeArgs as any).width = pos ?
                    indicator.posWidths[i] :
                    indicator.negWidths[i];
                (point.shapeArgs as any).x = pos ?
                    (point.shapeArgs as any).x :
                    indicator.posWidths[i];
            }
        },
        translate: function (this: Highcharts.VBPIndicator): void {
            var indicator = this,
                options: Highcharts.VBPIndicatorOptions = indicator.options,
                chart: Highcharts.Chart = indicator.chart,
                yAxis: Highcharts.Axis = indicator.yAxis,
                yAxisMin: number = (yAxis.min as any),
                zoneLinesOptions: Highcharts.VBPIndicatorStyleOptions = (
                    indicator.options.zoneLines as any
                ),
                priceZones: Array<Highcharts.VBPIndicatorPriceZoneObject> = (
                    indicator.priceZones
                ),
                yBarOffset = 0,
                indicatorPoints: Array<Highcharts.VBPIndicatorPoint>,
                volumeDataArray: Array<number>,
                maxVolume: number,
                primalBarWidth: number,
                barHeight: number,
                barHeightP: number,
                oldBarHeight: number,
                barWidth: number,
                pointPadding: number,
                chartPlotTop: number,
                barX: number,
                barY: number;

            columnPrototype.translate.apply(indicator);
            indicatorPoints = indicator.points;

            // Do translate operation when points exist
            if (indicatorPoints.length) {
                pointPadding = (options.pointPadding as any) < 0.5 ?
                    (options.pointPadding as any) :
                    0.1;
                volumeDataArray = indicator.volumeDataArray;
                maxVolume = arrayMax(volumeDataArray);
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

                indicatorPoints.forEach(
                    function (
                        point: Highcharts.VBPIndicatorPoint,
                        index: number
                    ): void {
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

                        point.shapeArgs = indicator.crispCol.apply( // eslint-disable-line no-useless-call
                            indicator,
                            [barX, barY, barWidth, barHeight]
                        );

                        point.volumeNeg = priceZones[index].negativeVolumeData;
                        point.volumePos = priceZones[index].positiveVolumeData;
                        point.volumeAll = priceZones[index].wholeVolumeData;
                    }
                );

                if (zoneLinesOptions.enabled) {
                    indicator.drawZones(
                        chart,
                        yAxis,
                        indicator.zoneStarts,
                        (zoneLinesOptions.styles as any)
                    );
                }
            }
        },
        getValues: function<TLinkedSeries extends Highcharts.Series> (
            this: Highcharts.VBPIndicator,
            series: TLinkedSeries,
            params: Highcharts.VBPIndicatorParamsOptions
        ): (Highcharts.IndicatorValuesObject<TLinkedSeries>|undefined) {
            var indicator = this,
                xValues: Array<number> = series.processedXData,
                yValues: Array<Array<number>> = (series.processedYData as any),
                chart = indicator.chart,
                ranges: number = (params.ranges as any),
                VBP: Array<Array<number>> = [],
                xData: Array<number> = [],
                yData: Array<number> = [],
                isOHLC: boolean,
                volumeSeries: Highcharts.Series,
                priceZones: Array<Highcharts.VBPIndicatorPriceZoneObject>;

            // Checks if base series exists
            if (!series.chart) {
                H.error(
                    'Base series not found! In case it has been removed, add ' +
                    'a new one.',
                    true,
                    chart
                );
                return;
            }

            // Checks if volume series exists
            if (!(volumeSeries = (
                chart.get(params.volumeSeriesID as any)) as any
            )) {
                H.error(
                    'Series ' +
                    params.volumeSeriesID +
                    ' not found! Check `volumeSeriesID`.',
                    true,
                    chart
                );
                return;
            }

            // Checks if series data fits the OHLC format
            isOHLC = isArray(yValues[0]);

            if (isOHLC && yValues[0].length !== 4) {
                H.error(
                    'Type of ' +
                    series.name +
                    ' series is different than line, OHLC or candlestick.',
                    true,
                    chart
                );
                return;
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

            priceZones.forEach(
                function (
                    zone: Highcharts.VBPIndicatorPriceZoneObject,
                    index: number
                ): void {
                    VBP.push([zone.x, zone.end]);
                    xData.push(VBP[index][0]);
                    yData.push(VBP[index][1]);
                }
            );

            return {
                values: VBP,
                xData: xData,
                yData: yData
            } as Highcharts.IndicatorValuesObject<TLinkedSeries>;
        },
        // Specifing where each zone should start ans end
        specifyZones: function (
            this: Highcharts.VBPIndicator,
            isOHLC: boolean,
            xValues: Array<number>,
            yValues: Array<Array<number>>,
            ranges: number,
            volumeSeries: Highcharts.Series
        ): Array<Highcharts.VBPIndicatorPriceZoneObject> {
            var indicator = this,
                rangeExtremes: (boolean|Highcharts.Dictionary<number>) = (
                    isOHLC ? arrayExtremesOHLC(yValues) : false
                ),
                lowRange: number = rangeExtremes ?
                    rangeExtremes.min :
                    arrayMin(yValues),
                highRange: number = rangeExtremes ?
                    rangeExtremes.max :
                    arrayMax(yValues),
                zoneStarts: Array<number> = indicator.zoneStarts = [],
                priceZones: Array<Highcharts.VBPIndicatorPriceZoneObject> = [],
                i = 0,
                j = 1,
                rangeStep: number,
                zoneStartsLength: number;

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
                } as any);
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
            this: Highcharts.VBPIndicator,
            isOHLC: boolean,
            priceZones: Array<Highcharts.VBPIndicatorPriceZoneObject>,
            volumeSeries: Highcharts.Series,
            xValues: Array<number>,
            yValues: Array<Array<number>>
        ): Array<Highcharts.VBPIndicatorPriceZoneObject> {
            var indicator = this,
                volumeXData: Array<number> = volumeSeries.processedXData,
                volumeYData: Array<number> = (
                    volumeSeries.processedYData as any
                ),
                lastZoneIndex: number = priceZones.length - 1,
                baseSeriesLength: number = yValues.length,
                volumeSeriesLength: number = volumeYData.length,
                previousValue: number,
                startFlag: boolean,
                endFlag: boolean,
                value: number,
                i: number;

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

            priceZones.forEach(
                function (zone: Highcharts.VBPIndicatorPriceZoneObject): void {
                    zone.wholeVolumeData = 0;
                    zone.positiveVolumeData = 0;
                    zone.negativeVolumeData = 0;

                    for (i = 0; i < baseSeriesLength; i++) {
                        startFlag = false;
                        endFlag = false;
                        value = isOHLC ? yValues[i][3] : (yValues[i] as any);
                        previousValue = i ?
                            (
                                isOHLC ?
                                    yValues[i - 1][3] :
                                    (yValues[i - 1] as any)
                            ) :
                            value;

                        // Checks if this is the point with the
                        // lowest close value and if so, adds it calculations
                        if (value <= zone.start && zone.index === 0) {
                            startFlag = true;
                        }

                        // Checks if this is the point with the highest
                        // close value and if so, adds it calculations
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
                }
            );

            return priceZones;
        },
        // Function responsoble for drawing additional lines indicating zones
        drawZones: function (
            this: Highcharts.VBPIndicator,
            chart: Highcharts.Chart,
            yAxis: Highcharts.Axis,
            zonesValues: Array<number>,
            zonesStyles: Highcharts.CSSObject
        ): void {
            var indicator = this,
                renderer: Highcharts.Renderer = chart.renderer,
                zoneLinesSVG: Highcharts.SVGElement = indicator.zoneLinesSVG,
                zoneLinesPath: Highcharts.SVGPathArray = [],
                leftLinePos = 0,
                rightLinePos: number = chart.plotWidth,
                verticalOffset: number = chart.plotTop,
                verticalLinePos: number;

            zonesValues.forEach(function (value: number): void {
                verticalLinePos = yAxis.toPixels(value) - verticalOffset;
                zoneLinesPath = zoneLinesPath.concat(chart.renderer.crispLine([
                    'M',
                    leftLinePos,
                    verticalLinePos,
                    'L',
                    rightLinePos,
                    verticalLinePos
                ], (zonesStyles.lineWidth as any)));
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
                        'zIndex': (indicator.group as any).zIndex + 0.1
                    })
                        .add(indicator.group);
            }
        }
    },
    /**
     * @lends Highcharts.Point#
     */
    {
        // Required for destroying negative part of volume
        destroy: function (this: Highcharts.VBPIndicatorPoint): void {
            // @todo: this.negativeGraphic doesn't seem to be used anywhere
            if (this.negativeGraphic) {
                this.negativeGraphic = (this.negativeGraphic as any).destroy();
            }
            return H.Point.prototype.destroy.apply(this, arguments);
        }
    }
);

/**
 * A `Volume By Price (VBP)` series. If the [type](#series.vbp.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.vbp
 * @since     6.0.0
 * @product   highstock
 * @excluding dataParser, dataURL
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/volume-by-price
 * @apioption series.vbp
 */

''; // to include the above in the js output
