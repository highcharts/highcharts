/**
 * This is an experimental Highcharts module that draws long data series on a canvas
 * in order to increase performance of the initial load time and tooltip responsiveness.
 *
 * Compatible with HTML5 canvas compatible browsers (not IE < 9).
 *
 * Author: Torstein Honsi
 *
 * 
 * Development plan
 * - Column.
 * - Column range.
 * - Heatmap and treemap? Not core, so the implementation should perhaps lie in feature files.
 * - Set up option structure. Like plotOptions.series.optimize.
 * - Check or implement stacking in area and column.
 * - Null points.
 * - Check inverted charts.
 * - Chart callback should be async after last series is drawn.
 * - Cache full-size image so we don't have to redraw on hide/show and zoom up.
 * - Test IE9 and IE10.
 * - Tooltip on scatter sample looks wrong?
 */
/*global document, Highcharts, setTimeout */
(function (H) {

    'use strict';

    var noop = function () { return undefined; },
        Series = H.Series,
        seriesTypes = H.seriesTypes,
        each = H.each,
        extend = H.extend,
        merge = H.merge,
        wrap = H.wrap,
        THRESHOLD = 5000;

    function eachAsync(arr, fn, callback, chunkSize, i) {
        i = i || 0;
        chunkSize = chunkSize || 50000;
        each(arr.slice(i, i + chunkSize - 1), fn);
        if (i + chunkSize < arr.length) {
            setTimeout(function () {
                eachAsync(arr, fn, callback, chunkSize, i + chunkSize);
            });
        } else if (callback) {
            callback();
        }
    }

    /**
     * Override a bunch of methods the same way. If the number of points is below the threshold,
     * run the original method. If not, check for a canvas version or do nothing.
     */
    each(['translate', 'generatePoints', 'drawTracker', 'drawPoints', 'render'], function (method) {
        function branch(proceed) {
            if (this.processedXData.length < THRESHOLD) {

                // Clear image
                if (method === 'render' && this.image) {
                    this.image.attr({ href: '' });
                    this.animate = null; // We're zooming in, don't run animation
                }

                proceed.call(this);

            // If a canvas version of the method exists, like renderCanvas(), run
            } else if (this[method + 'Canvas']) {

                this[method + 'Canvas']();
            }
        }
        wrap(Series.prototype, method, branch);

        // A special case for arearange - its translate method is already wrapped
        if (method === 'translate' && seriesTypes.arearange) {
            wrap(seriesTypes.arearange.prototype, method, branch);
        }
    });

    H.extend(Series.prototype, {
        pointRange: 0,

        /**
         * If implemented in the core, parts of this can probably be shared with other similar
         * methods in Highcharts.
         */
        destroyGraphics: function () {
            var series = this,
                points = this.points,
                point,
                i;

            for (i = 0; i < points.length; i = i + 1) {
                point = points[i];
                if (point && point.graphic) {
                    point.graphic = point.graphic.destroy();
                }
            }

            each(['graph', 'area'], function (prop) {
                if (series[prop]) {
                    series[prop] = series[prop].destroy();
                }
            });
        },

        /**
         * Create a hidden canvas to draw the graph on. The contents is later copied over 
         * to an SVG image element.
         */
        getContext: function () {
            var width = this.chart.plotWidth,
                height = this.chart.plotHeight;

            if (!this.canvas) {
                this.canvas = document.createElement('canvas');
                this.image = this.chart.renderer.image('', 0, 0, width, height).add(this.group);
                this.ctx = this.canvas.getContext('2d');
            } else {
                this.ctx.clearRect(0, 0, width, height);
            }

            this.canvas.setAttribute('width', width);
            this.canvas.setAttribute('height', height);
            this.image.attr({
                width: width,
                height: height
            });

            return this.ctx;
        },

        /** 
         * Draw the canvas image inside an SVG image
         */
        canvasToSVG: function () {
            this.image.attr({ href: this.canvas.toDataURL('image/png') });
        },

        cvsLineTo: function (ctx, clientX, plotY) {
            ctx.lineTo(clientX, plotY);
        },

        renderCanvas: function () {
            var series = this,
                options = series.options,
                chart = series.chart,
                xAxis = this.xAxis,
                yAxis = this.yAxis,
                ctx,
                i,
                c = 0,
                xData = series.processedXData,
                yData = series.processedYData,
                xExtremes = xAxis.getExtremes(),
                xMin = xExtremes.min,
                xMax = xExtremes.max,
                yExtremes = yAxis.getExtremes(),
                yMin = yExtremes.min,
                yMax = yExtremes.max,
                pointTaken = {},
                points,
                r = options.marker && options.marker.radius,
                cvsDrawPoint = this.cvsDrawPoint,
                cvsLineTo = options.lineWidth ? this.cvsLineTo : false,
                cvsMarker = r <= 1 ? this.cvsMarkerSquare : this.cvsMarkerCircle,
                lastPoint,
                yBottom = yAxis.getThreshold(options.threshold),
                doFill = this.fill,
                isRange = series.pointArrayMap && series.pointArrayMap.join(',') === 'low,high',
                cropStart = series.cropStart || 0,
                loadingOptions = chart.options.loading,
                stroke = function () {
                    if (doFill) {
                        ctx.fillStyle = series.color;
                        ctx.fill();
                    } else {
                        ctx.strokeStyle = series.color;
                        ctx.lineWidth = options.lineWidth;
                        ctx.stroke();
                    }
                };

            // If we are zooming out from SVG mode, destroy the graphics
            if (this.points) {
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

            points = this.points = [];
            ctx = this.getContext();
            series.buildKDTree = noop; // Do not start building while drawing 

            // Display a loading indicator
            if (xData.length > 99999) {
                chart.options.loading = merge(loadingOptions, {
                    labelStyle: {
                        backgroundColor: 'rgba(255,255,255,0.75)',
                        padding: '1em',
                        borderRadius: '0.5em'
                    },
                    style: {
                        backgroundColor: 'none',
                        opacity: 1
                    }
                });
                chart.showLoading('Drawing...');
                chart.options.loading = loadingOptions; // reset
            }

            i = 0;
            eachAsync(xData, function (x) {

                var y = yData[i],
                    clientX,
                    plotY;

                if (isRange) {
                    yBottom = yAxis.toPixels(y[0], true);
                    y = y[1];
                }

                if (x >= xMin && x <= xMax && y >= yMin && y <= yMax) { // this is faster for scatter zooming

                    clientX = Math.round(xAxis.toPixels(x, true));
                    plotY = Math.round(yAxis.toPixels(y, true));

                    if (c === 0) {
                        ctx.beginPath();
                    }

                    // The k-d tree requires series points. Reduce the amount of points, since the time to build the 
                    // tree increases exponentially.
                    if (!pointTaken[clientX + ',' + plotY]) {
                        points.push({
                            clientX: clientX,
                            plotX: clientX,
                            plotY: plotY,
                            i: cropStart + i
                        });
                        pointTaken[clientX + ',' + plotY] = true;
                    }

                    if (cvsDrawPoint) {
                        cvsDrawPoint(ctx, clientX, plotY, yBottom, lastPoint);
                    } else if (cvsLineTo) {
                        cvsLineTo(ctx, clientX, plotY);
                    } else if (cvsMarker) {
                        cvsMarker(ctx, clientX, plotY, r);
                    }

                    lastPoint = {
                        clientX: clientX,
                        plotY: plotY,
                        yBottom: yBottom
                    };

                    // We need to stroke the line for every 1000 pixels. It will crash the browser
                    // memory use if we stroke too infrequently.
                    c = c + 1;
                    if (c === 1000) {
                        stroke();
                        c = 0;
                    }
                }

                i = i + 1;

                if (i % 50000 === 0) {
                    series.canvasToSVG();
                }

            }, function () {

                var loadingDiv = chart.loadingDiv;

                stroke();
                series.canvasToSVG();

                // Do not use chart.hideLoading, as it runs JS animation and will be blocked by buildKDTree.
                // CSS animation looks good, but then it must be deleted in timeout. If we add the module to core,
                // change hideLoading so we can skip this block.
                if (loadingDiv) {
                    extend(loadingDiv.style, {
                        transition: 'opacity 250ms',
                        opacity: 0
                    });

                    chart.loadingShown = false;
                    setTimeout(function () {
                        loadingDiv.parentNode.removeChild(loadingDiv);
                        chart.loadingDiv = chart.loadingSpan = null;
                    });
                }


                delete series.buildKDTree; // Go back to prototype, ready to build
                series.buildKDTree();

             // Don't do async on export, the exportChart, getSVGForExport and getSVG methods are not chained for it.
            }, chart.renderer.forExport ? Number.MAX_VALUE : undefined);
        }
    });

    seriesTypes.scatter.prototype.cvsMarkerCircle = function (ctx, clientX, plotY, r) {
        ctx.moveTo(clientX, plotY);
        ctx.arc(clientX, plotY, r, 0, 2 * Math.PI, false);
    };

    // Rect is twice as fast as arc, should be used for small markers // docs: recommended settings
    seriesTypes.scatter.prototype.cvsMarkerSquare = function (ctx, clientX, plotY, r) {
        ctx.moveTo(clientX, plotY);
        ctx.rect(clientX - r, plotY - r, r * 2, r * 2);
    };
    seriesTypes.scatter.prototype.fill = true;

    seriesTypes.area.prototype.cvsDrawPoint = function (ctx, clientX, plotY, yBottom, lastPoint) {
        if (lastPoint && clientX !== lastPoint.clientX) {
            ctx.moveTo(lastPoint.clientX, lastPoint.yBottom);
            ctx.lineTo(lastPoint.clientX, lastPoint.plotY);
            ctx.lineTo(clientX, plotY);
            ctx.lineTo(clientX, yBottom);
        }
    };
    seriesTypes.area.prototype.fill = true;

    /**
     * Return a point instance from the k-d-tree
     */
    wrap(Series.prototype, 'searchPoint', function (proceed, e) {
        var point = proceed.call(this, e),
            ret;

        if (point) {
            ret = (new this.pointClass()).init(this, this.options.data[point.i]);
            ret.dist = point.dist;
            ret.category = ret.x;
            ret.plotX = point.plotX;
            ret.plotY = point.plotY;
        }
        return ret;
    });
}(Highcharts));