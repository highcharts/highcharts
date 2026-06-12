/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Axis from '../../Core/Axis/Axis';
import type AreaRangeSeriesOptions from './AreaRangeSeriesOptions';
import type { AreaRangeDataLabelOptions } from './AreaRangeSeriesOptions';
import type AreaPoint from '../Area/AreaPoint';
import type { DeepPartial } from '../../Shared/Types';
import type { PointMarkerOptions } from '../../Core/Series/PointOptions';
import type RadialAxis from '../../Core/Axis/RadialAxis';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';
import type { SymbolKey } from '../../Core/Renderer/SVG/SymbolType';

import AreaRangePoint from './AreaRangePoint.js';
import H from '../../Core/Globals.js';
const { noop } = H;
import RangeDataLabel from '../RangeDataLabel.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    area: AreaSeries,
    area: {
        prototype: areaProto
    }
} = SeriesRegistry.seriesTypes;
import {
    addEvent,
    defined,
    extend,
    isArray,
    isNumber,
    merge
} from '../../Shared/Utilities.js';

/* *
 *
 *  Constants
 *
 * */

/**
 * The area range series is a cartesian series with higher and lower values for
 * each point along an X axis, where the area between the values is shaded.
 *
 * @sample {highcharts} highcharts/demo/arearange/
 *         Area range chart
 * @sample {highstock} stock/demo/arearange/
 *         Area range chart
 *
 * @extends      plotOptions.area
 * @product      highcharts highstock
 * @excluding    stack, stacking
 * @requires     highcharts-more
 * @optionparent plotOptions.arearange
 *
 * @internal
 */
const areaRangeSeriesOptions: AreaRangeSeriesOptions = {

    /**
     * @see [fillColor](#plotOptions.arearange.fillColor)
     * @see [fillOpacity](#plotOptions.arearange.fillOpacity)
     *
     * @apioption plotOptions.arearange.color
     */

    /**
     * @default   low
     * @apioption plotOptions.arearange.colorKey
     */

    /**
     * @see [color](#plotOptions.arearange.color)
     * @see [fillOpacity](#plotOptions.arearange.fillOpacity)
     *
     * @apioption plotOptions.arearange.fillColor
     */

    /**
     * @see [color](#plotOptions.arearange.color)
     * @see [fillColor](#plotOptions.arearange.fillColor)
     *
     * @default   {highcharts} 0.75
     * @default   {highstock} 0.75
     * @apioption plotOptions.arearange.fillOpacity
     */


    /**
     * Whether to apply a drop shadow to the graph line. Since 2.3 the
     * shadow can be an object configuration containing `color`, `offsetX`,
     * `offsetY`, `opacity` and `width`.
     *
     * @type      {boolean|Highcharts.ShadowOptionsObject}
     * @product   highcharts
     * @apioption plotOptions.arearange.shadow
     */

    /**
     * Pixel width of the arearange graph line.
     *
     * @since 2.3.0
     *
     * @internal
     */
    lineWidth: 1,

    /**
     * @type {number|null}
     */
    threshold: null,

    tooltip: {
        pointFormat: '<span style="color:{series.color}">\u25CF</span> ' +
            '{series.name}: <b>{point.low}</b> - <b>{point.high}</b><br/>'
    },

    /**
     * Whether the whole area or just the line should respond to mouseover
     * tooltips and other mouse or touch events.
     *
     * @since 2.3.0
     *
     * @internal
     */
    trackByArea: true,

    /**
     * Extended data labels for range series types. Range series data
     * labels can be positioned individually by defining them as an array
     * and setting `alignToKey` to `high` or `low`.
     *
     * @declare Highcharts.SeriesAreaRangeDataLabelsOptionsObject
     * @since   2.3.0
     * @product highcharts highstock
     *
     * @internal
     */
    dataLabels: {

        align: void 0,

        formatter: RangeDataLabel.formatter,

        verticalAlign: void 0,

        /**
         * X offset of the lower data labels relative to the point value.
         *
         * Deprecated. Use a data labels array with `alignToKey: 'low'` and
         * the regular `x` option instead.
         *
         * @sample highcharts/plotoptions/arearange-datalabels/
         *         Data labels on range series
         * @sample highcharts/plotoptions/arearange-datalabels/
         *         Data labels on range series
         * @deprecated next
         */
        xLow: 0,

        /**
         * X offset of the higher data labels relative to the point value.
         *
         * Deprecated. Use a data labels array with `alignToKey: 'high'` and
         * the regular `x` option instead.
         *
         * @sample highcharts/plotoptions/arearange-datalabels/
         *         Data labels on range series
         * @deprecated next
         */
        xHigh: 0,

        /**
         * Y offset of the lower data labels relative to the point value.
         *
         * Deprecated. Use a data labels array with `alignToKey: 'low'` and
         * the regular `y` option instead.
         *
         * @sample highcharts/plotoptions/arearange-datalabels/
         *         Data labels on range series
         * @deprecated next
         */
        yLow: 0,

        /**
         * Y offset of the higher data labels relative to the point value.
         *
         * Deprecated. Use a data labels array with `alignToKey: 'high'` and
         * the regular `y` option instead.
         *
         * @sample highcharts/plotoptions/arearange-datalabels/
         *         Data labels on range series
         * @deprecated next
         */
        yHigh: 0

    }

};

