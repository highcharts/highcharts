$(function () {
    QUnit.test('AddPoint animation param.', function (assert) {

        var interval,
            done = assert.async(),
            chart = new Highcharts.Chart({
                chart: {
                    renderTo: 'container',
                    animation: {
                        duration: 1000
                    },
                    type: 'spline',
                    events: {
                        load: function () {
                            interval = setInterval(function () {
                                this.series[0].addPoint(Math.random(), true, true, false);
                            }.bind(this), 400);
                        }
                    }
                },
                series: [{
                    data: [10, 10, 10, 10]
                }]
            });

        setTimeout(function () {
            clearInterval(interval);
            assert.strictEqual(
                chart.renderer.globalAnimation,
                false,
                'Animation correctly set'
            );
            done();
        }, 1000);
    });
});
