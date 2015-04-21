/**
 * This is an experimental Highcharts module that draws long data series on a canvas
 * in order to increase performance of the initial load time and tooltip responsiveness.
 *
 * See discussion in 
 *
 * Compatible with HTML5 canvas-compatible browsers (not IE < 9).
 *
 * Author: Torstein Honsi
 */
/*global document, Highcharts, setTimeout */
(function (H) {

    'use strict';

    var CHUNK_SIZE = 50000,
        noop = function () { return undefined; },
        Series = H.Series,
        seriesTypes = H.seriesTypes,
        each = H.each,
        wrap = H.wrap;

    function eachAsync(arr, fn, callback, i) {
        i = i || 0;
        each(arr.slice(i, i + CHUNK_SIZE - 1), fn);
        if (i < arr.length) {
            setTimeout(function () {
                eachAsync(arr, fn, callback, i + CHUNK_SIZE);
            });
        } else if (callback) {
            callback();
        }
    }

    H.extend(Series.prototype, {
        translate: noop,
        generatePoints: noop,
        drawTracker: noop,
        pointRange: 0,
        drawPoints: noop,

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

        render: function () {
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

            if (xData.length > 99999) {
                chart.showLoading('Drawing...');
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

                if (i % CHUNK_SIZE === 0) {
                    series.canvasToSVG();
                }

            }, function () {
                stroke();
                series.canvasToSVG();
                
                // Do not use chart.hideLoading, as it runs JS animation and will be blocked by buildKDTree.
                // CSS animation looks good, but then it must be deleted in timeout.
                if (chart.loadingDiv) {
                    chart.loadingDiv.style.display = 'none';
                    chart.loadingShown = false;
                }


                delete series.buildKDTree; // Go back to prototype, ready to build
                series.buildKDTree();
                
            });
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

    if (seriesTypes.arearange) {
        seriesTypes.arearange.prototype.translate = noop;
    }

    /**
     * Return a point instance from the k-d-tree
     */
    wrap(Series.prototype, 'searchPoint', function (proceed, e) {
        var point = proceed.call(this, e),
            ret;

        if (point) {
            ret = (new this.pointClass()).init(this, this.options.data[point.i]);
            ret.dist = point.dist;
            ret.plotX = point.plotX;
            ret.plotY = point.plotY;
        }
        return ret;
    });
}(Highcharts));