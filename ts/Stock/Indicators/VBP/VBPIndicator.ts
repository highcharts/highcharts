/* *
 *
 *  (c) 2010-2021 Paweł Dalek
 *
 *  Volume By Price (VBP) indicator for Highstock
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type { AxisType } from '../../../Core/Axis/Types';
import type Chart from '../../../Core/Chart/Chart';
import type ColumnSeries from '../../../Series/Column/ColumnSeries';
import type CSSObject from '../../../Core/Renderer/CSSObject';
import type IndicatorValuesObject from '../IndicatorValuesObject';
import type LineSeries from '../../../Series/Line/LineSeries';
import type SVGAttributes from '../../../Core/Renderer/SVG/SVGAttributes';
import type SVGElement from '../../../Core/Renderer/SVG/SVGElement';
import type SVGPath from '../../../Core/Renderer/SVG/SVGPath';
import type {
    VBPOptions,
    VBPParamsOptions
} from './VBPOptions';
import VBPPoint from './VBPPoint';

import A from '../../../Core/Animation/AnimationUtilities.js';
const { animObject } = A;
import H from '../../../Core/Globals.js';
const {
    noop
} = H;
import SeriesRegistry from '../../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        sma: SMAIndicator
    }
} = SeriesRegistry;
import U from '../../../Core/Utilities.js';
const {
    addEvent,
    arrayMax,
    arrayMin,
    correctFloat,
    error,
    extend,
    isArray,
    merge
} = U;

/* eslint-disable require-jsdoc */

