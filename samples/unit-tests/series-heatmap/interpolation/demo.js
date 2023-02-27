QUnit.test('Interpolated image test', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'heatmap'
        },

        colorAxis: {
            stops: [
                [0, '#3060cf'],
                [0.5, '#fffbbc'],
                [0.9, '#c4463a']
            ]
        },

        series: [
            {
                data: [
                    [1, 0, 2],
                    [1, 1, 2.1],
                    [1, 2, 2.2],
                    [2, 0, 3],
                    [2, 1, 3.1],
                    [2, 2, 3.2]
                ],
                interpolation: true
            }
        ]
    });

    var heatmap = chart.series[0];

    assert.strictEqual(heatmap.image.element.tagName, 'image', 'An image-tagname should exist');
});