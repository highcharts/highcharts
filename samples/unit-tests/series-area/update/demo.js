QUnit.test('Updating series stacked property', assert => {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'area',
            width: 600,
            height: 350,
            animation: true
        },
        xAxis: {
            categories: [
                'Apples',
                'Pears',
                'Oranges',
                'Bananas',
                'Grapes',
                'Plums',
                'Strawberries',
                'Raspberries'
            ]
        },
        series: [
            {
                name: 'John',
                data: [0, 1, 4, 4, 5, 2, 3, 7]
            },
            {
                name: 'Jane',
                data: [1, 0, 3, null, 3, 1, 2, 1]
            }
        ]
    });

    const graphPath = chart.series[0].graph.element.getAttribute('d');

    assert.strictEqual(
        graphPath.indexOf('M'),
        0,
        'Initial graph should now be generated'
    );

    chart.update({
        plotOptions: {
            area: {
                stacking: 'normal'
            }
        }
    });

    assert.notEqual(
        graphPath,
        chart.series[0].graph.element.getAttribute('d'),
        'The graph should be changed'
    );

    chart.update({
        plotOptions: {
            area: {
                stacking: undefined
            }
        }
    });

    assert.strictEqual(
        graphPath,
        chart.series[0].graph.element.getAttribute('d'),
        'The graph should be back to the initial'
    );

    // Issue #13572
    assert.ok(
        chart.series[0].areaPath.slice(-1)[0].includes('Z'),
        'The last index of the path array contains the closure'
    );

    chart.series[0].update({
        data: []
    });

    assert.strictEqual(
        chart.series[0].areaPath.length,
        0,
        'Path should be empty when there is no data'
    );

    chart.series[1].update({
        data: []
    });

    assert.ok(
        true,
        '#15534: Updating from data containing nulls to no data should not throw'
    );
});
