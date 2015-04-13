$(function () {

    (function (H) {
        var noop = function () {};
        H.extend(H.Series.prototype, {
            setData: function () {
                this.points = []
            },
            processData: noop,
            translate: noop,
            generatePoints: noop,
            getExtremes: noop,
            drawTracker: noop,
            pointRange: 0,
            getContext: function () {
                var ns, fo;
                if (!this.canvas) {
                    ns = 'http://www.w3.org/1999/xhtml';
                    fo = this.chart.renderer.createElement('foreignObject').add(this.group);
                    this.canvas = document.createElementNS(ns, 'canvas');
                    this.canvas.setAttribute('width', this.chart.chartWidth);
                    this.canvas.setAttribute('height', this.chart.chartHeight);
                    fo.element.appendChild(this.canvas);
                    this.ctx = this.canvas.getContext('2d');
                    this.ctx.translate(this.group.translateX, this.group.translateY)
                }
                return this.ctx;
            },

            drawGraph: function () {
                var series = this,
                    data = this.options.data,
                    xAxis = this.xAxis,
                    yAxis = this.yAxis,
                    ctx,
                    renderer,
                    c = 0;

                ctx = this.getContext();
                

                H.each(data, function (point) {
                    if (c === 0) {
                        ctx.beginPath();
                    }
                    c++;
                    ctx.lineTo(
                        xAxis.toPixels(point[0], true),
                        yAxis.toPixels(point[1], true)
                    );

                    // We need to stroke the line for every 1000 pixels. It will crash the browser
                    // my memory use if we stroke too infrequently.
                    if (c === 1000) {
                        ctx.strokeStyle = series.color;
                        ctx.lineWidth = series.options.lineWidth;
                        ctx.stroke();
                        c = 0;
                    }
                });

            }
        });
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
            text: 'The line is rendered on canvas, and a lot of features are bypassed for speed'
        },

        xAxis: {
            min: 0,
            max: 500000
        },

        tooltip: {
            shared: true
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