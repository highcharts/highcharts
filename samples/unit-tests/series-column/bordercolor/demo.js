QUnit.test('Individual border color', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        plotOptions: {
            column: {
                color: '#2f7ed8',
                borderColor: '#0000aa',
                borderWidth: 5
            }
        },

        series: [
            {
                data: [
                    29.9,
                    71.5,
                    106.4,
                    129.2,
                    144.0,
                    176.0,
                    135.6,
                    148.5,
                    {
                        y: 216.4,
                        color: '#BF0B23',
                        borderColor: '#BF0B23'
                    },
                    194.1,
                    95.6,
                    54.4
                ]
            }
        ]
    });

    assert.strictEqual(
        chart.series[0].points[8].graphic.attr('stroke').toLowerCase(),
        '#bf0b23',
        'Initial color'
    );
});

QUnit.test(
    'Bordered column top edge should align with its axis gridline (#24829)',
    function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                type: 'column',
                height: 240,
                animation: false
            },
            xAxis: {
                visible: false
            },
            yAxis: {
                tickInterval: 5,
                gridLineWidth: 1
            },
            series: [
                {
                    data: [5],
                    borderWidth: 1
                }
            ]
        });

        var yAxis = chart.yAxis[0],
            gridLineY = yAxis.ticks[5].gridLine.element
                .getBoundingClientRect().top,
            barTopY = chart.series[0].points[0].graphic.element
                .getBoundingClientRect().top;

        assert.strictEqual(
            barTopY,
            gridLineY,
            'The bordered column\'s top edge should be crisped to the ' +
                'same pixel as the gridline at the same value'
        );
    }
);
