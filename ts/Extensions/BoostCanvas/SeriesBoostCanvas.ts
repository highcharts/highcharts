/* *
 *
 *  License: www.highcharts.com/license
 *  Author: Torstein Honsi, Christer Vasseng
 *
 *  This module serves as a fallback for the Boost module in IE9 and IE10. Newer
 *  browsers support WebGL which is faster.
 *
 *  It is recommended to include this module in conditional comments targeting
 *  IE9 and IE10.
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

import type BoostTargetObject from '../Boost/BoostTargetObject';
import type {
    PointOptions,
    PointShortOptions
} from '../../Core/Series/PointOptions';
import type Series from '../../Core/Series/Series';

import BCU from './BoostCanvasUtilities.js';
import Chart from '../../Core/Chart/Chart.js';
import Color from '../../Core/Color/Color.js';
const { parse: color } = Color;
import G from '../../Core/Globals.js';
const {
    doc,
    noop
} = G;
import { Palette } from '../../Core/Color/Palettes.js';
import U from '../../Core/Utilities.js';
const {
    addEvent,
    extend,
    fireEvent,
    isNumber,
    merge,
    pick,
    wrap
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../Boost/BoostOptions' {
    interface BoostOptions {
        timeRendering?: boolean;
        timeSeriesProcessing?: boolean;
        timeSetup?: boolean;
    }
}

declare module '../Boost/BoostTargetObject' {
    interface BoostTargetObject {
        ctx?: (CanvasRenderingContext2D|null);
    }
}

declare module '../../Core/Series/SeriesLike' {
    interface SeriesLike extends BoostTargetObject {
        boostCanvas?: SeriesBoostCanvas.Additions;
    }
}

/* *
 *
 *  Composition
 *
 * */

namespace SeriesBoostCanvas {

    /* *
     *
     *  Declarations
     *
     * */

    export declare class Composition extends Series {
        boostCanvas: Additions;
    }

    /* *
     *
     *  Constants
     *
     * */

    export const CHUNK_SIZE = 50000;

    const composedClasses: Array<Function> = [];

    /* *
     *
     *  Variables
     *
     * */

    let destroyLoadingDiv: number;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * @private
     */
    export function compose(
        SeriesClass: typeof Series
    ): typeof Composition {

        if (composedClasses.indexOf(SeriesClass) === -1) {
            composedClasses.push(SeriesClass);

            addEvent(SeriesClass, 'destroy', onDestroy);
            addEvent(SeriesClass, 'init', onInit);
        }

        return SeriesClass as typeof Composition;
    }

    /**
     * @private
     */
    function onDestroy(
        this: Series
    ): void {
        if (this.boostCanvas) {
            this.boostCanvas.destroy();
        }
    }

    /**
     * @private
     */
    function onInit(
        this: Series
    ): void {
        const series = this as Composition;

        if (!series.boostCanvas) {
            series.boostCanvas = new Additions(series);
        }
    }

    /* *
     *
     *  Classes
     *
     * */

    export class Additions {

        /* *
         *
         *  Constructors
         *
         * */

        public constructor(series: Composition) {
            this.series = series;
        }

        /* *
         *
         *  Properties
         *
         * */

        public cvsStrokeBatch?: number;

        public fill?: boolean;

        public series: Composition;

        /* *
         *
         *  Functions
         *
         * */

        /**
         * Draw the canvas image inside an SVG image
         */
        public canvasToSVG(): void {
            const series = this.series;

            if (!series.chart.isChartSeriesBoosting()) {
                if (series.boostCopy || series.chart.boostCopy) {
                    (series.boostCopy || series.chart.boostCopy)();
                }
            } else {
                if (series.boostClear) {
                    series.boostClear();
                }
            }
        }

        public cvsDrawPoint?(
            ctx: CanvasRenderingContext2D,
            clientX: number,
            plotY: number,
            yBottom: number,
            lastPoint?: Record<string, number>
        ): void;