// Utils
function arrayExtremesOHLC(
    data: Array<Array<number>>
): Record<string, number> {
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
    columnPrototype = SeriesRegistry.seriesTypes.column.prototype;

/**
 * The Volume By Price (VBP) series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.vbp
 *
 * @augments Highcharts.Series
 */
class VBPIndicator extends SMAIndicator {
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
    public static defaultOptions: VBPOptions = merge(SMAIndicator.defaultOptions, {
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
    } as VBPOptions)

    public data: Array<VBPPoint> = void 0 as any;
    public negWidths: Array<number> = void 0 as any;
    public options: VBPOptions = void 0 as any;
    public points: Array<VBPPoint> = void 0 as any;
    public posWidths: Array<number> = void 0 as any;
    public priceZones: Array<VBPIndicator.VBPIndicatorPriceZoneObject> = void 0 as any;
    public rangeStep: number = void 0 as any;
    public volumeDataArray: Array<number> = void 0 as any;
    public zoneStarts: Array<number> = void 0 as any;
    public zoneLinesSVG?: SVGElement = void 0 as any;

    public init(
        chart: Chart
    ): VBPIndicator {
        var indicator = this,
            params: VBPParamsOptions,
            baseSeries: LineSeries,
            volumeSeries: LineSeries;

        H.seriesTypes.sma.prototype.init.apply(indicator, arguments);

        params = (indicator.options.params as any);
        baseSeries = indicator.linkedParent;
        volumeSeries = (chart.get((params.volumeSeriesID as any)) as any);

        indicator.addCustomEvents(baseSeries, volumeSeries);

        return indicator;
    }

    // Adds events related with removing series
    public addCustomEvents(
        baseSeries: LineSeries,
        volumeSeries: LineSeries
    ): VBPIndicator {
        var indicator = this;

        /* eslint-disable require-jsdoc */
        function toEmptyIndicator(): void {
            indicator.chart.redraw();

            indicator.setData([]);
            indicator.zoneStarts = [];

            if (indicator.zoneLinesSVG) {
                indicator.zoneLinesSVG = indicator.zoneLinesSVG.destroy();
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
    }

    // Initial animation
    public animate(
        init: boolean
    ): void {
        var series = this,
            inverted = series.chart.inverted,
            group = series.group,
            attr: SVGAttributes = {},
            position;

        if (!init && group) {
            position = inverted ? series.yAxis.top : series.xAxis.left;
            if (inverted) {
                group['forceAnimate:translateY'] = true;
                attr.translateY = position;
            } else {
                group['forceAnimate:translateX'] = true;
                attr.translateX = position;
            }
            group.animate(
                attr,
                extend(animObject(series.options.animation), {
                    step: function (val: any, fx: any): void {
                        (series.group as any).attr({
                            scaleX: Math.max(0.001, fx.pos)
                        });
                    }
                })
            );

        }
    }

    public drawPoints(): void {
        var indicator = this;

        if ((indicator.options.volumeDivision as any).enabled) {
            indicator.posNegVolume(true, true);
            columnPrototype.drawPoints.apply(indicator, arguments);
            indicator.posNegVolume(false, false);
        }

        columnPrototype.drawPoints.apply(indicator, arguments);
    }

    // Function responsible for dividing volume into positive and negative
    public posNegVolume(
        initVol: boolean,
        pos: boolean
    ): void {
        var indicator = this,
            signOrder: Array<string> = pos ?
                ['positive', 'negative'] :
                ['negative', 'positive'],
            volumeDivision: VBPIndicator.VBPIndicatorStyleOptions = (
                indicator.options.volumeDivision as any
            ),
            pointLength: number = indicator.points.length,
            posWidths: Array<number> = [],
            negWidths: Array<number> = [],
            i = 0,
            pointWidth: number,
            priceZone: VBPIndicator.VBPIndicatorPriceZoneObject,
            wholeVol: number,
            point: VBPPoint;

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
    }

    public translate(): void {
        var indicator = this,
            options: VBPOptions = indicator.options,
            chart: Chart = indicator.chart,
            yAxis: AxisType = indicator.yAxis,
            yAxisMin: number = (yAxis.min as any),
            zoneLinesOptions: VBPIndicator.VBPIndicatorStyleOptions = (
                indicator.options.zoneLines as any
            ),
            priceZones: Array<VBPIndicator.VBPIndicatorPriceZoneObject> = (
                indicator.priceZones
            ),
            yBarOffset = 0,
            indicatorPoints: Array<VBPPoint>,
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
                    point: VBPPoint,
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
    }

    public getValues <TLinkedSeries extends LineSeries>(
        series: TLinkedSeries,
        params: VBPParamsOptions
    ): (IndicatorValuesObject<TLinkedSeries>|undefined) {
        var indicator = this,
            xValues: Array<number> = series.processedXData,
            yValues: Array<Array<number>> = (series.processedYData as any),
            chart = indicator.chart,
            ranges: number = (params.ranges as any),
            VBP: Array<Array<number>> = [],
            xData: Array<number> = [],
            yData: Array<number> = [],
            isOHLC: boolean,
            volumeSeries: LineSeries,
            priceZones: Array<VBPIndicator.VBPIndicatorPriceZoneObject>;

        // Checks if base series exists
        if (!series.chart) {
            error(
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
            error(
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
            error(
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
                zone: VBPIndicator.VBPIndicatorPriceZoneObject,
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
        } as IndicatorValuesObject<TLinkedSeries>;
    }

    // Specifing where each zone should start ans end
    public specifyZones(
        isOHLC: boolean,
        xValues: Array<number>,
        yValues: Array<Array<number>>,
        ranges: number,
        volumeSeries: LineSeries
    ): Array<VBPIndicator.VBPIndicatorPriceZoneObject> {
        var indicator = this,
            rangeExtremes: (boolean|Record<string, number>) = (
                isOHLC ? arrayExtremesOHLC(yValues) : false
            ),
            lowRange: number = rangeExtremes ?
                rangeExtremes.min :
                arrayMin(yValues),
            highRange: number = rangeExtremes ?
                rangeExtremes.max :
                arrayMax(yValues),
            zoneStarts: Array<number> = indicator.zoneStarts = [],
            priceZones: Array<VBPIndicator.VBPIndicatorPriceZoneObject> = [],
            i = 0,
            j = 1,
            rangeStep: number,
            zoneStartsLength: number;

        if (!lowRange || !highRange) {
            if (this.points.length) {
                this.setData([]);
                this.zoneStarts = [];
                if (this.zoneLinesSVG) {
                    this.zoneLinesSVG = this.zoneLinesSVG.destroy();
                }
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
    }

    // Calculating sum of volume values for a specific zone
    public volumePerZone(
        isOHLC: boolean,
        priceZones: Array<VBPIndicator.VBPIndicatorPriceZoneObject>,
        volumeSeries: LineSeries,
        xValues: Array<number>,
        yValues: Array<Array<number>>
    ): Array<VBPIndicator.VBPIndicatorPriceZoneObject> {
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
            function (zone: VBPIndicator.VBPIndicatorPriceZoneObject): void {
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
    }

    // Function responsoble for drawing additional lines indicating zones
    public drawZones(
        chart: Chart,
        yAxis: AxisType,
        zonesValues: Array<number>,
        zonesStyles: CSSObject
    ): void {
        var indicator = this,
            renderer: Highcharts.Renderer = chart.renderer,
            zoneLinesSVG = indicator.zoneLinesSVG,
            zoneLinesPath: SVGPath = [],
            leftLinePos = 0,
            rightLinePos: number = chart.plotWidth,
            verticalOffset: number = chart.plotTop,
            verticalLinePos: number;

        zonesValues.forEach(function (value: number): void {
            verticalLinePos = yAxis.toPixels(value) - verticalOffset;
            zoneLinesPath = zoneLinesPath.concat(chart.renderer.crispLine([[
                'M',
                leftLinePos,
                verticalLinePos
            ], [
                'L',
                rightLinePos,
                verticalLinePos
            ]], (zonesStyles.lineWidth as any)));
        });

        // Create zone lines one path or update it while animating
        if (zoneLinesSVG) {
            zoneLinesSVG.animate({
                d: zoneLinesPath
            });
        } else {
            zoneLinesSVG = indicator.zoneLinesSVG =
                renderer.path(zoneLinesPath).attr({
                    'stroke-width': (zonesStyles as any).lineWidth,
                    'stroke': zonesStyles.color,
                    'dashstyle': (zonesStyles as any).dashStyle,
                    'zIndex': (indicator.group as any).zIndex + 0.1
                })
                    .add(indicator.group);
        }
    }
}

/* *
 *
 *  Class Namespace
 *
 * */
namespace VBPIndicator {
    export interface VBPIndicatorPriceZoneObject {
        end: number;
        index: number;
        negativeVolumeData: number;
        positiveVolumeData: number;
        start: number;
        wholeVolumeData: number;
        x: number;
    }

    export interface VBPIndicatorStyleOptions {
        enabled?: boolean;
        styles?: CSSObject;
    }
}

interface VBPIndicator {
    nameBase: string;
    calculateOn: string;
    pointClass: typeof VBPPoint;

    crispCol: ColumnSeries['crispCol'];
    getColumnMetrics: ColumnSeries['getColumnMetrics'];
}

extend(VBPIndicator.prototype, {
    nameBase: 'Volume by Price',
    bindTo: {
        series: false,
        eventName: 'afterSetExtremes'
    },
    calculateOn: 'render',
    markerAttribs: (noop as any),
    drawGraph: (noop as any),
    getColumnMetrics: columnPrototype.getColumnMetrics,
    crispCol: columnPrototype.crispCol
});

declare module '../../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        vbp: typeof VBPIndicator;
    }
}

SeriesRegistry.registerSeriesType('vbp', VBPIndicator);

/* *
 *
 *  Default Export
 *
 * */

export default VBPIndicator;
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
