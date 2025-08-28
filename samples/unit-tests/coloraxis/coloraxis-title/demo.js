QUnit.test('Color axis title should render', function (assert) {
    var chart = Highcharts.chart('container', {
        colorAxis: {
            title: { text: 'Test Title' }
        },
        series: [{
            type: 'heatmap',
            data: [[0, 0, 1], [0, 1, 2]]
        }]
    });

    var colorAxis = chart.colorAxis[0];
    assert.ok(
        colorAxis.axisTitle &&
        colorAxis.axisTitle.element.textContent === 'Test Title',
        'Color axis title is rendered with correct text'
    );
});