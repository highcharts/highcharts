jQuery(function () {

    function test(type, tooltipEnabled) {
        QUnit.test('Click event on ' + type + ' with tooltip enabled = ' + tooltipEnabled, function (assert) {

            var chart = Highcharts.chart('container', {

                chart: {
                    type: type,
                    animation: false
                },

                tooltip: {
                    enabled: tooltipEnabled
                },

                plotOptions: {
                    series: {
                        point: {
                            events: {
                                click: function () {
                                    this.update({
                                        y: this.y + 1
                                    });
                                }
                            }
                        }
                    }
                },

                series: [{
                    data: [1, 1, 1]
                }]
            });
            assert.strictEqual(
                chart.series[0].points[0].y,
                1,
                'Initial value'
            );

            chart.series[0].points[0].onMouseOver();
            chart.pointer.onContainerClick({
                target: chart.series[0].points[0].graphic.element
            });

            assert.strictEqual(
                chart.series[0].points[0].y,
                2,
                'First click'
            );

            chart.pointer.onContainerClick({
                target: chart.series[0].points[0].graphic.element
            });

            assert.strictEqual(
                chart.series[0].points[0].y,
                3,
                'Second click without leaving'
            );
        });
    }

    test('pie', true);
    test('pie', false);
    test('column', true);
    test('column', false);
});