/* *
 *
 *  Functions
 *
 * */

function getRangeDataLabelOptions(
    series: AreaRangeSeries
): Array<AreaRangeDataLabelOptions> {
    const dataLabels = series.options.dataLabels;

    if (isArray(dataLabels)) {
        return Array.from({
            length: Math.max(dataLabels.length, 2)
        }, (
            _,
            index
        ): AreaRangeDataLabelOptions => {
            const options = dataLabels[index],
                defaultAlignToKey = index === 0 ? 'high' :
                    index === 1 ? 'low' :
                        series.pointValKey,
                alignToKey = options?.alignToKey ?? defaultAlignToKey;

            return merge(
                options ?? { enabled: false },
                { alignToKey }
            );
        });
    }

    if (dataLabels?.alignToKey) {
        return [
            merge(
                dataLabels,
                dataLabels.alignToKey === 'high' ? {
                    x: dataLabels.xHigh,
                    y: dataLabels.yHigh
                } : dataLabels.alignToKey === 'low' ? {
                    x: dataLabels.xLow,
                    y: dataLabels.yLow
                } : {}
            )
        ];
    }

    return [
        merge(dataLabels, {
            alignToKey: 'high',
            x: dataLabels?.xHigh,
            y: dataLabels?.yHigh
        }),
        merge(dataLabels, {
            alignToKey: 'low',
            x: dataLabels?.xLow,
            y: dataLabels?.yLow
        })
    ];
}

/* *
 *
 *  Class
 *
 * */

/**
 * The AreaRange series type.
 *
 * @internal
 * @class
 * @name Highcharts.seriesTypes.arearange
 *
 * @augments Highcharts.Series
 */
class AreaRangeSeries extends AreaSeries {

    /**
     *
     *  Static Properties
     *
     */

    public static defaultOptions: AreaRangeSeriesOptions = merge(
        AreaSeries.defaultOptions,
        areaRangeSeriesOptions
    );

    /* *
     *
     *  Properties
     *
     * */

    public data!: Array<AreaRangePoint>;
    public options!: AreaRangeSeriesOptions;
    public points!: Array<AreaRangePoint>;
    public lowerStateMarkerGraphic?: SVGElement;
    public upperStateMarkerGraphic?: SVGElement;
    public xAxis!: Axis|RadialAxis.AxisComposition;

    /* *
     *
     *  Functions
     *
     * */

    public toYData(point: AreaRangePoint): Array<number> {
        return [point.low, point.high];
    }

    /**
     * Translate a point's plotHigh from the internal angle and radius measures
     * to true plotHigh coordinates. This is an addition of the toXY method
     * found in Polar.js, because it runs too early for arearange to be
     * considered (#3419).
     * @internal
     */
    public highToXY(point: AreaRangePoint): void {
        // Find the polar plotX and plotY
        const chart = this.chart,
            xy = (this.xAxis as RadialAxis.AxisComposition).postTranslate(
                point.rectPlotX || 0,
                this.yAxis.len - (point.plotHigh || 0)
            );

        point.plotHighX = xy.x - chart.plotLeft;
        point.plotHigh = xy.y - chart.plotTop;
        point.plotLowX = point.plotX;
    }

