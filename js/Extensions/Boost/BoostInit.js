/* *
 *
 *  Copyright (c) 2019-2020 Highsoft AS
 *
 *  Boost module: stripped-down renderer for higher performance
 *
 *  License: highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import Chart from '../../Core/Chart/Chart.js';
import H from '../../Core/Globals.js';
import U from '../../Core/Utilities.js';
var addEvent = U.addEvent, extend = U.extend, fireEvent = U.fireEvent, wrap = U.wrap;
import '../../Series/LineSeries.js';
import butils from './BoostUtils.js';
import createAndAttachRenderer from './BoostAttach.js';
var Series = H.Series, seriesTypes = H.seriesTypes, noop = function () { }, eachAsync = butils.eachAsync, pointDrawHandler = butils.pointDrawHandler, allocateIfNotSeriesBoosting = butils.allocateIfNotSeriesBoosting, renderIfNotSeriesBoosting = butils.renderIfNotSeriesBoosting, shouldForceChartSeriesBoosting = butils.shouldForceChartSeriesBoosting, index;
/* eslint-disable valid-jsdoc */
/**
 * Initialize the boot module.
 *
 * @private
 * @return {void}
 */
function init() {
    extend(Series.prototype, {
        /**
         * @private
         * @function Highcharts.Series#renderCanvas
         */
        renderCanvas: function () {
            var series = this, options = series.options || {}, renderer = false, chart = series.chart, xAxis = this.xAxis, yAxis = this.yAxis, xData = options.xData || series.processedXData, yData = options.yData || series.processedYData, rawData = options.data, xExtremes = xAxis.getExtremes(), xMin = xExtremes.min, xMax = xExtremes.max, yExtremes = yAxis.getExtremes(), yMin = yExtremes.min, yMax = yExtremes.max, pointTaken = {}, lastClientX, sampling = !!series.sampling, points, enableMouseTracking = options.enableMouseTracking !== false, threshold = options.threshold, yBottom = yAxis.getThreshold(threshold), isRange = series.pointArrayMap &&
                series.pointArrayMap.join(',') === 'low,high', isStacked = !!options.stacking, cropStart = series.cropStart || 0, requireSorting = series.requireSorting, useRaw = !xData, minVal, maxVal, minI, maxI, boostOptions, compareX = options.findNearestPointBy === 'x', xDataFull = (this.xData ||
                this.options.xData ||
                this.processedXData ||
                false), addKDPoint = function (clientX, plotY, i) {
                // We need to do ceil on the clientX to make things
                // snap to pixel values. The renderer will frequently
                // draw stuff on "sub-pixels".
                clientX = Math.ceil(clientX);
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
                        x: xDataFull ? xDataFull[cropStart + i] : false,
                        clientX: clientX,
                        plotX: clientX,
                        plotY: plotY,
                        i: cropStart + i
                    });
                }
            };
            // Get or create the renderer
            renderer = createAndAttachRenderer(chart, series);
            chart.isBoosting = true;
            boostOptions = renderer.settings;
            if (!this.visible) {
                return;
            }
            // If we are zooming out from SVG mode, destroy the graphics
            if (this.points || this.graph) {
                this.destroyGraphics();
            }
            // If we're rendering per. series we should create the marker groups
            // as usual.
            if (!chart.isChartSeriesBoosting()) {
                // If all series were boosting, but are not anymore
                // restore private markerGroup
                if (this.markerGroup === chart.markerGroup) {
                    this.markerGroup = void 0;
                }
                this.markerGroup = series.plotGroup('markerGroup', 'markers', true, 1, chart.seriesGroup);
            }
            else {
                // If series has a private markeGroup, remove that
                // and use common markerGroup
                if (this.markerGroup &&
                    this.markerGroup !== chart.markerGroup) {
                    this.markerGroup.destroy();
                }
                // Use a single group for the markers
                this.markerGroup = chart.markerGroup;
                // When switching from chart boosting mode, destroy redundant
                // series boosting targets
                if (this.renderTarget) {
                    this.renderTarget = this.renderTarget.destroy();
                }
            }
            points = this.points = [];
            // Do not start building while drawing
            series.buildKDTree = noop;
            if (renderer) {
                allocateIfNotSeriesBoosting(renderer, this);
                renderer.pushSeries(series);
                // Perform the actual renderer if we're on series level
                renderIfNotSeriesBoosting(renderer, this, chart);
            }
            /**
             * This builds the KD-tree
             * @private
             */
            function processPoint(d, i) {
                var x, y, clientX, plotY, isNull, low = false, chartDestroyed = typeof chart.index === 'undefined', isYInside = true;
                if (!chartDestroyed) {
                    if (useRaw) {
                        x = d[0];
                        y = d[1];
                    }
                    else {
                        x = d;
                        y = yData[i];
                    }
                    // Resolve low and high for range series
                    if (isRange) {
                        if (useRaw) {
                            y = d.slice(1, 3);
                        }
                        low = y[0];
                        y = y[1];
                    }
                    else if (isStacked) {
                        x = d.x;
                        y = d.stackY;
                        low = y - d.y;
                    }
                    isNull = y === null;
                    // Optimize for scatter zooming
                    if (!requireSorting) {
                        isYInside = y >= yMin && y <= yMax;
                    }
                    if (!isNull && x >= xMin && x <= xMax && isYInside) {
                        clientX = xAxis.toPixels(x, true);
                        if (sampling) {
                            if (typeof minI === 'undefined' ||
                                clientX === lastClientX) {
                                if (!isRange) {
                                    low = y;
                                }
                                if (typeof maxI === 'undefined' ||
                                    y > maxVal) {
                                    maxVal = y;
                                    maxI = i;
                                }
                                if (typeof minI === 'undefined' ||
                                    low < minVal) {
                                    minVal = low;
                                    minI = i;
                                }
                            }
                            // Add points and reset
                            if (clientX !== lastClientX) {
                                // maxI is number too:
                                if (typeof minI !== 'undefined') {
                                    plotY =
                                        yAxis.toPixels(maxVal, true);
                                    yBottom =
                                        yAxis.toPixels(minVal, true);
                                    addKDPoint(clientX, plotY, maxI);
                                    if (yBottom !== plotY) {
                                        addKDPoint(clientX, yBottom, minI);
                                    }
                                }
                                minI = maxI = void 0;
                                lastClientX = clientX;
                            }
                        }
                        else {
                            plotY = Math.ceil(yAxis.toPixels(y, true));
                            addKDPoint(clientX, plotY, i);
                        }
                    }
                }
                return !chartDestroyed;
            }
            /**
             * @private
             */
            function doneProcessing() {
                fireEvent(series, 'renderedCanvas');
                // Go back to prototype, ready to build
                delete series.buildKDTree;
                series.buildKDTree();
                if (boostOptions.debug.timeKDTree) {
                    console.timeEnd('kd tree building'); // eslint-disable-line no-console
                }
            }
            // Loop over the points to build the k-d tree - skip this if
            // exporting
            if (!chart.renderer.forExport) {
                if (boostOptions.debug.timeKDTree) {
                    console.time('kd tree building'); // eslint-disable-line no-console
                }
                eachAsync(isStacked ? series.data : (xData || rawData), processPoint, doneProcessing);
            }
        }
    });
    /*
     * We need to handle heatmaps separatly, since we can't perform the
     * size/color calculations in the shader easily.
     *
     * This likely needs future optimization.
     */
    ['heatmap', 'treemap'].forEach(function (t) {
        if (seriesTypes[t]) {
            wrap(seriesTypes[t].prototype, 'drawPoints', pointDrawHandler);
        }
    });
    /* eslint-disable no-invalid-this */
    if (seriesTypes.bubble) {
        // By default, the bubble series does not use the KD-tree, so force it
        // to.
        delete seriesTypes.bubble.prototype.buildKDTree;
        // seriesTypes.bubble.prototype.directTouch = false;
        // Needed for markers to work correctly
        wrap(seriesTypes.bubble.prototype, 'markerAttribs', function (proceed) {
            if (this.isSeriesBoosting) {
                return false;
            }
            return proceed.apply(this, [].slice.call(arguments, 1));
        });
    }
    seriesTypes.scatter.prototype.fill = true;
    extend(seriesTypes.area.prototype, {
        fill: true,
        fillOpacity: true,
        sampling: true
    });
    extend(seriesTypes.column.prototype, {
        fill: true,
        sampling: true
    });
    // Take care of the canvas blitting
    Chart.prototype.callbacks.push(function (chart) {
        /**
         * Convert chart-level canvas to image.
         * @private
         */
        function canvasToSVG() {
            if (chart.ogl && chart.isChartSeriesBoosting()) {
                chart.ogl.render(chart);
            }
        }
        /**
         * Clear chart-level canvas.
         * @private
         */
        function preRender() {
            // Reset force state
            chart.boostForceChartBoost = void 0;
            chart.boostForceChartBoost = shouldForceChartSeriesBoosting(chart);
            chart.isBoosting = false;
            if (!chart.isChartSeriesBoosting() && chart.didBoost) {
                chart.didBoost = false;
            }
            // Clear the canvas
            if (chart.boostClear) {
                chart.boostClear();
            }
            if (chart.canvas && chart.ogl && chart.isChartSeriesBoosting()) {
                chart.didBoost = true;
                // Allocate
                chart.ogl.allocateBuffer(chart);
            }
            // see #6518 + #6739
            if (chart.markerGroup &&
                chart.xAxis &&
                chart.xAxis.length > 0 &&
                chart.yAxis &&
                chart.yAxis.length > 0) {
                chart.markerGroup.translate(chart.xAxis[0].pos, chart.yAxis[0].pos);
            }
        }
        addEvent(chart, 'predraw', preRender);
        addEvent(chart, 'render', canvasToSVG);
        // addEvent(chart, 'zoom', function () {
        //     chart.boostForceChartBoost =
        //         shouldForceChartSeriesBoosting(chart);
        // });
    });
    /* eslint-enable no-invalid-this */
}
export default init;
