$(function () {

    /**
     * Experimental plugin to make the chart height adapt to the vertical axis
     * data through the staticScale option.
     *
     * Known issues:
     * - Series are drawn behind grid lines. Probably the chart.setSize call
     *   triggers a redraw that draws the series prematurely. The setSize
     *   function should not be called the first time, try resizing only
     *   renderer.
     */
    (function (H) {
        H.wrap(H.Axis.prototype, 'setAxisSize', function (proceed) {

            var chart = this.chart,
                staticScale = this.options.staticScale,
                height,
                diff;
            if (!this.horiz && staticScale && H.defined(this.min)) {
                height = (this.max - this.min) * staticScale;
                diff = height - chart.plotHeight;
                chart.plotHeight = height;
                if (Math.abs(diff) >= 1) {
                    chart.setSize(
                        null,
                        chart.chartHeight + diff,
                        !!chart.hasRendered
                    );
                }
            }
            proceed.call(this);

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
});