    /**
     * Extend the line series' getSegmentPath method by applying the segment
     * path to both lower and higher values of the range.
     * @internal
     */
    public getGraphPath(points: Array<AreaRangePoint>): SVGPath {

        const highPoints = [],
            highAreaPoints: Array<AreaPoint> = [],
            getGraphPath = areaProto.getGraphPath,
            options = this.options,
            polar = this.chart.polar,
            connectEnds = polar && options.connectEnds !== false,
            connectNulls = options.connectNulls;

        let i,
            point: AreaRangePoint,
            pointShim: any,
            step = options.step;

        points = points || this.points;

        // Create the top line and the top part of the area fill. The area fill
        // compensates for null points by drawing down to the lower graph,
        // moving across the null gap and starting again at the lower graph.
        i = points.length;
        while (i--) {
            point = points[i];

            // Support for polar
            const highAreaPoint = polar ? {
                plotX: point.rectPlotX,
                plotY: point.yBottom,
                doCurve: false // #5186, gaps in areasplinerange fill
            } : {
                plotX: point.plotX,
                plotY: point.plotY,
                doCurve: false // #5186, gaps in areasplinerange fill
            } as any;

            if (
                !point.isNull &&
                !connectEnds &&
                !connectNulls &&
                (!points[i + 1] || points[i + 1].isNull)
            ) {
                highAreaPoints.push(highAreaPoint);
            }

            pointShim = {
                polarPlotY: (point as any).polarPlotY,
                rectPlotX: point.rectPlotX,
                yBottom: point.yBottom,
                // `plotHighX` is for polar charts
                plotX: point.plotHighX ?? point.plotX,
                plotY: point.plotHigh,
                isNull: point.isNull
            };

            highAreaPoints.push(pointShim);

            highPoints.push(pointShim);

            if (
                !point.isNull &&
                !connectEnds &&
                !connectNulls &&
                (!points[i - 1] || points[i - 1].isNull)
            ) {
                highAreaPoints.push(highAreaPoint);
            }
        }

        // Get the paths
        const lowerPath = getGraphPath.call(this, points);
        if (step) {
            if ((step as any) === true) {
                step = 'left';
            }
            options.step = {
                left: 'right',
                center: 'center',
                right: 'left'
            }[step] as any; // Swap for reading in getGraphPath
        }
        const higherPath = getGraphPath.call(this, highPoints);
        const higherAreaPath = getGraphPath.call(this, highAreaPoints);
        options.step = step;

        // Create a line on both top and bottom of the range
        const linePath: SVGPath = ([] as SVGPath).concat(lowerPath, higherPath);

        // For the area path, we need to change the 'move' statement into
        // 'lineTo'
        if (
            !this.chart.polar &&
            higherAreaPath[0] &&
            higherAreaPath[0][0] === 'M'
        ) {
            // This probably doesn't work for spline
            higherAreaPath[0] = [
                'L',
                higherAreaPath[0][1],
                higherAreaPath[0][2]
            ];
        }

        this.graphPath = linePath;
        this.areaPath = lowerPath.concat(higherAreaPath);

        // Prepare for sideways animation
        linePath.isArea = true;
        linePath.xMap = lowerPath.xMap;
        this.areaPath.xMap = lowerPath.xMap;

        return linePath;
    }

    public drawDataLabels(): void {
        const series = this,
            dataLabelOptions = series.options.dataLabels;

        if (dataLabelOptions) {
            series.options.dataLabels = getRangeDataLabelOptions(series);

            if (areaProto.drawDataLabels) {
                // #1209
                areaProto.drawDataLabels.call(series);
            }
            series.options.dataLabels = dataLabelOptions;

            for (const point of series.points) {
                const labels = point.dataLabels ?? [];

                point.dataLabelUpper = labels.find((label): boolean => (
                    RangeDataLabel.resolveAlignToKey(
                        series,
                        (label.options as AreaRangeDataLabelOptions|undefined)
                            ?.alignToKey
                    ) === 'high'
                ));
                point.dataLabel = labels.find((label): boolean => (
                    RangeDataLabel.resolveAlignToKey(
                        series,
                        (label.options as AreaRangeDataLabelOptions|undefined)
                            ?.alignToKey
                    ) === 'low'
                ));
            }
        }
    }

    public modifyMarkerSettings(): {
        marker?: PointMarkerOptions;
        symbol?: SymbolKey;
    } {
        const series = this,
            originalMarkerSettings = {
                marker: series.options.marker,
                symbol: series.symbol
            };

        if (series.options.lowMarker) {
            const {
                options: { marker, lowMarker }
            } = series;

            series.options.marker = merge(marker, lowMarker);

            if (lowMarker.symbol) {
                series.symbol = lowMarker.symbol;
            }
        }

        return originalMarkerSettings;
    }

    public restoreMarkerSettings(originalSettings: {
        marker?: PointMarkerOptions;
        symbol?: SymbolKey;
    }): void {
        const series = this;

        series.options.marker = originalSettings.marker;
        series.symbol = originalSettings.symbol;
    }

