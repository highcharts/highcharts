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