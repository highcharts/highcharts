QUnit.test('Clipping rectangle after set extremes (#6895)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        series: [{
            boostThreshold: 1,
            data: [
                [0, 0],
                [0, 1],
                [0, 2],
                [0, 3],
                [0, 4]
            ]
        }]
    });

    chart.yAxis[0].setExtremes(1, 2);

    assert.strictEqual(
        chart.series[0].boostClipRect.attr('height'),
        chart.plotHeight,
        'Correct height of the clipping box.'
    );
});

QUnit.test(
    'Boost enabled false and boostThreshold conflict (#9052)',
    function (assert) {
        Highcharts.chart('container', {
            plotOptions: {
                series: {
                    boostThreshold: 1
                }
            },
            series: [{
                data: [1, 3, 2, 4]
            }],
            xAxis: {
                max: 10,
                min: -10
            },
            yAxis: {
                max: 10,
                min: -10
            },
            boost: {
                enabled: false
            }
        });

        assert.ok(
            true,
            'The chart should not fail'
        );
    }
);

QUnit[Highcharts.hasWebGLSupport() ? 'test' : 'skip'](
    'Dynamically removing and adding series (#7499)', function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                width: 400,
                height: 300
            },
            boost: {
                allowForce: true
            },
            plotOptions: {
                series: {
                    boostThreshold: 1
                }
            },
            series: [{
                data: [1, 2, 3, 4]
            }, {
                data: [2, 3, 4, 5]
            }]
        });

        assert.strictEqual(
            chart.series.length,
            2,
            'Successfully initiated'
        );

        assert.strictEqual(
            chart.series[0].renderTarget,
            undefined,
            'No individual renderTarget'
        );


        chart.series[1].remove();
        chart.series[0].remove();

        chart.addSeries({
            data: [4, 3, 2, 1]
        });


        assert.strictEqual(
            typeof chart.series[0].renderTarget,
            'object',
            'Only one series, it should now have a renderTarget'
        );


        chart.addSeries({
            data: [5, 4, 3, 2]
        });

        assert.strictEqual(
            chart.series.length,
            2,
            'Successfully updated'
        );
        assert.notOk(
            chart.series[0].renderTarget,
            'No individual renderTarget after the second series is added'
        );

    }
);
QUnit[Highcharts.hasWebGLSupport() ? 'test' : 'skip'](
    'Combination with non-boostable series types (#7634)',
    function (assert) {
        var chart = Highcharts.chart('container', {

            boost: {
                seriesThreshold: 1
            },

            series: [{
                data: [1, 3, 2, 4],
                boostThreshold: 1,
                id: 'primary'
            }, {
                type: 'flags',
                onSeries: 'primary',
                data: [{
                    x: 1,
                    title: 'C',
                    text: 'C text'
                }]
            }, {
                data: [1, 2, 3, 4, 5],
                boostThreshold: 0,
                type: 'pie'
            }]
        });

        assert.strictEqual(
            chart.series[1].points.length,
            1,
            '1 point should be generated for flags series'
        );
        assert.strictEqual(
            chart.series[2].points.length,
            5,
            '5 points should be generated for flags series'
        );
    }
);

QUnit[Highcharts.hasWebGLSupport() ? 'test' : 'skip'](
    'Series update with shared tooltip (#9572)',
    function (assert) {
        var i = 0,
            chart,
            controller;

        assert.expect(0);

        function getData() {
            i++;
            return [
                ["Time", "2018-11-28", "2018-11-29", "2018-11-30"],
                ["s1", 1, i, 1],
                ["s2", 2, i, 2]
            ];
        }

        chart = Highcharts.chart('container', {
            data: {
                columns: getData()
            },
            chart: {
                width: 600
            },
            series: [{
                boostThreshold: 1
            }, {
            }],
            tooltip: {
                shared: true
            }
        });

        controller = new TestController(chart);
        controller.moveTo(300, 200);
        chart.update({
            data: {
                columns: getData()
            },
            series: [{}, {}],
            tooltip: {}
        });
    }
);

QUnit[Highcharts.hasWebGLSupport() ? 'test' : 'skip'](
    'Error handler while the series is not declared as an array of numbers and turbo threshold enabled, #13957.',
    function (assert) {
        Highcharts.addEvent(Highcharts.Chart, 'displayError', function (e) {
            assert.strictEqual(
                e.code,
                12,
                'Error 12 should be invoked'
            );
        });
        Highcharts.stockChart('container', {
            series: [{
                data: [
                    [1, 2],
                    {
                        x: 2,
                        y: 46.7407
                    },
                    [3, 46.6135],
                    [4, 47.0005],
                    [5, 48.1701],
                    [6, 47.5816]
                ],
                turboThreshold: 2
            }]
        });
    }
);
