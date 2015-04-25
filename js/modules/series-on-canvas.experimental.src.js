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
 * - Column. One pixel per column is probably enough. Otherwise, SVG should be used.
 * - Column range.
 * - Consider detecting the min and max for each pixel using algorithm from http://jsfiddle.net/highcharts/fo20b66d/1/
 *   and a loop that runs prior to the drawing loop, adds all rounded clientX to a parallel 
 *   array and records transistions.
 * - Heatmap and treemap? Not core, so the implementation should perhaps lie in feature files.
 * - Set up option structure. Like plotOptions.series.optimize.
 * - Check or implement stacking in area and column.
 * - Check inverted charts.
 * - Chart callback should be async after last series is drawn. (But not necessarily, we don't do
     that with initial series animation).
 * - Cache full-size image so we don't have to redraw on hide/show and zoom up.
 * - What happens with the loading label when two series?
 * - Test IE9 and IE10.
 *
 * Optimizing tips for users
 * - For scatter plots, use a marker.radius of 1 or less. It results in a rectange being drawn, which is 
 *   considerably faster than a circle.
 * - Set extremes (min, max) explicitly on the axes in order for Highcharts to avoid computing extremes.
 * - Set enableMouseTracking to false on the series to improve total rendering time.
 */
/*global document, Highcharts, HighchartsAdapter, setTimeout */
(function (H, HA) {

    'use strict';

    var noop = function () { return undefined; },
        Series = H.Series,
        seriesTypes = H.seriesTypes,
        each = H.each,
        extend = H.extend,
        fireEvent = HA.fireEvent,
        merge = H.merge,
        wrap = H.wrap,
        CHUNK_SIZE = 50000,
        THRESHOLD = 5000;

    function eachAsync(arr, fn, callback, chunkSize, i) {
        i = i || 0;
        chunkSize = chunkSize || CHUNK_SIZE;
        each(arr.slice(i, i + chunkSize), fn);
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
            if ((this.processedXData || this.options.data).length < THRESHOLD) {

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

    /**
     * Do not compute extremes when min and max are set.
     * If we use this in the core, we can add the hook to hasExtremes to the methods directly.
     */
    wrap(Series.prototype, 'getExtremes', function (proceed) {
        if (!this.hasExtremes()) {
            proceed.apply(this, Array.prototype.slice.call(arguments, 1));
        }
    });
    wrap(Series.prototype, 'setData', function (proceed) {
        if (!this.hasExtremes(true)) {
            proceed.apply(this, Array.prototype.slice.call(arguments, 1));
        }
    });
    wrap(Series.prototype, 'processData', function (proceed) {
        if (!this.hasExtremes(true)) {
            proceed.apply(this, Array.prototype.slice.call(arguments, 1));
        }
    });


    H.extend(Series.prototype, {
        pointRange: 0,

        hasExtremes: function (checkX) {
            var data = this.options.data,
                xAxis = this.xAxis.options,
                yAxis = this.yAxis.options;
            return data.length > THRESHOLD && typeof yAxis.min === 'number' && typeof yAxis.max === 'number' &&
                (!checkX || (typeof xAxis.min === 'number' && typeof xAxis.max === 'number'));
        },

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
                rawData = options.data,
                xExtremes = xAxis.getExtremes(),
                xMin = xExtremes.min,
                xMax = xExtremes.max,
                yExtremes = yAxis.getExtremes(),
                yMin = yExtremes.min,
                yMax = yExtremes.max,
                pointTaken = {},
                lastClientX,
                sampling = !!series.sampling,
                points,
                r = options.marker && options.marker.radius,
                cvsDrawPoint = this.cvsDrawPoint,
                cvsLineTo = options.lineWidth ? this.cvsLineTo : false,
                cvsMarker = r <= 1 ? this.cvsMarkerSquare : this.cvsMarkerCircle,
                enableMouseTracking = options.enableMouseTracking !== false,
                lastPoint,
                yBottom = yAxis.getThreshold(options.threshold),
                doFill = this.fill,
                isRange = series.pointArrayMap && series.pointArrayMap.join(',') === 'low,high',
                cropStart = series.cropStart || 0,
                loadingOptions = chart.options.loading,
                requireSorting = series.requireSorting,
                wasNull,
                connectNulls = options.connectNulls,
                useRaw = !xData,
                minVal,
                maxVal,
                minI,
                maxI,
                stroke = function () {
                    if (doFill) {
                        ctx.fillStyle = series.color;
                        ctx.fill();
                    } else {
                        ctx.strokeStyle = series.color;
                        ctx.lineWidth = options.lineWidth;
                        ctx.stroke();
                    }
                },
                drawPoint = function (clientX, plotY, yBottom, i) {
                    if (c === 0) {
                        ctx.beginPath();
                    }

                    if (wasNull) {
                        ctx.moveTo(clientX, plotY);
                    } else {
                        if (cvsDrawPoint) {
                            cvsDrawPoint(ctx, clientX, plotY, yBottom, lastPoint);
                        } else if (cvsLineTo) {
                            cvsLineTo(ctx, clientX, plotY);
                        } else if (cvsMarker) {
                            cvsMarker(ctx, clientX, plotY, r);
                        }
                    }

                    // We need to stroke the line for every 1000 pixels. It will crash the browser
                    // memory use if we stroke too infrequently.
                    c = c + 1;
                    if (c === 1000) {
                        stroke();
                        c = 0;
                    }

                    // Area charts need to keep track of the last point
                    lastPoint = {
                        clientX: clientX,
                        plotY: plotY,
                        yBottom: yBottom
                    };


                    // The k-d tree requires series points. Reduce the amount of points, since the time to build the 
                    // tree increases exponentially.
                    if (enableMouseTracking && !pointTaken[clientX + ',' + plotY]) {
                        points.push({
                            clientX: clientX,
                            plotX: clientX,
                            plotY: plotY,
                            i: cropStart + i
                        });
                        pointTaken[clientX + ',' + plotY] = true;
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

            series.getAttribs();
            series.markerGroup = series.group;

            points = this.points = [];
            ctx = this.getContext();
            series.buildKDTree = noop; // Do not start building while drawing 

            // Display a loading indicator
            if (rawData.length > 99999) {
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

            // Loop over the points
            i = 0;
            eachAsync(xData || rawData, function (d) {

                var x,
                    y,
                    clientX,
                    plotY,
                    isNull,
                    isYInside = true;

                if (useRaw) {
                    x = d[0];
                    y = d[1];
                } else {
                    x = d;
                    y = yData[i];
                }

                // Resolve low and high for range series
                if (isRange) {
                    if (useRaw) {
                        y = d.slice(1, 3);
                    }
                    yBottom = yAxis.toPixels(y[0], true);
                    y = y[1];
                }

                isNull = y === null;

                // Optimize for scatter zooming
                if (!requireSorting) {
                    isYInside = y >= yMin && y <= yMax;
                }

                if (!isNull && x >= xMin && x <= xMax && isYInside) {

                    clientX = Math.round(xAxis.toPixels(x, true));

                    if (sampling) {
                        if (clientX === lastClientX) {
                            if (y > maxVal) {
                                maxVal = y;
                                maxI = i;
                            } else if (y < minVal) {
                                minVal = y;
                                minI = i;
                            }

                        } else { // Add points and reset
                            // TODO: 
                            // In area and column charts, we should probably have the same mechanism
                            // that the range chart, so we draw a 1px wide rectangle from the min
                            // to the max value. K-d-points need to reflect both min and max.
                            /*
                            if (typeof minI === 'number') {
                                drawPoint(lastClientX, yAxis.toPixels(minVal, true), yBottom, minI);
                            }
                            if (typeof maxI === 'number') {
                                drawPoint(lastClientX, yAxis.toPixels(maxVal, true), yBottom, maxI);
                            }
                            */
                            drawPoint(lastClientX, yAxis.toPixels(y, true), yBottom, i);


                            minVal = maxVal = y;
                            minI = maxI = undefined;
                            lastClientX = clientX;
                        }
                    } else {
                        plotY = Math.round(yAxis.toPixels(y, true));
                        drawPoint(clientX, plotY, yBottom, i);
                    }
                }
                wasNull = isNull && !connectNulls;

                i = i + 1;

                if (i % CHUNK_SIZE === 0) {
                    series.canvasToSVG();
                }

            }, function () {

                var loadingDiv = chart.loadingDiv;

                stroke();
                series.canvasToSVG();

                fireEvent(series, 'renderedCanvas'); // docs

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
                    }, 250);
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

    // Rect is twice as fast as arc, should be used for small markers
    seriesTypes.scatter.prototype.cvsMarkerSquare = function (ctx, clientX, plotY, r) {
        ctx.moveTo(clientX, plotY);
        ctx.rect(clientX - r, plotY - r, r * 2, r * 2);
    };
    seriesTypes.scatter.prototype.fill = true;

    extend(seriesTypes.area.prototype, {
        cvsDrawPoint: function (ctx, clientX, plotY, yBottom, lastPoint) {
            if (lastPoint && clientX !== lastPoint.clientX) {
                ctx.moveTo(lastPoint.clientX, lastPoint.yBottom);
                ctx.lineTo(lastPoint.clientX, lastPoint.plotY);
                ctx.lineTo(clientX, plotY);
                ctx.lineTo(clientX, yBottom);
            }
        },
        fill: true,
        sampling: true
    });

    /**
     * Return a point instance from the k-d-tree
     */
    wrap(Series.prototype, 'searchPoint', function (proceed, e) {
        var point = proceed.call(this, e),
            ret = point;

        if (point && !(point instanceof this.pointClass)) {
            ret = (new this.pointClass()).init(this, this.options.data[point.i]);
            ret.dist = point.dist;
            ret.category = ret.x;
            ret.plotX = point.plotX;
            ret.plotY = point.plotY;
        }
        return ret;
    });
}(Highcharts, HighchartsAdapter));