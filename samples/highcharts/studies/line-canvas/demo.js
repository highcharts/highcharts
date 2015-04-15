$(function () {

    (function (H) {
        var noop = function () {},
            Series = H.Series,
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

                series.points = []; // For k-d tree only
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

    function getData(n) {
        var arr = [],
            i,
            a,
            b,
            c,
            spike;
        for (i = 0; i < n; i = i + 1) {
            if (i % 100 === 0) {
                a = 2 * Math.random();
            }
            if (i % 1000 === 0) {
                b = 2 * Math.random();
            }
            if (i % 10000 === 0) {
                c = 2 * Math.random();
            }
            if (i % 50000 === 0) {
                spike = 10;
            } else {
                spike = 0;
            }
            arr.push([
                i,
                2 * Math.sin(i / 100) + a + b + c + spike + Math.random()
            ]);
        }
        return arr;
    }
    var n = 500000,
        data = getData(n);


    console.time('line');
    $('#container').highcharts({

        chart: {
            zoomType: 'x'
        },

        title: {
            text: 'Trimmed Highcharts drawing ' + n + ' points'
        },

        subtitle: {
            text: 'The line is rendered on canvas, and some features are bypassed for speed'
        },

        tooltip: {
            shared: true,
            headerFormat: '',
            pointFormat: 'x: {point.x}, y: {point.y:.2f}'
        },

        series: [{
            data: data,
            lineWidth: 1
        }]

    });
    console.timeEnd('line');

});