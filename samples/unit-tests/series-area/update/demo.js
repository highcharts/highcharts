QUnit.test('Updating series stacked property', assert => {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'area',
            width: 600,
            height: 350
        },
        xAxis: {
            categories: ['Apples', 'Pears', 'Oranges', 'Bananas', 'Grapes', 'Plums', 'Strawberries', 'Raspberries']
        },
        series: [{
            name: 'John',
            data: [0, 1, 4, 4, 5, 2, 3, 7]
        }, {
            name: 'Jane',
            data: [1, 0, 3, null, 3, 1, 2, 1]
        }]
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
});
