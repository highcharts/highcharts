QUnit.test('Treemap Grouping, #20692.', assert => {
    const chart = Highcharts.chart('container', {
            plotOptions: {
                treemap: {
                    groupAreaThreshold: {
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
                data: [{
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
                }]
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
        7,
        `After changing the chart dimensions more points should be rendered due
        to grouping small leafs.`
    );

    series.update({
        groupAreaThreshold: {
            pixelWidth: 80
        }
    });

    assert.strictEqual(
        series.group.element.children[0].children.length,
        4,
        `After updating the threshold pixelWidth less points should be
        rendered.`
    );

});
