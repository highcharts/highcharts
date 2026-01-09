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
                    { name: 'value-5', y: 5, weight: 5 },
                    { name: 'value-50', y: 50, weight: 50 },
                    { name: 'value-100', y: 100, weight: 100 }
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
});
