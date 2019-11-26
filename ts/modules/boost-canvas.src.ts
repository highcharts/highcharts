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
import H from '../parts/Globals.js';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        /** @requires modules/boost-canvas */
        function initCanvasBoost(): void;
        interface BoostOptions {
            timeRendering?: boolean;
            timeSeriesProcessing?: boolean;
            timeSetup?: boolean;
        }
        interface Series extends BoostTargetObject {
            cvsStrokeBatch?: number;
            /** @requires modules/boost-canvas */
            canvasToSVG(): void;
            /** @requires modules/boost-canvas */
            cvsDrawPoint(
                ctx: CanvasRenderingContext2D,
                clientX: number,
                plotY: number,
                yBottom: number,
                lastPoint?: Dictionary<number>
            ): void;
            /** @requires modules/boost-canvas */
            cvsLineTo(
                ctx: CanvasRenderingContext2D,
                clientX: number,
                plotY: number
            ): void;
            /** @requires modules/boost-canvas */
            cvsMarkerCircle(
                ctx: CanvasRenderingContext2D,
                clientX: number,
                plotY: number,
                r: number,
                i?: number
            ): void;
            /** @requires modules/boost-canvas */
            cvsMarkerSquare(
                ctx: CanvasRenderingContext2D,
                clientX: number,
                plotY: number,
                r: number
            ): void;
            /** @requires modules/boost-canvas */
            getContext(): (CanvasRenderingContext2D|null|undefined);
            /** @requires modules/boost-canvas */
            renderCanvas(): void;
        }
        interface BoostTargetObject {
            ctx?: (CanvasRenderingContext2D|null);
        }
    }
}

import U from '../parts/Utilities.js';
const {
    extend,
    isNumber,
    wrap
} = U;

import '../parts/Color.js';
import '../parts/Series.js';
import '../parts/Options.js';

var win = H.win,
    doc = win.document,
    noop = function (): void {},
    Color = H.Color,
    Series = H.Series,
    seriesTypes = H.seriesTypes,
    addEvent = H.addEvent,
    fireEvent = H.fireEvent,
    merge = H.merge,
    pick = H.pick,
    CHUNK_SIZE = 50000,
    destroyLoadingDiv: number;

/* eslint-disable no-invalid-this, valid-jsdoc */

/**
 * Initialize the canvas boost.
 *
 * @function Highcharts.initCanvasBoost
 */
