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
                var axis = this,
                    chart = axis.chart,
                    breakLine = axis.breakLine,
                    breakPoint = axis.breakArray[0],
                    posX = axis.transB + axis.pos + axis.translate(Math.round(breakPoint.to), false, true),
                    height = chart.plotHeight,
                    step = height/20,
                    path = ['M', 0, height],
                    i = height,
                    k = 1;

                while(i > 0) {
                    i -= step;
                    path.push('L', k * step/2, i);
                    k *= -1;
                }

                if (!breakLine) {
                    breakLine = this.breakLine = chart.renderer.path(path)
                        .attr({
                        stroke: 'red',
                            'stroke-width': 1,
                        zIndex: 10,
                        translateX: posX,
                        translateY: chart.plotTop
                    }).add();
                } else {
                    breakLine.attr({
                        d: path,
                        translateX: posX,
                        translateY: chart.plotTop
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