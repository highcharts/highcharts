$(function () {
    $('#container').highcharts({

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            breaks: [{
                from: 5.5,
                to: 7.5
            }],
            events: {
                afterBreaks: function () {
                    if (this.breakArray.length === 0) {
                        return;
                    }

                    var axis = this,
                        chart = axis.chart,
                        breakLine = axis.breakLine,
                        breakPoint = axis.breakArray[0],
                        pos = breakPoint.to,
                        path = axis.getPlotLinePath(pos, 2, false, true);

                    if (!breakLine) {
                        breakLine = this.breakLine = chart.renderer.path(path)
                            .attr({
                                stroke: 'red',
                                'stroke-width': 1,
                                zIndex: 10,
                                translateX: axis.transB
                            }).add();
                    } else {
                        breakLine.attr({
                            d: path,
                            translateX: axis.transB
                        });
                    }
                }
            }
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]

    });
});