H.initCanvasBoost = function (): void {
    if (H.seriesTypes.heatmap) {
        wrap(H.seriesTypes.heatmap.prototype, 'drawPoints', function (
            this: Highcharts.HeatmapSeries
        ): void {
            var chart = this.chart,
                ctx = this.getContext(),
                inverted = this.chart.inverted,
                xAxis = this.xAxis,
                yAxis = this.yAxis;

            if (ctx) {

                // draw the columns
                this.points.forEach(function (
                    point: Highcharts.HeatmapPoint
                ): void {
                    var plotY = point.plotY,
                        shapeArgs: Highcharts.SVGAttributes,
                        pointAttr: Highcharts.SVGAttributes;

                    if (
                        typeof plotY !== 'undefined' &&
                        !isNaN(plotY) &&
                        point.y !== null
                    ) {
                        shapeArgs = point.shapeArgs as any;

                        if (!chart.styledMode) {
                            pointAttr = point.series.pointAttribs(point);
                        } else {
                            pointAttr = point.series.colorAttribs(point);
                        }

                        (ctx as any).fillStyle = pointAttr.fill as any;

                        if (inverted) {
                            (ctx as any).fillRect(
                                yAxis.len - shapeArgs.y + xAxis.left,
                                xAxis.len - shapeArgs.x + yAxis.top,
                                -shapeArgs.height,
                                -shapeArgs.width
                            );
                        } else {
                            (ctx as any).fillRect(
                                shapeArgs.x + xAxis.left,
                                shapeArgs.y + yAxis.top,
                                shapeArgs.width,
                                shapeArgs.height
                            );
                        }
                    }
                });

                this.canvasToSVG();

            } else {
                this.chart.showLoading(
                    'Your browser doesn\'t support HTML5 canvas, <br>' +
                    'please use a modern browser'
                );

                // Uncomment this to provide low-level (slow) support in oldIE.
                // It will cause script errors on charts with more than a few
                // thousand points.
                // arguments[0].call(this);
            }
        });
    }


    extend(Series.prototype, {

        /**
         * Create a hidden canvas to draw the graph on. The contents is later
         * copied over to an SVG image element.
         *
         * @private
         * @function Highcharts.Series#getContext
         */
        getContext: function (
            this: Highcharts.Series
        ): (CanvasRenderingContext2D|null|undefined) {
            var chart = this.chart,
                width = chart.chartWidth,
                height = chart.chartHeight,
                targetGroup = chart.seriesGroup || this.group,
                target: Highcharts.BoostTargetObject = this,
                ctx: (CanvasRenderingContext2D|null|undefined),
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

            } else if (!(target instanceof H.Chart)) {
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
        },

        /**
         * Draw the canvas image inside an SVG image
         *
         * @private
         * @function Highcharts.Series#canvasToSVG
         */
        canvasToSVG: function (this: Highcharts.Series): void {
            if (!this.chart.isChartSeriesBoosting()) {
                if (this.boostCopy || this.chart.boostCopy) {
                    (this.boostCopy || this.chart.boostCopy)();
                }
            } else {
                if (this.boostClear) {
                    this.boostClear();
                }
            }
        },

        cvsLineTo: function (
            this: Highcharts.Series,
            ctx: CanvasRenderingContext2D,
            clientX: number,
            plotY: number
        ): void {
            ctx.lineTo(clientX, plotY);
        },

        renderCanvas: function (this: Highcharts.Series): void {
            var series = this,
                options = series.options,
                chart = series.chart,
                xAxis = this.xAxis,
                yAxis = this.yAxis,
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
                rawData: Array<Highcharts.PointOptionsType> =
                    options.data as any,
                xExtremes = xAxis.getExtremes(),
                xMin = xExtremes.min,
                xMax = xExtremes.max,
                yExtremes = yAxis.getExtremes(),
                yMin = yExtremes.min,
                yMax = yExtremes.max,
                pointTaken: Highcharts.Dictionary<boolean> = {},
                lastClientX: number,
                sampling = !!series.sampling,
                points: Array<Highcharts.Dictionary<number>>,
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
                lastPoint: Highcharts.Dictionary<number>,
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
                        new Color(series.color).setOpacity(
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
                    this.xData ||
                    (this.options as any).xData ||
                    this.processedXData ||
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

            if (this.renderTarget) {
                this.renderTarget.attr({ 'href': '' });
            }

            // If we are zooming out from SVG mode, destroy the graphics
            if (this.points || this.graph) {
                this.destroyGraphics();
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

            points = this.points = [];
            ctx = this.getContext();
            series.buildKDTree = noop; // Do not start building while drawing

            if (this.boostClear) {
                this.boostClear();
            }

            // if (this.canvas) {
            //     ctx.clearRect(
            //         0,
            //         0,
            //         this.canvas.width,
            //         this.canvas.height
            //     );
            // }

            if (!this.visible) {
                return;
            }

            // Display a loading indicator
            if (rawData.length > 99999) {
                chart.options.loading = merge(loadingOptions, {
                    labelStyle: {
                        backgroundColor: H.color('${palette.backgroundColor}')
                            .setOpacity(0.75).get(),
                        padding: '1em',
                        borderRadius: '0.5em'
                    },
                    style: {
                        backgroundColor: 'none',
                        opacity: 1
                    }
                });
                H.clearTimeout(destroyLoadingDiv);
                chart.showLoading('Drawing...');
                chart.options.loading = loadingOptions; // reset
            }

            if (boostSettings.timeRendering) {
                console.time('canvas rendering'); // eslint-disable-line no-console
            }

            // Loop over the points
            (H as any).eachAsync(sdata, function (d: any, i: number): boolean {
                var x: number,
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
                var loadingDiv: Highcharts.HTMLElement =
                        chart.loadingDiv as any,
                    loadingShown = chart.loadingShown;

                stroke();

                // if (series.boostCopy || series.chart.boostCopy) {
                //     (series.boostCopy || series.chart.boostCopy)();
                // }

                series.canvasToSVG();

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
                        opacity: 0
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
                delete series.buildKDTree;

                series.buildKDTree();

            // Don't do async on export, the exportChart, getSVGForExport and
            // getSVG methods are not chained for it.
            }, chart.renderer.forExport ? Number.MAX_VALUE : void 0);
        }
    });

    seriesTypes.scatter.prototype.cvsMarkerCircle = function (
        ctx: CanvasRenderingContext2D,
        clientX: number,
        plotY: number,
        r: number
    ): void {
        ctx.moveTo(clientX, plotY);
        ctx.arc(clientX, plotY, r, 0, 2 * Math.PI, false);
    };

    // Rect is twice as fast as arc, should be used for small markers
    seriesTypes.scatter.prototype.cvsMarkerSquare = function (
        ctx: CanvasRenderingContext2D,
        clientX: number,
        plotY: number,
        r: number
    ): void {
        ctx.rect(clientX - r, plotY - r, r * 2, r * 2);
    };
    seriesTypes.scatter.prototype.fill = true;

    if (seriesTypes.bubble) {
        seriesTypes.bubble.prototype.cvsMarkerCircle = function (
            ctx: CanvasRenderingContext2D,
            clientX: number,
            plotY: number,
            r: number,
            i?: number
        ): void {
            ctx.moveTo(clientX, plotY);
            ctx.arc(
                clientX,
                plotY,
                this.radii && (this.radii[i as any] as any),
                0,
                2 * Math.PI,
                false
            );
        };
        seriesTypes.bubble.prototype.cvsStrokeBatch = 1;
    }

    extend(seriesTypes.area.prototype, {
        cvsDrawPoint: function (
            this: Highcharts.AreaSeries,
            ctx: CanvasRenderingContext2D,
            clientX: number,
            plotY: number,
            yBottom: number,
            lastPoint: Highcharts.Dictionary<number>
        ): void {
            if (lastPoint && clientX !== lastPoint.clientX) {
                ctx.moveTo(lastPoint.clientX as any, lastPoint.yBottom as any);
                ctx.lineTo(lastPoint.clientX as any, lastPoint.plotY as any);
                ctx.lineTo(clientX, plotY);
                ctx.lineTo(clientX, yBottom);
            }
        },
        fill: true,
        fillOpacity: true,
        sampling: true
    });

    extend(seriesTypes.column.prototype, {
        cvsDrawPoint: function (
            this: Highcharts.ColumnSeries,
            ctx: CanvasRenderingContext2D,
            clientX: number,
            plotY: number,
            yBottom: number
        ): void {
            ctx.rect(clientX - 1, plotY, 1, yBottom - plotY);
        },
        fill: true,
        sampling: true
    });

    H.Chart.prototype.callbacks.push(function (
        chart: Highcharts.Chart
    ): void {

        /**
         * @private
         */
        function canvasToSVG(this: Highcharts.Chart): void {
            if (chart.boostCopy) {
                chart.boostCopy();
            }
        }

        /**
         * @private
         */
        function clear(this: Highcharts.Chart): void {
            if (chart.renderTarget) {
                chart.renderTarget.attr({ href: '' });
            }

            if (chart.canvas) {
                (chart.canvas.getContext('2d') as any).clearRect(
                    0,
                    0,
                    chart.canvas.width,
                    chart.canvas.height
                );
            }
        }

        addEvent(chart, 'predraw', clear);
        addEvent(chart, 'render', canvasToSVG);
    });
};
