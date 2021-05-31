QUnit.test('Breadcrumbs format', function (assert) {
    const chart = Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            xAxis: {
                type: 'category'
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
                    enabled: true,
                    showFullPath: true,
                    events: {
                        click: function () {
                            return false;
                        }
                    }
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
        }),
        test = new TestController(chart);

    chart.series[0].points[0].doDrilldown();
    test.triggerEvent('click', 20, 60, {}, true);

    const buttons = chart.breadcrumbs.breadcrumbsGroup.element.childNodes;

    assert.strictEqual(
        buttons.length,
        3,
        'When click event returns false, drillup should not be performed.'
    );

    chart.update({
        drilldown: {
            breadcrumbs: {
                events: {
                    click: function () {
                        return true;
                    }
                }
            }
        }
    });
    test.triggerEvent('click', 20, 60, {}, true);
    assert.strictEqual(
        buttons.length,
        0,
        'When click event returns true, drillup should be performed and buttons removed.'
    );
});