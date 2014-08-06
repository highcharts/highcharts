$(function () {

    (function (H) {
        var defaultOptions = H.getOptions(),
            noop = function () {};

        defaultOptions.plotOptions['heatmaptrimmed'] = H.merge(defaultOptions.plotOptions.scatter);
        H.seriesTypes['heatmaptrimmed'] = H.extendClass(H.seriesTypes.heatmap, {
            type: 'heatmaptrimmed',
            setData: noop,
            processData: noop,
            translate: noop,
            generatePoints: noop,
            getExtremes: noop,
            drawTracker: noop,
            getContext: function () {
                if (!this.canvas) {
                        var ns = 'http://www.w3.org/1999/xhtml';
                        var fo = this.chart.renderer.createElement('foreignObject').add(this.group);
                        this.canvas = document.createElementNS(ns, 'canvas');
                        this.canvas.setAttribute('width', this.chart.chartWidth);
                        this.canvas.setAttribute('height', this.chart.chartHeight);
                        fo.element.appendChild(this.canvas);
                        this.ctx = this.canvas.getContext('2d');
                        this.ctx.translate(this.group.translateX, this.group.translateY)
                    }
                return this.ctx;

            },
            drawPoints: function () {
                var series = this,
                    data = this.options.data,
                    transAX = this.xAxis.transA,
                    transAY = this.yAxis.transA,
                    xMin = this.xAxis.min,
                    yMin = this.yAxis.min,
                    colorAxis = series.colorAxis,
                    useCanvas = true, // todo: feature detection either for foreignObject or overlaid canvas
                    ctx,
                    renderer;

                if (useCanvas) {

                    ctx = this.getContext();

                    H.each(data, function (point) {
                        ctx.fillStyle = colorAxis.toColor(point[2]);
                        ctx.fillRect(
                            (point[0] - xMin) * transAX,
                            (point[1] - yMin) * transAY,
                            (series.options.colsize || 1) * transAX + 1,
                            (series.options.row || 1) * transAY + 1
                        );
                    });

                } else {
                    renderer = series.chart.renderer;
                    H.each(data, function (point) {
                        renderer.rect(
                            (point[0] - xMin) * transAX,
                            (point[1] - yMin) * transAY,
                            (series.options.colsize || 1) * transAX + 1,
                            (series.options.row || 1) * transAY + 1
                        ).attr({
                            fill: colorAxis.toColor(point[2])
                        }).add(series.group);
                    });

                }

            }
        });
    }(Highcharts));


    var start;
    $('#container').highcharts({

        data: {
            csv: document.getElementById('csv').innerHTML,
            parsed: function () {
                start = +new Date();
            }
        },

        chart: {
            type: 'heatmaptrimmed',
            margin: [50, 10, 80, 50]
        },


        title: {
            text: 'Highcharts heat map study',
            align: 'left'
        },

        subtitle: {
            text: 'Temperature variation by day and hour through 2013',
            align: 'left'
        },

        xAxis: {
            min: Date.UTC(2013, 0, 1),
            max: Date.UTC(2014, 0, 1)
        },

        yAxis: {
            title: {
                text: null
            },
            labels: {
                format: '{value}:00'
            },
            minPadding: 0,
            maxPadding: 0,
            startOnTick: false,
            endOnTick: false,
            tickPositions: [0, 6, 12, 18, 24],
            tickWidth: 1,
            min: 0,
            max: 23,
            reversed: true
        },

        colorAxis: {
            stops: [
                [0, '#3060cf'],
                [0.5, '#fffbbc'],
                [0.9, '#c4463a']
            ],
            min: -15,
            max: 25,
            startOnTick: false,
            endOnTick: false
        },

        series: [{
            borderWidth: 0,
            nullColor: '#EFEFEF',
            colsize: 24 * 36e5, // one day
            tooltip: {
                headerFormat: 'Temperature<br/>',
                pointFormat: '{point.x:%e %b, %Y} {point.y}:00: <b>{point.value} ℃</b>'
            }
        }]

    });
    console.log('Rendered in ' + (new Date() - start) + ' ms');

});