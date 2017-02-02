

/**
 * Experimental plugin to make the chart height adapt to the vertical axis
 * data through the staticScale option.
 *
 * Known issues:
 * - (none)
 */
(function (H) {
    var isNumber = H.isNumber;

    H.wrap(H.Axis.prototype, 'setAxisSize', function (proceed) {

        var axis = this,
            chart = axis.chart,
            hasRendered = !!chart.hasRendered,
            staticScale = axis.options.staticScale,
            height,
            diff;
        if (!axis.horiz && isNumber(staticScale) && H.defined(axis.min)) {
            height = (axis.max - axis.min) * staticScale;
            diff = height - chart.plotHeight;
            chart.plotHeight = height;
            if (Math.abs(diff) >= 1) {

                // Before chart has rendered, wait for series to be rendered
                // before setting chart size.
                H.wrap(chart, 'renderSeries', function (chartProceed) {
                    chartProceed.call(chart);
                    if (!hasRendered) {
                        chart.setSize(null, chart.chartHeight + diff, hasRendered);
                    }
                });

                // After the chart has rendered, set chart size immediately.
                if (hasRendered) {
                    chart.setSize(null, chart.chartHeight + diff, hasRendered);
                }

            }
        }
        proceed.call(axis);

    });

}(Highcharts));



function getPoint(i) {
    return {
        name: new Date(Date.now() + i * 1000),
        y: Math.random()
    };
}
var data = [];
var dataPoints = 20;
for (var i = 0; i < dataPoints; i++) {
    data.push(getPoint(i));
}
var chart = Highcharts.chart('container', {

    xAxis: {
        staticScale: 24,
        minRange: 1,
        categories: true
    },

    series: [{
        data: data,
        type: 'bar'
    }]

});

$('#add').click(function () {
    chart.series[0].addPoint(getPoint(i++));
});
$('#remove').click(function () {
    chart.series[0].removePoint(0);
});
