QUnit.test('Breadcrumbs button- check if the created path is correct.', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        xAxis: {
            type: 'category'
        },
        title: {
            text: null
        },
        series: [{
            name: 'Supply',
            data: [{
                name: 'Fruits',
                y: 5,
                drilldown: 'Fruits'
            }, {
                name: 'Vegetables',
                y: 6
            }, {
                name: 'Meat',
                y: 3
            }]
        }],
        drilldown: {
            breadcrumbs: {
                floating: false
            },
            animation: false,
            series: [{
                name: 'Fruits',
                id: 'Fruits',
                data: [
                    ['Citrus', 2],
                    ['Tropical', 5],
                    ['Other', 1]
                ]
            }]
        }
    });

    assert.strictEqual(
        chart.yAxis[0].top,
        10,
        'Space should not be reserved before the drilldown.'
    );

    chart.series[0].points[0].doDrilldown();
    assert.ok(
        chart.yAxis[0].top > 10,
        'Space should be reserved after the drilldown.'
    );


    Highcharts.fireEvent(chart.breadcrumbs, 'up', { newLevel: 0 });

    assert.strictEqual(
        chart.yAxis[0].top,
        10,
        'Spacing should reset after drillUp.'
    );
});
