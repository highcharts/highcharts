QUnit.test('Color axis title should render', function (assert) {
    const chart = Highcharts.chart('container', {
        colorAxis: {
            title: { text: 'Test Title' }
        },
        series: [{
            type: 'heatmap',
            data: [[0, 0, 1], [0, 1, 2]]
        }]
    });

    const colorAxis = chart.colorAxis[0];
    assert.ok(
        colorAxis.axisTitle &&
        colorAxis.axisTitle.element.textContent === 'Test Title',
        'Color axis title should be rendered with correct text'
    );
});

QUnit.test(
    'Color axis title should rotate with vertical legend',
    function (assert) {
        // Reuse the chart from the previous test by updating options
        const chart = Highcharts.chart('container', {
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },
            colorAxis: {
                title: { text: 'Test Title' }
            },
            series: [{
                type: 'heatmap',
                data: [[0, 0, 1], [0, 1, 2], [1, 0, 3], [1, 1, 4]]
            }]
        });

        const colorAxis = chart.colorAxis && chart.colorAxis[0];
        const title = colorAxis && colorAxis.axisTitle;

        // Rotation can be on the SVG transform or wrapper rotation property
        const transform = title && title.element &&
            title.element.getAttribute('transform');
        const hasRotateInTransform = !!(transform &&
            /rotate\(/.test(transform));
        const wrapperRotation = typeof (title && title.rotation) === 'number' ?
            title.rotation : null;

        assert.ok(
            hasRotateInTransform || (wrapperRotation !==
                null && isFinite(wrapperRotation)),
            'Color axis title is rotated with vertical legend'
        );
    }
);