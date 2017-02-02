

/**
 * Experimental plugin to make the chart height adapt to the vertical axis
 * data through the staticScale option.
 *
 * Known issues:
 * - (none)
 */
(function (H) {
    H.wrap(H.Axis.prototype, 'setAxisSize', function (proceed) {

        var axis = this,
            chart = axis.chart,
            hasRendered = !!chart.hasRendered,
            staticScale = axis.options.staticScale,
            height,
            diff;
        if (!axis.horiz && staticScale && H.defined(axis.min)) {
            height = (axis.max - axis.min) * staticScale;
            diff = height - chart.plotHeight;
            chart.plotHeight = height;
            if (Math.abs(diff) >= 1 && hasRendered) {
                chart.setSize(
                    null,
                    chart.chartHeight + diff,
                    hasRendered
                );
            }
        }
        proceed.call(axis);

    });

}(Highcharts));



function getPoint(i) {
    return {
        name: new Date(Date.now() + i),
        y: Math.random()
    };
}
var i = 0;
var chart = Highcharts.chart('container', {

    xAxis: {
        staticScale: 24,
        minRange: 1,
        categories: true
    },

    series: [{
        data: [getPoint(i++), getPoint(i++), getPoint(i++)],
        type: 'bar'
    }]

});

$('#add').click(function () {
    chart.series[0].addPoint(getPoint(i++));
});
$('#remove').click(function () {
    chart.series[0].removePoint(0);
});
