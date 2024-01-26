QUnit.test('Breadcrumbs button', function (assert) {
    const chartOptions = {
            navigation: {
                breadcrumbs: {
                    buttonSpacing: 20
                }
            },
            series: [{
                breadcrumbs: {
                    showFullPath: false
                },
                type: 'treemap',
                name: 'Store',
                layoutAlgorithm: 'squarified',
                allowDrillToNode: true,
                dataLabels: {
                    enabled: false
                },
                levelIsConstant: false,
                levels: [{
                    level: 1,
                    dataLabels: {
                        enabled: true
                    },
                    borderWidth: 1
                }],
                data: [{
                    id: '1',
                    name: 'Fruits',
                    value: 5
                }, {
                    id: '2',
                    name: 'Vegetables',
                    value: 6
                }, {
                    id: '3',
                    name: 'Meat',
                    value: 3
                }, {
                    id: '1_1',
                    parent: '1',
                    name: 'Citrus',
                    value: 2
                }, {
                    id: '1_2',
                    parent: '1',
                    name: 'Tropical',
                    value: 5
                }, {
                    id: '1_3',
                    parent: '1',
                    name: 'Other',
                    value: 3
                }, {
                    id: '1_1_1',
                    parent: '1_1',
                    name: 'Lemon',
                    value: 3
                }, {
                    id: '1_1_2',
                    parent: '1_1',
                    name: 'Orange',
                    value: 3
                }, {
                    id: '1_1_1_1',
                    parent: '1_1_1',
                    name: 'Type A',
                    value: 3
                }, {
                    id: '1_1_1_1',
                    parent: '1_1_1',
                    name: 'Type B',
                    value: 4
                }]
            }]
        },
        chart =  Highcharts.chart('container', chartOptions);
    const series = chart.series[0];
    series.setRootNode('1_1_1');
    assert.ok(
        chart.drillUpButton.element,
        'Initially, the breadcrumbs should be disabled and the single drillUp button should exist.'
    );

    assert.strictEqual(
        chart.breadcrumbs.options.buttonSpacing,
        20,
        'Options from navigation should take effect'
    );

    chart.update(chartOptions);

    assert.ok(
        chart.breadcrumbs.group.element,
        'Breadcrumbs should not dissapear when chart.update is called (#19616).'
    );

    chart.series[0].update({
        breadcrumbs: {
            showFullPath: true
        }
    });

    const domGroup = chart
        .container
        .getElementsByClassName('highcharts-breadcrumbs-group');

    assert.strictEqual(
        domGroup.length,
        1,
        'Breadcrumbs groups should be created.'
    );
    const buttons = domGroup[0].childNodes;
    assert.strictEqual(
        buttons[buttons.length - 1].textContent,
        'Lemon',
        'The last button should have text Lemon.'
    );
    Highcharts.fireEvent(chart.breadcrumbs, 'up', { newLevel: 1 });

    assert.strictEqual(
        buttons[buttons.length - 1].textContent,
        'Fruits',
        'The last button should have text Fruits.'
    );

    Highcharts.fireEvent(chart.breadcrumbs, 'up', { newLevel: 0 });

    assert.strictEqual(
        chart.container.getElementsByClassName('highcharts-breadcrumbs-group').length,
        1,
        'The breadcrumbs separators group should be destroyed.'
    );
});