        public cvsLineTo(
            ctx: CanvasRenderingContext2D,
            clientX: number,
            plotY: number
        ): void {
            ctx.lineTo(clientX, plotY);
        }

        public cvsMarkerCircle?(
            ctx: CanvasRenderingContext2D,
            clientX: number,
            plotY: number,
            r: number,
            i?: number
        ): void;

        public cvsMarkerSquare?(
            ctx: CanvasRenderingContext2D,
            clientX: number,
            plotY: number,
            r: number
        ): void;

        public destroy(): void {
            this.series = void 0 as any;
        }

        /**
         * Create a hidden canvas to draw the graph on. The contents is later
         * copied over to an SVG image element.
         */
        public getContext(): (CanvasRenderingContext2D|null|undefined) {
            const series = this.series,
                chart = series.chart,
                width = chart.chartWidth,
                height = chart.chartHeight,
                swapXY = function (
                    this: CanvasRenderingContext2D,
                    proceed: Function,
                    x: number,
                    y: number,
                    a?: number,
                    b?: number,
                    c?: number,
                    d?: boolean
                ): void {
                    proceed.call(this, y, x, a, b, c, d);
                };

            let targetGroup = chart.seriesGroup || series.group,
                target: BoostTargetObject = series,
                ctx: (CanvasRenderingContext2D|null|undefined);

            if (chart.isChartSeriesBoosting()) {
                target = chart as any;
                targetGroup = chart.seriesGroup;
            }

            ctx = target.ctx;

            if (!target.canvas) {
                target.canvas = doc.createElement('canvas');

                target.renderTarget = chart.renderer
                    .image('', 0, 0, width, height)
                    .addClass('highcharts-boost-canvas')
                    .add(targetGroup);

                target.ctx = ctx = target.canvas.getContext('2d');

                if (chart.inverted) {
                    ['moveTo', 'lineTo', 'rect', 'arc'].forEach(function (
                        fn: string
                    ): void {
                        wrap(ctx, fn, swapXY);
                    });
                }

                target.boostCopy = function (): void {
                    (target.renderTarget as any).attr({
                        href: (target.canvas as any).toDataURL('image/png')
                    });
                };

                target.boostClear = function (): void {
                    (ctx as any).clearRect(
                        0,
                        0,
                        (target.canvas as any).width,
                        (target.canvas as any).height
                    );

                    if (target === this) {
                        (target.renderTarget as any).attr({ href: '' });
                    }
                };

                target.boostClipRect = chart.renderer.clipRect();

                target.renderTarget.clip(target.boostClipRect);

            } else if (!(target instanceof Chart)) {
                // ctx.clearRect(0, 0, width, height);
            }

            if ((target.canvas as any).width !== width) {
                (target.canvas as any).width = width;
            }

            if ((target.canvas as any).height !== height) {
                (target.canvas as any).height = height;
            }

            (target.renderTarget as any).attr({
                x: 0,
                y: 0,
                width: width,
                height: height,
                style: 'pointer-events: none',
                href: ''
            });

            (target.boostClipRect as any).attr(chart.getBoostClipRect(target));

            return ctx;
        }

