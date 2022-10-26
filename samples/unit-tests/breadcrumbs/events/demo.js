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
        test = new TestController(chart),
        breadrumbs = chart.breadcrumbs;

    chart.series[0].points[0].doDrilldown();
    test.triggerEvent(
        'click',
        chart.breadcrumbs.group.translateX + 10,
        chart.breadcrumbs.group.translateY + 10
    );

    const buttons = chart.breadcrumbs.group.element.childNodes;

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
    test.triggerEvent(
        'click',
        chart.breadcrumbs.group.translateX + 10,
        chart.breadcrumbs.group.translateY + 10
    );
    assert.strictEqual(
        chart.container.getElementsByClassName('highcharts-breadcrumbs-group').length,
        1,
        'The breadcrumbs separators group should be destroyed.'
    );
});