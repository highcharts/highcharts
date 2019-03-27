QUnit.test('Check that deprecated options are moved over', function (assert) {
    var chart = Highcharts.chart('container', {
            chart: {
                description: 'chartDesc',
                typeDescription: 'chartTypeDesc',
                inverted: true
            },
            series: [{
                description: 'seriesDesc',
                skipKeyboardNavigation: true,
                pointDescriptionFormatter: function () {},
                exposeElementToA11y: false,
                test: 'hello',
                data: [
                    1, 2, { y: 5, test: 'testStr', description: 'yo' }, 3
                ]
            }]
        }),
        chartOptions = chart.options,
        seriesOptions = chart.series[0].options,
        pointOptions = chart.series[0].points[2].options;

    assert.strictEqual(chartOptions.chart.inverted, true);
    assert.strictEqual(chartOptions.accessibility.description, 'chartDesc');
    assert.strictEqual(
        chartOptions.accessibility.typeDescription, 'chartTypeDesc'
    );

    assert.strictEqual(seriesOptions.test, 'hello');
    assert.strictEqual(seriesOptions.accessibility.description, 'seriesDesc');
    assert.ok(seriesOptions.accessibility.pointDescriptionFormatter);
    assert.strictEqual(seriesOptions.accessibility.exposeAsGroupOnly, false);
    assert.strictEqual(
        seriesOptions.accessibility.keyboardNavigation.enabled, false
    );

    assert.strictEqual(pointOptions.test, 'testStr');
    assert.strictEqual(pointOptions.y, 5);
    assert.strictEqual(pointOptions.accessibility.description, 'yo');
});
