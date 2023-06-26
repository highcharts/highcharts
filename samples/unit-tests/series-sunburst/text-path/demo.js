QUnit.test('TextPath for dataLabels in sunburst #12373', function (assert) {
    var chart = Highcharts.chart('container', {
        series: [
            {
                type: 'sunburst',
                data: [
                    {
                        id: '0.0',
                        parent: '',
                        name: 'test'
                    },
                    {
                        id: '1.1',
                        parent: '0.0',
                        name: 'test1'
                    },
                    {
                        id: '1.2',
                        parent: '0.0',
                        name: 'test2'
                    },
                    {
                        parent: '1.1',
                        value: 3,
                        name: 'First'
                    },
                    {
                        parent: '1.1',
                        value: 2,
                        name: 'SecondSecondSecondSecond'
                    },
                    {
                        parent: '1.1',
                        value: 1,
                        name: 'ThirdThird'
                    },
                    {
                        parent: '1.2',
                        value: 3,
                        name: 'First'
                    },
                    {
                        parent: '1.2',
                        value: 2,
                        name: 'SecondSecondSecondSecond'
                    },
                    {
                        parent: '1.2',
                        value: 1,
                        name: 'ThirdThird'
                    }
                ],
                allowDrillToNode: true,
                dataLabels: {
                    textPath: {
                        enabled: true,
                        attributes: {
                            dy: 5
                        }
                    }
                },
                levels: [
                    {
                        level: 1
                    },
                    {
                        level: 2,
                        colorByPoint: true
                    }
                ]
            }
        ]
    });

    var series = chart.series[0],
        points = series.points;

    assert.strictEqual(
        points[0].dlOptions.textPath.enabled,
        false,
        'Center label should have textPath disabled'
    );

    assert.strictEqual(
        Highcharts.defined(points[0].dataLabels[0].textPath),
        false,
        'Text path should not exist for the center label'
    );

    assert.strictEqual(
        Highcharts.defined(points[7].dataLabels[0].textPath),
        true,
        'Text path should exist for this data label'
    );

    assert.strictEqual(
        points[7].dataLabels[0].element.textContent.indexOf(
            '…'
        ) > 0,
        true,
        'Ellipsis should be applied with this data label'
    );
    // drilldown
    var point = points[2],
        drillId = point && point.drillId;
    if (Highcharts.isString(drillId)) {
        series.setRootNode(drillId, true, {
            trigger: 'click'
        });
    }

    assert.strictEqual(
        chart.container
            .querySelectorAll(
                '.highcharts-breadcrumbs-group .highcharts-breadcrumbs-button'
            )
            .length,
        3,
        'There should be three breadcrumbs items'
    );

    assert.strictEqual(
        points[2].dlOptions.textPath.enabled,
        false,
        'Center label has changed after drilldown and should have textPath disabled'
    );

    assert.strictEqual(
        Highcharts.defined(points[2].dataLabels[0].textPath),
        false,
        'Text path should not exist for the center label'
    );

    assert.strictEqual(
        points[7].dataLabels[0].element.textContent.indexOf(
            '…'
        ) > 0,
        false,
        'Ellipsis should not be applied with this data label after drilldown'
    );
    // drillup
    var node = series.nodeMap[series.rootNode];
    if (node && Highcharts.isString(node.parent)) {
        series.setRootNode(node.parent, true, { trigger: 'traverseUpButton' });
    }

    assert.strictEqual(
        points[2].dlOptions.textPath.enabled,
        true,
        'Point have moved to initial position - is not a center point, so textPath should be enabled'
    );

    assert.strictEqual(
        Highcharts.defined(points[2].dataLabels[0].textPath),
        true,
        'Text path should exist for this data label'
    );

    assert.strictEqual(
        points[7].dataLabels[0].element.textContent.indexOf(
            '…'
        ) > 0,
        true,
        'Ellipsis should be applied with this data label after drillup'
    );
});
