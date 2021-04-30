QUnit.test('Updating gauge series', assert => {
    const clock = TestUtilities.lolexInstall();

    const chart = Highcharts.chart('container', {
        chart: {
            type: 'gauge',
            animation: true
        },
        plotOptions: {
            gauge: {
                dial: {
                    backgroundColor: '#ff0000'
                }
            }
        },
        yAxis: {
            min: 0,
            max: 200,
            tickPixelInterval: 30,
            labels: {
                allowOverlap: false,
                format: 'Really long tick label'
            }
        },
        series: [
            {
                data: [93]
            }
        ]
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

    clock.tick(600);

    assert.strictEqual(
        chart.series[0].points[0].graphic.element.getAttribute('fill'),
        'rgb(0,0,255)',
        'The dial should be blue after update'
    );

    assert.ok(
        Object.values(chart.yAxis[0].ticks).some(t => t.label.opacity === 0),
        '#15528: Some tick labels should still be hidden after update'
    );

    TestUtilities.lolexUninstall(clock);
});
