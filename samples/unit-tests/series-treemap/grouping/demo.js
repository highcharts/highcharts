QUnit.test('Treemap Grouping, #20692.', assert => {
    const data = [{
            value: 600,
            name: 'A'
        }, {
            value: 200,
            name: 'B'
        }, {
            value: 1,
            name: 'C'
        }, {
            value: 3,
            name: 'D'
        }, {
            value: 2,
            name: 'E'
        }, {
            value: 4,
            name: 'F'
        }, {
            value: 2,
            name: 'G'
        }, {
            value: 4,
            name: 'H'
        }],
        chart = Highcharts.chart('container', {
            plotOptions: {
                treemap: {
                    cluster: {
                        enabled: true,
                        pixelWidth: 30,
                        pixelHeight: 30
                    }
                }
            },
            series: [{
                name: 'Regions',
                type: 'treemap',
                layoutAlgorithm: 'squarified',
                data
            }]
        }),
        series = chart.series[0];

    assert.strictEqual(
        series['level-group-1'].element.children.length,
        3,
        'Only three points should be rendered due to grouping small leafs.'
    );

    chart.setSize(1000, 1000);

    assert.strictEqual(
        series['level-group-1'].element.children.length,
        data.length,
        `After changing the chart dimensions more points should be rendered due
        to grouping small leafs.`
    );

    series.update({
        cluster: {
            pixelWidth: 80,
            minimumClusterSize: 2
        }
    });

    assert.strictEqual(
        series.group.element.children[0].children.length,
        3,
        `After updating the threshold pixelWidth less points should be
        rendered.`
    );

    chart.setSize(600, 400);

    series.setData([{
        value: 600,
        name: 'A'
    }, {
        value: 200,
        name: 'B'
    }]);

    assert.strictEqual(
        series.points.find(point => point.node.isGroup),
        void 0,
        `When points are bigger than grouping threshold group point should not
        exist.`
    );

    series.setData([{
        name: 'Parent 1',
        id: 'par1',
        color: Highcharts.getOptions().colors[0]
    }, {
        value: 600,
        name: 'A',
        parent: 'par1'
    }, {
        value: 200,
        name: 'B',
        parent: 'par1'
    }, {
        value: 1,
        name: 'C',
        parent: 'par1'
    }, {
        value: 3,
        name: 'D',
        parent: 'par1'
    }, {
        value: 2,
        name: 'E',
        parent: 'par1'
    }, {
        value: 4,
        name: 'F',
        parent: 'par1'
    }, {
        value: 2,
        name: 'G',
        parent: 'par1'
    }, {
        value: 4,
        name: 'H',
        parent: 'par1'
    }, {
        name: 'Parent 2',
        id: 'par2',
        color: Highcharts.getOptions().colors[1]
    }, {
        value: 600,
        name: 'A2',
        parent: 'par2'
    }, {
        value: 200,
        name: 'B2',
        parent: 'par2'
    }, {
        value: 1,
        name: 'C2',
        parent: 'par2'
    }, {
        value: 3,
        name: 'D2',
        parent: 'par2'
    }, {
        value: 2,
        name: 'E2',
        parent: 'par2'
    }, {
        value: 4,
        name: 'F2',
        parent: 'par2'
    }, {
        value: 2,
        name: 'G2',
        parent: 'par2'
    }, {
        value: 4,
        name: 'H2',
        parent: 'par2'
    }], false);

    series.update({
        cluster: {
            enabled: true,
            pixelWidth: 60,
            pixelHeight: 25
        },
        layoutAlgorithm: 'sliceAndDice'
    });

    assert.strictEqual(
        series.points.filter(point => point.node.isGroup).length,
        2,
        'For two parents there should be two group points.'
    );

    series.update({
        cluster: {
            enabled: false
        }
    });

    assert.strictEqual(
        series.points.find(point => point.node.isGroup),
        void 0,
        'If grouping id disabled group points shouldn\'t be rendered.'
    );

    series.update({
        allowTraversingTree: true,
        cluster: {
            enabled: true
        }
    });

    series.setRootNode('par1');

    assert.notEqual(
        series.points.find(point =>
            point.node.isGroup && point.node.parent === 'par1'
        ).drillId,
        void 0,
        'Traversing should  be possible for grouped node.'
    );

    series.setRootNode('');

    const tooltipText = 'New tooltip content';

    chart.update({
        tooltip: {
            clusterFormat: tooltipText
        }
    });

    series.points.find(point => point.node.isGroup).onMouseOver();

    assert.strictEqual(
        chart.tooltip.label.text.textStr,
        tooltipText,
        'Tooltip format for grouped nodes should be updated correctly.'
    );
});
