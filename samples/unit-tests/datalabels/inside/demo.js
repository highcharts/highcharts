QUnit.test('Datalabel inside on columnrange(#2711)', function (assert) {
    var chart = $('#container')
        .highcharts({
            chart: {
                type: 'columnrange',
                inverted: true
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        inside: true
                    }
                }
            },
            series: [
                {
                    data: [
                        [-9.7, 9.4],
                        [-2.7, 10.4],
                        [-2.7, 9.4]
                    ]
                }
            ]
        })
        .highcharts();

    assert.lessThan(
        chart.series[0].data[0].dataLabel.x,
        chart.series[0].data[0].dataLabelUpper.x,
        'Correct positions'
    );
});

QUnit.test('Implicitly inside percent stacked bar', assert => {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'bar'
        },
        yAxis: {
            min: 0,
            max: 80
        },
        plotOptions: {
            series: {
                stacking: 'percent',
                dataLabels: {
                    enabled: true
                }
            }
        },
        series: [{
            data: [5, 3, 4, 7, 2]
        }, {
            data: [2, 2, 3, 2, 1]
        }, {
            data: [3, 4, 4, 2, 5]
        }]
    });

    assert.ok(
        chart.series[0].points[4].dataLabel.translateY > 0,
        '#15145: First series dataLabels should be visible'
    );
});
