QUnit.test('Color axis in styled mode (#6049)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'heatmap'
        },
        colorAxis: {
            minColor: '#0000ff',
            maxColor: '#9999ff'
        },
        series: [{
            data: [
                [0, 0, 1],
                [0, 1, 2],
                [1, 0, 3],
                [1, 1, 4]
            ]
        }]
    });

    function getStyle(elem, prop) {
        return window.getComputedStyle(elem, null).getPropertyValue(prop);
    }

    assert.strictEqual(
        Highcharts.color(
            getStyle(chart.series[0].points[1].graphic.element, 'fill')
        ).get(),
        'rgb(51,51,255)',
        'Heatmap: color is applied'
    );

    // Map chart
    chart = Highcharts.mapChart('container', {
        colorAxis: {
            minColor: '#0000ff',
            maxColor: '#9999ff'
        },
        series: [{
            data: [{
                path: ['M', 0, 0, 'L', 100, 100, 'L', 50, 200],
                value: 1
            }, {
                path: ['M', 0, 0, 'L', 100, 100, 'L', 0, 200],
                value: 2
            }, {
                path: ['M', 0, 0, 'L', 100, 100, 'L', 100, 200],
                value: 3
            }, {
                path: ['M', 0, 0, 'L', 100, 100, 'L', 70, 200],
                value: 4
            }]
        }]
    });

    assert.strictEqual(
        Highcharts.color(
            getStyle(chart.series[0].points[1].graphic.element, 'fill')
        ).get(),
        'rgb(51,51,255)',
        'Map series: color is applied'
    );

});
