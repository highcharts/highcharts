QUnit.test('Treemap and updates', function (assert) {
    var chart = Highcharts.chart('container', {
            series: [
                {
                    type: 'treemap',
                    allowTraversingTree: true,
                    data: [
                        {
                            id: 'id_1',
                            name: 'A'
                        },
                        {
                            id: 'id_2',
                            name: 'A1',
                            value: 2,
                            parent: 'id_1'
                        },
                        {
                            id: 'id_3',
                            name: 'A2',
                            value: 2,
                            parent: 'id_1'
                        },
                        {
                            name: 'B',
                            value: 6
                        }
                    ]
                }
            ]
        }),
        series = chart.series[0];

    series.update({
        data: [
            {
                id: 'id_1',
                name: 'A'
            },
            {
                id: 'id_2',
                name: 'A1',
                value: 10,
                parent: 'id_1'
            },
            {
                id: 'id_3',
                name: 'A2',
                value: 12,
                parent: 'id_1'
            },
            {
                name: 'B',
                value: 6
            }
        ]
    });

    assert.strictEqual(
        chart.container.querySelectorAll('.highcharts-point').length,
        4,
        'All point-graphic elements exist in DOM (#11829)'
    );

    chart.series[0].setRootNode('id_1');
    chart.series[0].update({
        data: [{
            name: 'K',
            value: 5
        }]
    });

    assert.ok(
        true, '#10159: Updating data while traversed down should not ' +
        'throw'
    );
});

QUnit.test('Update and z-index', function (assert) {
    // Sample data for the treemap
    const data = [
        {
            name: 'Root',
            id: 'id-0'
        },
        {
            name: 'Child 1',
            id: 'id-1',
            parent: 'id-0',
            value: 6
        },
        {
            name: 'Child 2',
            id: 'id-2',
            parent: 'id-0',
            value: 4
        },
        {
            name: 'Grandchild 1',
            id: 'id-3',
            parent: 'id-1',
            value: 2
        },
        {
            name: 'Grandchild 2',
            id: 'id-4',
            parent: 'id-1',
            value: 4
        },
        {
            name: 'Grandchild 5',
            id: 'id-5',
            parent: 'id-2',
            value: 4
        }
    ];

    // Initialize the treemap
    const chart = Highcharts.chart('container', {
        series: [
            {
                type: 'treemap',
                layoutAlgorithm: 'squarified',
                data: data,
                allowDrillToNode: true,
                opacity: 1,
                interactByLeaf: false,
                dataLabels: {
                    enabled: false
                },
                levelIsConstant: false,
                breadcrumbs: {
                    showFullPath: true
                },
                levels: [
                    {
                        level: 1,
                        borderWidth: 5,
                        dataLabels: {
                            enabled: true
                        }
                    }
                ]
            }
        ]
    });

    function navigateToNode(nodeId) {
        const series = chart.series[0];
        series.setRootNode(nodeId, true);
    }
    function addData(newData) {
        const series = chart.series[0];
        series.update({ data: [...series.userOptions.data, ...newData] }, true);
    }

    navigateToNode('id-2');

    addData([
        { name: 'Added Node 1', id: 'id-6', parent: 'id-5', value: 5 },
        { name: 'Added Node 2', id: 'id-7', parent: 'id-5', value: 2 }
    ]);

    assert.strictEqual(
        chart.get('id-6').graphic.element.parentNode
            .getAttribute('data-z-index'),
        '-4',
        'Added nodes to traversed tree should have a static z-index (#23432)'
    );
});