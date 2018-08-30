QUnit.test('Stack labels on non-data axis', function (assert) {

    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        yAxis: {
            min: 100,
            stackLabels: {
                enabled: true
            }
        },
        plotOptions: {
            column: {
                stacking: 'normal'
            }
        },
        series: [{
            data: [-10, -10, -15]
        }]
    });


    assert.strictEqual(
        chart.container.querySelector('.highcharts-stack-labels text')
            .getAttribute('y'),
        '0',
        'Y attribute is set (#8834)'
    );
    assert.strictEqual(
        chart.container.querySelector('.highcharts-stack-labels text')
            .getAttribute('visibility'),
        'hidden',
        'Stack label is hidden (#8834)'
    );
});
