QUnit.test('Updating gauge series', assert => {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'gauge'
        },
        plotOptions: {
            gauge: {
                dial: {
                    backgroundColor: '#ff0000'
                }
            }
        },
        series: [{
            data: [93]
        }]

    });

    assert.strictEqual(
        chart.series[0].points[0].graphic.element.getAttribute('fill'),
        '#ff0000',
        'The dial should be red initially'
    );

    chart.series[0].update({
        dial: {
            backgroundColor: '#0000ff'
        }
    });

    assert.strictEqual(
        chart.series[0].points[0].graphic.element.getAttribute('fill'),
        '#0000ff',
        'The dial should be blue after update'
    );

});
