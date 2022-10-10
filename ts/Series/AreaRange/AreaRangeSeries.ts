/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type AreaRangeDataLabelOptions from './AreaRangeDataLabelOptions';
import type {
    AreaRangeSeriesOptions,
    AreaRangeSeriesPlotOptions
} from './AreaRangeSeriesOptions';
import type AreaPoint from '../Area/AreaPoint';
import type RadialAxis from '../../Core/Axis/RadialAxis';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';

import AreaRangePoint from './AreaRangePoint.js';
import AreaRangeSeriesDefaults from './AreaRangeSeriesDefaults.js';
import H from '../../Core/Globals.js';
const { noop } = H;
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    area: AreaSeries,
    area: {
        prototype: areaProto
    },
    column: {
        prototype: columnProto
    }
} = SeriesRegistry.seriesTypes;
import U from '../../Core/Utilities.js';
const {
    addEvent,
    defined,
    extend,
    isArray,
    isNumber,
    pick,
    merge
} = U;

/* *
 *
 *  Constants
 *
 * */

/* *
 *
 *  Class
 *
 * */

/**
 * The AreaRange series type.
 *
 * @private
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

    public static defaultOptions: AreaRangeSeriesPlotOptions = merge(
        AreaSeries.defaultOptions,
        AreaRangeSeriesDefaults
    );

    /* *
     *
     *  Properties
     *
     * */

    public data: Array<AreaRangePoint> = void 0 as any;
    public options: AreaRangeSeriesOptions = void 0 as any;
    public points: Array<AreaRangePoint> = void 0 as any;
    public lowerStateMarkerGraphic?: SVGElement = void 0;
    public upperStateMarkerGraphic?: SVGElement;
    public xAxis: RadialAxis.AxisComposition = void 0 as any;

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
     * found in Polar.js, because it runs too early for arearanges to be
     * considered (#3419).
     * @private
     */
    public highToXY(point: AreaRangePoint): void {
        // Find the polar plotX and plotY
        const chart = this.chart,
            xy = this.xAxis.postTranslate(
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
     * @private
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
                // plotHighX is for polar charts
                plotX: pick(point.plotHighX, point.plotX),
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
            }[step] as any; // swap for reading in getGraphPath
        }
        const higherPath = getGraphPath.call(this, highPoints);
        const higherAreaPath = getGraphPath.call(this, highAreaPoints);
        options.step = step;

        // Create a line on both top and bottom of the range
        const linePath = ([] as SVGPath).concat(lowerPath, higherPath);

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
        (linePath as any).isArea = true;
        (linePath as any).xMap = lowerPath.xMap;
        this.areaPath.xMap = lowerPath.xMap;

        return linePath;
    }

    /**
     * Extend the basic drawDataLabels method by running it for both lower and
     * higher values.
     * @private
     */
    public drawDataLabels(): void {

        const data = this.points,
            length = data.length,
            originalDataLabels = [],
            dataLabelOptions = this.options.dataLabels,
            inverted = this.chart.inverted;

        let i: number,
            point: AreaRangePoint,
            up: boolean,
            upperDataLabelOptions: AreaRangeDataLabelOptions,
            lowerDataLabelOptions: AreaRangeDataLabelOptions;

        if (dataLabelOptions) {
            // Split into upper and lower options. If data labels is an array,
            // the first element is the upper label, the second is the lower.
            //
            // TODO: We want to change this and allow multiple labels for both
            // upper and lower values in the future - introducing some options
            // for which point value to use as Y for the dataLabel, so that this
            // could be handled in Series.drawDataLabels. This would also
            // improve performance since we now have to loop over all the points
            // multiple times to work around the data label logic.
            if (isArray(dataLabelOptions)) {
                upperDataLabelOptions = dataLabelOptions[0] || {
                    enabled: false
                };
                lowerDataLabelOptions = dataLabelOptions[1] || {
                    enabled: false
                };
            } else {
                // Make copies
                upperDataLabelOptions = extend({}, dataLabelOptions);
                upperDataLabelOptions.x = dataLabelOptions.xHigh;
                upperDataLabelOptions.y = dataLabelOptions.yHigh;
                lowerDataLabelOptions = extend({}, dataLabelOptions);
                lowerDataLabelOptions.x = dataLabelOptions.xLow;
                lowerDataLabelOptions.y = dataLabelOptions.yLow;
            }

            // Draw upper labels
            if (upperDataLabelOptions.enabled || this._hasPointLabels) {
                // Set preliminary values for plotY and dataLabel
                // and draw the upper labels
                i = length;
                while (i--) {
                    point = data[i];
                    if (point) {
                        const { plotHigh = 0, plotLow = 0 } = point;
                        up = upperDataLabelOptions.inside ?
                            plotHigh < plotLow :
                            plotHigh > plotLow;

                        point.y = point.high;
                        point._plotY = point.plotY;
                        point.plotY = plotHigh;

                        // Store original data labels and set preliminary label
                        // objects to be picked up in the uber method
                        originalDataLabels[i] = point.dataLabel;
                        point.dataLabel = point.dataLabelUpper;

                        // Set the default offset
                        point.below = up;
                        if (inverted) {
                            if (!upperDataLabelOptions.align) {
                                upperDataLabelOptions.align = up ?
                                    'right' : 'left';
                            }
                        } else {
                            if (!upperDataLabelOptions.verticalAlign) {
                                upperDataLabelOptions.verticalAlign = up ?
                                    'top' :
                                    'bottom';
                            }
                        }
                    }
                }

                this.options.dataLabels = upperDataLabelOptions;

                if (areaProto.drawDataLabels) {
                    // #1209:
                    areaProto.drawDataLabels.apply(this, arguments);
                }

                // Reset state after the upper labels were created. Move
                // it to point.dataLabelUpper and reassign the originals.
                // We do this here to support not drawing a lower label.
                i = length;
                while (i--) {
                    point = data[i];
                    if (point) {
                        point.dataLabelUpper = point.dataLabel;
                        point.dataLabel = originalDataLabels[i];
                        delete point.dataLabels;
                        point.y = point.low;
                        point.plotY = point._plotY;
                    }
                }
            }

            // Draw lower labels
            if (lowerDataLabelOptions.enabled || this._hasPointLabels) {
                i = length;
                while (i--) {
                    point = data[i];
                    if (point) {
                        const { plotHigh = 0, plotLow = 0 } = point;
                        up = lowerDataLabelOptions.inside ?
                            plotHigh < plotLow :
                            plotHigh > plotLow;

                        // Set the default offset
                        point.below = !up;
                        if (inverted) {
                            if (!lowerDataLabelOptions.align) {
                                lowerDataLabelOptions.align = up ?
                                    'left' : 'right';
                            }
                        } else {
                            if (!lowerDataLabelOptions.verticalAlign) {
                                lowerDataLabelOptions.verticalAlign = up ?
                                    'bottom' :
                                    'top';
                            }
                        }
                    }
                }

                this.options.dataLabels = lowerDataLabelOptions;

                if (areaProto.drawDataLabels) {
                    areaProto.drawDataLabels.apply(this, arguments);
                }
            }

            // Merge upper and lower into point.dataLabels for later destroying
            if (upperDataLabelOptions.enabled) {
                i = length;
                while (i--) {
                    point = data[i];
                    if (point) {
                        point.dataLabels = [
                            point.dataLabelUpper as any,
                            point.dataLabel
                        ].filter(function (
                            label: (SVGElement|undefined)
                        ): boolean {
                            return !!label;
                        });
                    }
                }
            }

            // Reset options
            this.options.dataLabels = dataLabelOptions;
        }
    }

    public alignDataLabel(): void {
        columnProto.alignDataLabel.apply(this, arguments);
    }

    public drawPoints(): void {
        const series = this,
            pointLength = series.points.length;

        let i: number,
            point: AreaRangePoint;

        // Draw bottom points
        areaProto.drawPoints.apply(series, arguments);

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

            if (point.graphic) {
                point.graphics[0] = point.graphic;
            }
            point.graphic = point.graphics[1];
            point.plotY = point.plotHigh;
            if (defined(point.plotHighX)) {
                point.plotX = point.plotHighX;
            }
            point.y = pick(point.high, point.origProps.y); // #15523
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
            if (point.graphic) {
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

        // Postprocess plotHigh
        if (this.chart.polar) {
            this.points.forEach((point): void => {
                this.highToXY(point);
                point.tooltipPos = [
                    ((point.plotHighX || 0) + (point.plotLowX || 0)) / 2,
                    ((point.plotHigh || 0) + (point.plotLow || 0)) / 2
                ];
            });
        }
    }
}, { order: 0 });

/* *
 *
 *  Class Prototype
 *
 * */

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


/* *
 *
 *  Registry
 *
 * */

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

export default AreaRangeSeries;
