/**
 * This is an experimental Highcharts module that draws long data series on a canvas
 * in order to increase performance of the initial load time and tooltip responsiveness.
 *
 * Compatible with HTML5 canvas-compatible browsers (not IE < 9).
 *
 * Author: Torstein Honsi
 */

(function (H) {
    var noop = function () {},
        Series = H.Series,
        seriesTypes = H.seriesTypes,
        wrap = H.wrap;

    H.extend(Series.prototype, {
        _setData: function () {
            this.points = [];
        },
        _processData: noop,
        translate: noop,
        generatePoints: noop,
        _getExtremes: noop,
        drawTracker: noop,
        pointRange: 0,

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

        drawGraph: function () {
            var series = this,
                xAxis = this.xAxis,
                yAxis = this.yAxis,
                ctx,
                lastClientX,
                i,
                c = 0,
                xData = series.processedXData,
                yData = series.processedYData,
                len = xData.length,
                clientX,
                plotY,
                stroke = function () {
                    ctx.strokeStyle = series.color;
                    ctx.lineWidth = series.options.lineWidth;
                    ctx.stroke();
                    c = 0;
                };

            this.points = [];
            ctx = this.getContext();

            for (i = 0; i < len; i = i + 1) {
                clientX = Math.round(xAxis.toPixels(xData[i], true));
                plotY = yAxis.toPixels(yData[i], true);

                if (c === 0) {
                    ctx.beginPath();
                }

                // The k-d tree requires series points
                if (clientX !== lastClientX) {
                    series.points.push({
                        clientX: clientX,
                        plotX: clientX,
                        plotY: plotY,
                        i: i
                    });
                    lastClientX = clientX;
                }

                ctx.lineTo(
                    clientX,
                    plotY
                );

                // We need to stroke the line for every 1000 pixels. It will crash the browser
                // memory use if we stroke too infrequently.
                c = c + 1;
                if (c === 1000) {
                    stroke();
                }
            }

            stroke();

            this.canvasToSVG();

        }
    });

    seriesTypes.scatter.prototype.drawPoints = function () {
        var series = this,
            xAxis = this.xAxis,
            yAxis = this.yAxis,
            ctx,
            i,
            c = 0,
            xData = series.processedXData,
            yData = series.processedYData,
            len = xData.length,
            clientX,
            plotY,
            stroke = function () {
                ctx.fillStyle = series.color;
                ctx.fill();
                c = 0;
            };

        series.points = []; // For k-d tree only
        ctx = this.getContext();

        for (i = 0; i < len; i = i + 1) {
            clientX = Math.round(xAxis.toPixels(xData[i], true));
            plotY = yAxis.toPixels(yData[i], true);

            if (c === 0) {
                ctx.beginPath();
            }

            // The k-d tree requires series points
            series.points.push({
                clientX: clientX,
                plotX: clientX,
                plotY: plotY,
                i: i
            });
            ctx.moveTo(clientX, plotY);
            ctx.arc(clientX, plotY, 1, 0, 2 * Math.PI, false);


            // We need to stroke the line for every 1000 pixels. It will crash the browser
            // memory use if we stroke too infrequently.
            c = c + 1;
            if (c === 1000) {
                stroke();
            }
        }

        stroke();

        this.canvasToSVG();

    };

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