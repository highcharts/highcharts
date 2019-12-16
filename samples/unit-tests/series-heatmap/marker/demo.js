QUnit.test('General marker tests', function (assert) {

    var chart = Highcharts.chart('container', {
        chart: {
            type: 'heatmap'
        },

        colorAxis: {
            stops: [
                [0, '#8b0000'],
                [0.5, '#ffffff'],
                [1, '#00008b']
            ]
        },

        series: [{
            data: [
                [0, 0, 1], [0, 1, 1.1], [0, 2, 1.2],
                [1, 0, 2], [1, 1, 2.1], [1, 2, 2.2],
                [2, 0, 3], [2, 1, 3.1], [2, 2, 3.2]
            ]
        }]
    });

    var heatmap = chart.series[0];

    // Check setting a series marker's lineWidth and lineColor
    heatmap.update({
        marker: {
            lineWidth: 2,
            lineColor: 'rgba(0, 255, 0, 1)'
        }
    });

    var marker = heatmap.points[0].graphic;

    assert.strictEqual(
        marker.element.getAttribute('stroke'),
        'rgba(0, 255, 0, 1)',
        'Marker\'s line color is set.'
    );

    assert.strictEqual(
        marker.element.getAttribute('stroke-width'),
        '2',
        'Marker\'s line width is set.'
    );

    // Set marker's fixed width and height
    heatmap.update({
        marker: {
            width: 50,
            height: 50
        }
    });

    var bBox = heatmap.points[0].graphic.getBBox();

    assert.strictEqual(
        bBox.width - heatmap.options.marker.lineWidth === 50 &&
        bBox.height - heatmap.options.marker.lineWidth === 50,
        true,
        'Marker\'s fixed width and height are set correctly through series.marker options.'
    );

    var point = heatmap.points[4];

    point.update({
        marker: {
            width: 20,
            height: 20,
            lineColor: 'red',
            lineWidth: 5
        }
    });

    bBox = point.graphic.getBBox();

    assert.strictEqual(
        bBox.width - point.options.marker.lineWidth === 20 &&
        bBox.height - point.options.marker.lineWidth === 20,
        true,
        'Marker\'s fixed width and height are set correctly through point.marker, and marker\'s lineWidth and color as well.'
    );

});
