$(function () {

    (function (H) {
        var noop = function () {},
            Series = H.Series,
            wrap = H.wrap;

        H.extend(Series.prototype, {
            setData: function () {
                this.points = []
            },
            processData: noop,
            translate: noop,
            generatePoints: noop,
            getExtremes: noop,
            drawTracker: noop,
            pointRange: 0,

            /**
             * Create a hidden canvas to draw the graph on. The contents is later copied over 
             * to an SVG image element.
             */
            getContext: function () {
                if (!this.canvas) {
                    this.canvas = document.createElement('canvas');
                    this.canvas.setAttribute('width', this.chart.chartWidth);
                    this.canvas.setAttribute('height', this.chart.chartHeight);
                    this.image = this.chart.renderer.image('', 0, 0, this.chart.chartWidth, this.chart.chartHeight).add(this.group);
                    this.ctx = this.canvas.getContext('2d');
                }
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
                    data = this.options.data,
                    xAxis = this.xAxis,
                    yAxis = this.yAxis,
                    ctx,
                    renderer,
                    clientX,
                    lastClientX,
                    c = 0;

                ctx = this.getContext();
                

                H.each(data, function (point, i) {

                    var p;

                    if (c === 0) {
                        ctx.beginPath();
                    }
                    c++;


                    clientX = xAxis.toPixels(point[0], true);

                    p = {
                        clientX: clientX,
                        plotY: yAxis.toPixels(point[1], true)
                    };
                    
                    // The k-d tree requires series points
                    clientX = Math.round(clientX);
                    if (clientX !== lastClientX) {
                        p.plotX = p.clientX;
                        p.i = i;
                        series.points.push(p);
                        lastClientX = clientX;
                    }

                    ctx.lineTo(
                        p.clientX,
                        p.plotY
                    );

                    // We need to stroke the line for every 1000 pixels. It will crash the browser
                    // memory use if we stroke too infrequently.
                    if (c === 1000) {
                        ctx.strokeStyle = series.color;
                        ctx.lineWidth = series.options.lineWidth;
                        ctx.stroke();
                        c = 0;
                    }
                });

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
        })
    }(Highcharts));

    function getData(n) {
        var arr = [], 
            i,
            a,
            b,
            c,
            spike;
        for (i = 0; i < n; i++) {
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

        title: {
            text: 'Trimmed Highcharts drawing ' + n + ' points'
        },

        subtitle: {
            text: 'The line is rendered on canvas, and some features are bypassed for speed'
        },

        xAxis: {
            min: 0,
            max: 500000
        },

        tooltip: {
            shared: true,
            headerFormat: ''
        },

        yAxis: {
            min: -10,
            max: 20
        },

        series: [{
            data: data
        }]

    });
    console.timeEnd('line');

});