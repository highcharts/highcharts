QUnit.test('Drilldown across types', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'pie'
        },
        title: {
            text: 'Drilldown from column to pie'
        },
        xAxis: {
            type: 'category',
            showEmpty: false
        },
        yAxis: {
            showEmpty: false
        },

        legend: {
            enabled: false
        },

        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true
                }
            }
        },

        series: [
            {
                name: 'Things',
                colorByPoint: true,
                data: [
                    {
                        name: 'Animals',
                        y: 5,
                        drilldown: 'animals'
                    },
                    {
                        name: 'Fruits',
                        y: 2,
                        drilldown: 'fruits'
                    },
                    {
                        name: 'Cars',
                        y: 4,
                        drilldown: 'cars'
                    }
                ],
                type: 'column'
            }
        ],
        drilldown: {
            series: [
                {
                    id: 'animals',
                    name: 'Animals series',
                    data: [
                        ['Cats', 4],
                        ['Dogs', 2],
                        ['Cows', 1],
                        ['Sheep', 2],
                        ['Pigs', 1]
                    ]
                },
                {
                    id: 'fruits',
                    data: [
                        ['Apples', 4],
                        ['Oranges', 2]
                    ]
                },
                {
                    id: 'cars',
                    data: [
                        ['Toyota', 4],
                        ['Opel', 2],
                        ['Volkswagen', 2]
                    ]
                }
            ]
        }
    });

    chart.options.drilldown.animation = false;

    assert.equal(chart.series.length, 1, 'Chart created');

    chart.series[0].points[0].doDrilldown();

    assert.equal(chart.series[0].name, 'Animals series', 'Second level name');

    assert.equal(chart.series[0].type, 'pie', 'Second level type');

    // Check that the point actually draws an arc
    assert.equal(
        typeof chart.series[0].points[0].graphic.element
            .getAttribute('d')
            .indexOf('A'),
        'number',
        'Point is arc'
    );

    assert.notEqual(
        chart.series[0].points[0].graphic.element
            .getAttribute('d')
            .indexOf('A'),
        -1,
        'Point is arc'
    );

    chart.drillUp();

    assert.equal(chart.series[0].name, 'Things', 'First level name');

    assert.equal(chart.series[0].type, 'column', 'First level type');

    chart = Highcharts.chart('container', {
        xAxis: {
            type: 'category',
            title: ''
        },
        yAxis: {
            title: ''
        },
        legend: {
            enabled: false
        },
        series: [
            {
                type: 'column',
                data: [
                    {
                        name: 'Drilldown',
                        y: 62.74,
                        drilldown: 'tree'
                    },
                    {
                        name: 'A',
                        y: 10.57
                    }
                ]
            }
        ],
        drilldown: {
            series: [
                {
                    type: 'treemap',
                    id: 'tree',
                    layoutAlgorithm: 'stripes',
                    levels: [
                        {
                            level: 1,
                            layoutAlgorithm: 'sliceAndDice'
                        }
                    ],
                    data: [
                        {
                            id: 'A',
                            name: 'Apples',
                            color: '#EC2500'
                        },
                        {
                            id: 'B',
                            name: 'Bananas',
                            color: '#ECE100'
                        },
                        {
                            name: 'Anne',
                            parent: 'A',
                            value: 5
                        },
                        {
                            name: 'Rick',
                            parent: 'A',
                            value: 3
                        },
                        {
                            name: 'Peter',
                            parent: 'A',
                            value: 4
                        },
                        {
                            name: 'Anne',
                            parent: 'B',
                            value: 4
                        }
                    ]
                }
            ]
        }
    });

    chart.series[0].points[0].doDrilldown();
    chart.drillUp();

    assert.strictEqual(
        chart.xAxis[0].max,
        1,
        'After drillup treemap axes options should be reset (#12326).'
    );

    chart = Highcharts.chart('container', {
        xAxis: {
            type: 'category',
            title: ''
        },
        yAxis: {
            title: ''
        },
        legend: {
            enabled: false
        },
        series: [
            {
                type: 'treemap',
                id: 'tree',
                layoutAlgorithm: 'stripes',
                levels: [
                    {
                        level: 1,
                        layoutAlgorithm: 'sliceAndDice'
                    }
                ],
                data: [
                    {
                        id: 'A',
                        name: 'Apples',
                        color: '#EC2500'
                    },
                    {
                        id: 'B',
                        name: 'Bananas',
                        color: '#ECE100'
                    },
                    {
                        name: 'Anne',
                        parent: 'A',
                        value: 5,
                        drilldown: 'column'
                    },
                    {
                        name: 'Rick',
                        parent: 'A',
                        value: 3
                    },
                    {
                        name: 'Peter',
                        parent: 'A',
                        value: 4
                    },
                    {
                        name: 'Anne',
                        parent: 'B',
                        value: 4
                    }
                ]
            }
        ],
        drilldown: {
            series: [
                {
                    type: 'column',
                    id: 'column',
                    data: [
                        {
                            name: 'Drilldown',
                            y: 62.74
                        },
                        {
                            name: 'A',
                            y: 10.57
                        }
                    ]
                }
            ]
        }
    });

    chart.series[0].points[2].doDrilldown();

    assert.strictEqual(
        chart.xAxis[0].max,
        1,
        'After drilldown treemap axes options should be reset (#12326).'
    );

    chart.drillUp();
    chart.update({
        series: [{
            type: 'column',
            data: [{
                name: 'A',
                y: 50,
                drilldown: 'A'
            }]
        }],
        drilldown: {
            series: [{
                name: 'A',
                id: 'A',
                type: 'wordcloud',
                data: [{
                    name: 'Test',
                    weight: 1
                }]
            }]
        }
    });
    chart.series[0].points[0].doDrilldown();

    chart.axes.forEach(axis => {
        assert.strictEqual(
            axis.axisLine,
            void 0,
            `After drilldown from cartesian series to non-cartesian ${axis.coll}
            shouldn't be visible. (#19725).`
        );
    });

    chart.drillUp();
    chart.axes.forEach(axis => {
        assert.notEqual(
            axis.axisLine,
            void 0,
            `After drill up from non-cartesian series to cartesian ${axis.coll}
            should be visible. (#19725).`
        );
    });
});
