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
            setTooltipPoints: noop,
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
                    transAX = this.xAxis.transA,
                    transAY = this.yAxis.transA,
                    xMin = this.xAxis.min,
                    yMin = this.yAxis.min,
                    yMax = this.yAxis.max,
                    colorAxis = series.colorAxis,
                    ctx,
                    renderer;

                ctx = this.getContext();

                ctx.beginPath();
                H.each(data, function (point) {
                    ctx.lineTo(
                        (point[0] - xMin) * transAX,
                        (yMax - point[1] + yMin) * transAY
                    );
                });
                ctx.strokeStyle = this.color;
                ctx.lineWidth = this.options.lineWidth;
                ctx.stroke();

            }
        });
    }(Highcharts));

    function getData(n) {
        var arr = [], 
            i;
        for (i = 0; i < n; i++) {
            arr.push([i, i]);
        }
        return arr;
    }
    var data = getData(500000);


    console.time('line');
    $('#container').highcharts({

        title: {
            text: 'Trimmed Highcharts'
        },

        subtitle: {
            text: 'The line is rendered on canvas, and a lot of features are bypassed for speed'
        },

        xAxis: {
            min: 0,
            max: 500000
        },

        yAxis: {
            min: 0,
            max: 500000
        },

        series: [{
            data: data
        }]

    });
    console.timeEnd('line');

});