    public drawPoints(): void {
        const series = this,
            pointLength = series.points.length;

        let i: number,
            point: AreaRangePoint;

        const originalSettings = series.modifyMarkerSettings();

        // Draw bottom points
        areaProto.drawPoints.apply(series, arguments);

        // Restore previous state
        series.restoreMarkerSettings(originalSettings);

        // Prepare drawing top points
        i = 0;
        while (i < pointLength) {
            point = series.points[i];
            point.graphics = point.graphics || [];

            // Save original props to be overridden by temporary props for top
            // points
            point.origProps = {
                plotY: point.plotY,
                plotX: point.plotX,
                isInside: point.isInside,
                negative: point.negative,
                zone: point.zone,
                y: point.y
            };

            if (point.graphic || point.graphics[0]) {
                point.graphics[0] = point.graphic;
            }

            point.graphic = point.graphics[1];
            point.plotY = point.plotHigh;
            if (defined(point.plotHighX)) {
                point.plotX = point.plotHighX;
            }
            point.y = point.high ?? point.origProps.y; // #15523
            point.negative = point.y < (series.options.threshold || 0);
            if (series.zones.length) {
                point.zone = point.getZone();
            }

            if (!series.chart.polar) {
                point.isInside = point.isTopInside = (
                    typeof point.plotY !== 'undefined' &&
                    point.plotY >= 0 &&
                    point.plotY <= series.yAxis.len && // #3519
                    point.plotX >= 0 &&
                    point.plotX <= series.xAxis.len
                );
            }
            i++;
        }

        // Draw top points
        areaProto.drawPoints.apply(series, arguments);

        // Reset top points preliminary modifications
        i = 0;
        while (i < pointLength) {
            point = series.points[i];
            point.graphics = point.graphics || [];

            if (point.graphic || point.graphics[1]) {
                point.graphics[1] = point.graphic;
            }
            point.graphic = point.graphics[0];
            if (point.origProps) {
                extend(point, point.origProps);
                delete point.origProps;
            }
            i++;
        }
    }

    public hasMarkerChanged(
        options: DeepPartial<AreaRangeSeriesOptions>,
        oldOptions: DeepPartial<AreaRangeSeriesOptions>
    ): boolean | undefined {
        const lowMarker = options.lowMarker,
            oldMarker = oldOptions.lowMarker || {};

        return (lowMarker && (
            lowMarker.enabled === false ||
            oldMarker.symbol !== lowMarker.symbol || // #10870, #15946
            oldMarker.height !== lowMarker.height || // #16274
            oldMarker.width !== lowMarker.width // #16274
        )) || super.hasMarkerChanged(options, oldOptions);
    }
}

addEvent(AreaRangeSeries, 'afterTranslate', function (): void {

    // Set plotLow and plotHigh

    // Rules out lollipop, but lollipop should not inherit range series in the
    // first place
    if (this.pointArrayMap.join(',') === 'low,high') {
        this.points.forEach((point): void => {
            const high = point.high,
                plotY = point.plotY;

            if (point.isNull) {
                point.plotY = void 0;
            } else {
                point.plotLow = plotY;

                // Calculate plotHigh value based on each yAxis scale (#15752)
                point.plotHigh = isNumber(high) ? this.yAxis.translate(
                    this.dataModify ?
                        this.dataModify.modifyValue(high) : high,
                    false,
                    true,
                    void 0,
                    true
                ) : void 0;

                if (this.dataModify) {
                    point.yBottom = point.plotHigh;
                }
            }
        });
    }
}, { order: 0 });

addEvent(AreaRangeSeries, 'afterTranslate', function (): void {
    this.points.forEach((point): void => {
        // Postprocessing after the PolarComposition's afterTranslate
        if (this.chart.polar) {
            this.highToXY(point);
            point.plotLow = point.plotY;
            point.tooltipPos = [
                ((point.plotHighX || 0) + (point.plotLowX || 0)) / 2,
                ((point.plotHigh || 0) + (point.plotLow || 0)) / 2
            ];

        // Put the tooltip in the middle of the range
        } else {
            const tooltipPos = point.pos(false, point.plotLow),
                posHigh = point.pos(false, point.plotHigh);

            if (tooltipPos && posHigh) {
                tooltipPos[0] = (tooltipPos[0] + posHigh[0]) / 2;
                tooltipPos[1] = (tooltipPos[1] + posHigh[1]) / 2;
            }
            point.tooltipPos = tooltipPos;
        }


    });
}, { order: 3 });

/* *
 *
 *  Class Prototype
 *
 * */

/** @internal */
interface AreaRangeSeries {
    deferTranslatePolar: boolean;
    pointArrayMap: Array<string>;
    pointClass: typeof AreaRangePoint;
    pointValKey: string;
}

extend(AreaRangeSeries.prototype, {
    deferTranslatePolar: true,
    pointArrayMap: ['low', 'high'],
    pointClass: AreaRangePoint,
    pointValKey: 'low',
    setStackedPoints: noop
});

RangeDataLabel.compose(AreaRangeSeries);

/* *
 *
 *  Registry
 *
 * */

/** @internal */
declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        arearange: typeof AreaRangeSeries;
    }
}

SeriesRegistry.registerSeriesType('arearange', AreaRangeSeries);


/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default AreaRangeSeries;
