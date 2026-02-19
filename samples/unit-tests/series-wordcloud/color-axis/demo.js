QUnit.test('Color axis should be supported for wordcloud', function (assert) {
    const chart = Highcharts.chart('container', {
        colorAxis: {
            minColor: '#0f0',
            maxColor: '#f00'
        },
        series: [
            {
                type: 'wordcloud',
                data: [
                    { name: 'init-5', y: 5, weight: 5 },
                    { name: 'init-50', y: 50, weight: 50 },
                    { name: 'init-100', y: 100, weight: 100 }
                ]
            }
        ]
    });

    assert.strictEqual(
        chart.series[0].points[0].color,
        'rgb(13,242,0)',
        'First point should be green'
    );

    assert.strictEqual(
        chart.series[0].points[2].color,
        'rgb(255,0,0)',
        'Third point should be red'
    );

    chart.update({
        series: [
            {
                data: [
                    { name: 'updated-10', y: 10, weight: 5 },
                    { name: 'updated-50', y: 50, weight: 50 },
                    { name: 'updated-100', y: 100, weight: 100 }
                ]
            }
        ]
    }, true, true);

    assert.strictEqual(
        chart.series[0].points[0].color,
        'rgb(13,242,0)',
        'After update: first point should still map to green range'
    );

    assert.strictEqual(
        chart.series[0].points[2].color,
        'rgb(255,0,0)',
        'After update: last point should be red'
    );
});