        public renderCanvas(): void {
            let series = this.series,
                options = series.options,
                chart = series.chart,
                xAxis = series.xAxis,
                yAxis = series.yAxis,
                activeBoostSettings = chart.options.boost || {},
                boostSettings = {
                    timeRendering: activeBoostSettings.timeRendering || false,
                    timeSeriesProcessing:
                        activeBoostSettings.timeSeriesProcessing || false,
                    timeSetup: activeBoostSettings.timeSetup || false
                },
                ctx: (CanvasRenderingContext2D|null|undefined),
                c = 0,
                xData = series.processedXData,
                yData = series.processedYData,
                rawData: Array<(PointOptions|PointShortOptions)> = options.data as any,
                xExtremes = xAxis.getExtremes(),
                xMin = xExtremes.min,
                xMax = xExtremes.max,
                yExtremes = yAxis.getExtremes(),
                yMin = yExtremes.min,
                yMax = yExtremes.max,
                pointTaken: Record<string, boolean> = {},
                lastClientX: number,
                sampling = !!series.sampling,
                points: Array<Record<string, number>>,
                r = options.marker && options.marker.radius,
                cvsDrawPoint = this.cvsDrawPoint,
                cvsLineTo = options.lineWidth ? this.cvsLineTo : void 0,
                cvsMarker: (typeof this['cvsMarkerCircle']) = (
                    r && r <= 1 ?
                        this.cvsMarkerSquare :
                        this.cvsMarkerCircle
                ),
                strokeBatch = this.cvsStrokeBatch || 1000,
                enableMouseTracking = options.enableMouseTracking !== false,
                lastPoint: Record<string, number>,
                threshold: number = options.threshold as any,
                yBottom: number = yAxis.getThreshold(threshold) as any,
                hasThreshold = isNumber(threshold),
                translatedThreshold: number = yBottom as any,
                doFill = this.fill,
                isRange = (
                    series.pointArrayMap &&
                    series.pointArrayMap.join(',') === 'low,high'
                ),
                isStacked = !!options.stacking,
                cropStart = series.cropStart || 0,
                loadingOptions = chart.options.loading,
                requireSorting = series.requireSorting,
                wasNull: boolean,
                connectNulls = options.connectNulls,
                useRaw = !xData,
                minVal: number,
                maxVal: number,
                minI: (number|undefined),
                maxI: (number|undefined),
                index: (number|string),
                sdata: Array<any> = (
                    isStacked ?
                        series.data :
                        (xData || rawData)
                ),
                fillColor = (
                    series.fillOpacity ?
                        Color.parse(series.color).setOpacity(
                            pick((options as any).fillOpacity, 0.75)
                        ).get() :
                        series.color
                ),
                //
                stroke = function (): void {
                    if (doFill) {
                        (ctx as any).fillStyle = fillColor as any;
                        (ctx as any).fill();
                    } else {
                        (ctx as any).strokeStyle = series.color as any;
                        (ctx as any).lineWidth = options.lineWidth as any;
                        (ctx as any).stroke();
                    }
                },
                //
                drawPoint = function (
                    clientX: number,
                    plotY: number,
                    yBottom: number,
                    i: number
                ): void {
                    if (c === 0) {
                        (ctx as any).beginPath();

                        if (cvsLineTo) {
                            (ctx as any).lineJoin = 'round';
                        }
                    }

                    if (
                        chart.scroller &&
                        series.options.className ===
                            'highcharts-navigator-series'
                    ) {
                        plotY += chart.scroller.top;
                        if (yBottom) {
                            yBottom += chart.scroller.top;
                        }
                    } else {
                        plotY += chart.plotTop;
                    }

                    clientX += chart.plotLeft;

                    if (wasNull) {
                        (ctx as any).moveTo(clientX, plotY);
                    } else {
                        if (cvsDrawPoint) {
                            cvsDrawPoint(
                                ctx as any,
                                clientX,
                                plotY,
                                yBottom,
                                lastPoint
                            );
                        } else if (cvsLineTo) {
                            cvsLineTo(ctx as any, clientX, plotY);
                        } else if (cvsMarker) {
                            cvsMarker.call(
                                series,
                                ctx as any,
                                clientX,
                                plotY,
                                r as any,
                                i
                            );
                        }
                    }

                    // We need to stroke the line for every 1000 pixels. It will
                    // crash the browser memory use if we stroke too
                    // infrequently.
                    c = c + 1;
                    if (c === strokeBatch) {
                        stroke();
                        c = 0;
                    }

                    // Area charts need to keep track of the last point
                    lastPoint = {
                        clientX: clientX,
                        plotY: plotY,
                        yBottom: yBottom
                    };
                },
                //
                compareX = options.findNearestPointBy === 'x',
                //
                xDataFull: Array<number> = (
                    series.xData ||
                    (series.options as any).xData ||
                    series.processedXData ||
                    false
                ),
                //
                addKDPoint = function (
                    clientX: number,
                    plotY: number,
                    i: number
                ): void {
                    // Shaves off about 60ms compared to repeated concatenation
                    index = compareX ? clientX : clientX + ',' + plotY;

                    // The k-d tree requires series points.
                    // Reduce the amount of points, since the time to build the
                    // tree increases exponentially.
                    if (enableMouseTracking && !pointTaken[index]) {
                        pointTaken[index] = true;

                        if (chart.inverted) {
                            clientX = xAxis.len - clientX;
                            plotY = yAxis.len - plotY;
                        }

                        points.push({
                            x: xDataFull ?
                                xDataFull[cropStart + i] :
                                (false as any),
                            clientX: clientX,
                            plotX: clientX,
                            plotY: plotY,
                            i: cropStart + i
                        });
                    }
                };

            if (series.renderTarget) {
                series.renderTarget.attr({ 'href': '' });
            }

            // If we are zooming out from SVG mode, destroy the graphics
            if (series.points || series.graph) {
                series.destroyGraphics();
            }

            // The group
            series.plotGroup(
                'group',
                'series',
                series.visible ? 'visible' : 'hidden',
                options.zIndex,
                chart.seriesGroup
            );

            series.markerGroup = series.group;
            addEvent(series, 'destroy', function (): void {
                // Prevent destroy twice
                series.markerGroup = null as any;
            });

            points = series.points = [];
            ctx = this.getContext();
            series.buildKDTree = noop; // Do not start building while drawing

            if (series.boostClear) {
                series.boostClear();
            }

            // if (this.canvas) {
            //     ctx.clearRect(
            //         0,
            //         0,
            //         this.canvas.width,
            //         this.canvas.height
            //     );
            // }

            if (!series.visible) {
                return;
            }

            // Display a loading indicator
            if (rawData.length > 99999) {
                chart.options.loading = merge(loadingOptions, {
                    labelStyle: {
                        backgroundColor: color(
                            Palette.backgroundColor
                        ).setOpacity(0.75).get(),
                        padding: '1em',
                        borderRadius: '0.5em'
                    },
                    style: {
                        backgroundColor: 'none',
                        opacity: 1
                    }
                });
                U.clearTimeout(destroyLoadingDiv);
                chart.showLoading('Drawing...');
                chart.options.loading = loadingOptions; // reset
            }

            if (boostSettings.timeRendering) {
                console.time('canvas rendering'); // eslint-disable-line no-console
            }

            // Loop over the points
            BCU.eachAsync(sdata, function (d: any, i: number): boolean {
                let x: number,
                    y: number,
                    clientX: number,
                    plotY: number,
                    isNull: boolean,
                    low: (number|undefined),
                    isNextInside = false,
                    isPrevInside = false,
                    nx: number = false as any,
                    px: number = false as any,
                    chartDestroyed = typeof chart.index === 'undefined',
                    isYInside = true;

                if (!chartDestroyed) {
                    if (useRaw) {
                        x = d[0];
                        y = d[1];

                        if (sdata[i + 1]) {
                            nx = sdata[i + 1][0];
                        }

                        if (sdata[i - 1]) {
                            px = sdata[i - 1][0];
                        }
                    } else {
                        x = d;
                        y = yData[i] as any;

                        if (sdata[i + 1]) {
                            nx = sdata[i + 1];
                        }

                        if (sdata[i - 1]) {
                            px = sdata[i - 1];
                        }
                    }

                    if (nx && nx >= xMin && nx <= xMax) {
                        isNextInside = true;
                    }

                    if (px && px >= xMin && px <= xMax) {
                        isPrevInside = true;
                    }

                    // Resolve low and high for range series
                    if (isRange) {
                        if (useRaw) {
                            y = d.slice(1, 3);
                        }
                        low = (y as any)[0];
                        y = (y as any)[1];
                    } else if (isStacked) {
                        x = d.x;
                        y = d.stackY;
                        low = y - d.y;
                    }

                    isNull = y === null;

                    // Optimize for scatter zooming
                    if (!requireSorting) {
                        isYInside = y >= yMin && y <= yMax;
                    }

                    if (!isNull &&
                        (
                            (x >= xMin && x <= xMax && isYInside) ||
                            (isNextInside || isPrevInside)
                        )) {


                        clientX = Math.round(xAxis.toPixels(x, true));

                        if (sampling) {
                            if (
                                typeof minI === 'undefined' ||
                                clientX === lastClientX
                            ) {
                                if (!isRange) {
                                    low = y;
                                }
                                if (typeof maxI === 'undefined' || y > maxVal) {
                                    maxVal = y;
                                    maxI = i;
                                }
                                if (
                                    typeof minI === 'undefined' ||
                                    (low as any) < minVal
                                ) {
                                    minVal = low as any;
                                    minI = i;
                                }

                            }
                            // Add points and reset
                            if (clientX !== lastClientX) {
                                // maxI also a number:
                                if (typeof minI !== 'undefined') {
                                    plotY = yAxis.toPixels(maxVal, true);
                                    yBottom = yAxis.toPixels(minVal, true);
                                    drawPoint(
                                        clientX,
                                        hasThreshold ?
                                            Math.min(
                                                plotY,
                                                translatedThreshold
                                            ) : plotY,
                                        hasThreshold ?
                                            Math.max(
                                                yBottom,
                                                translatedThreshold
                                            ) : yBottom,
                                        i
                                    );
                                    addKDPoint(clientX, plotY, maxI as any);
                                    if (yBottom !== plotY) {
                                        addKDPoint(clientX, yBottom, minI);
                                    }
                                }

                                minI = maxI = void 0;
                                lastClientX = clientX;
                            }
                        } else {
                            plotY = Math.round(yAxis.toPixels(y, true));
                            drawPoint(clientX, plotY, yBottom, i);
                            addKDPoint(clientX, plotY, i);
                        }
                    }
                    wasNull = isNull && !connectNulls;

                    if (i % CHUNK_SIZE === 0) {
                        if (series.boostCopy || series.chart.boostCopy) {
                            (series.boostCopy || series.chart.boostCopy)();
                        }
                    }
                }

                return !chartDestroyed;
            }, function (): void {
                const loadingDiv: HTMLElement =
                        chart.loadingDiv as any,
                    loadingShown = chart.loadingShown;

                stroke();

                // if (series.boostCopy || series.chart.boostCopy) {
                //     (series.boostCopy || series.chart.boostCopy)();
                // }

                series.boostCanvas.canvasToSVG();

                if (boostSettings.timeRendering) {
                    console.timeEnd('canvas rendering'); // eslint-disable-line no-console
                }

                fireEvent(series, 'renderedCanvas');

                // Do not use chart.hideLoading, as it runs JS animation and
                // will be blocked by buildKDTree. CSS animation looks good, but
                // then it must be deleted in timeout. If we add the module to
                // core, change hideLoading so we can skip this block.
                if (loadingShown) {
                    extend(loadingDiv.style, {
                        transition: 'opacity 250ms',
                        opacity: 0 as any
                    });
                    chart.loadingShown = false;
                    destroyLoadingDiv = setTimeout(function (): void {
                        if (loadingDiv.parentNode) { // In exporting it is falsy
                            loadingDiv.parentNode.removeChild(loadingDiv);
                        }
                        chart.loadingDiv = chart.loadingSpan = null as any;
                    }, 250);
                }

                // Go back to prototype, ready to build
                delete (series as any).buildKDTree;

                series.buildKDTree();

            // Don't do async on export, the exportChart, getSVGForExport and
            // getSVG methods are not chained for it.
            }, chart.renderer.forExport ? Number.MAX_VALUE : void 0);
        }

    }

}

/* *
 *
 *  Default Export
 *
 * */

export default SeriesBoostCanvas;
