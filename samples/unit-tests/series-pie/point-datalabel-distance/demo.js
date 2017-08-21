

QUnit.test('Pie Point dataLabel distance (#1174)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'pie'
        },

        plotOptions: {
            series: {
                animation: false,
                dataLabels: {
                    distance: 20
                },
                size: '100%'
            }
        },

        series: [{
            data: [{
                y: 3,
                dataLabels: {
                    distance: -30
                }
            }]
        }, {
            dataLabels: {
                distance: -30
            },
            data: [{
                y: 3
            }]
        }]
    });
    var dataLabel1 = chart.series[0].data[0].dataLabel,
        dataLabel2 = chart.series[1].data[0].dataLabel;

    assert.equal(
        dataLabel1.x,
        dataLabel2.x,
        'x value of dataLabels'
    );

    assert.equal(
        dataLabel1.y,
        dataLabel2.y,
        'y value of dataLabels'
    );

});

QUnit.test('Small pie and labels (#6992)', function (assert) {
    var chart = Highcharts.chart('container', {
        series: [{
            type: 'pie',
            size: 10,
            data: [1, 2, 3, 4, 5, 6, 7]
        }],
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    rotation: -45
                }
            }
        }
    });
    assert.strictEqual(
        chart.container.innerHTML.indexOf('NaN'),
        -1,
        'All numbers valid'
    );
});
