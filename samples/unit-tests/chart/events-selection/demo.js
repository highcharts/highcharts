/* global TestController */

QUnit.test('Selection event', function (assert) {

    var chart = Highcharts.chart('container', {
        chart: {
            zoomType: 'x',
            events: {
                selection: function () {
                    this.destroy();
                    return false;
                }
            }
        },
        series: [{
            type: 'area',
            name: 'USD to EUR',
            data: [1, 3, 2, 4, 3, 5, 4, 6, 5, 7]
        }]
    });

    var controller = new TestController(chart);

    // Pan
    controller.pan([200, 100], [150, 100], { shiftKey: true });
    assert.strictEqual(
        chart.index,
        undefined,
        'Chart should be destroyed without errors (#7611)'
    );
});

QUnit.test('Chart select points by drag', function (assert) {

    /**
     * Custom selection handler that selects points and cancels the default zoom behaviour
     */
    var selectPointsByDrag = function (e) {

        // Select points
        Highcharts.each(this.series, function (series) {
            Highcharts.each(series.points, function (point) {
                if (point.x >= e.xAxis[0].min && point.x <= e.xAxis[0].max &&
                    point.y >= e.yAxis[0].min && point.y <= e.yAxis[0].max) {
                    point.select(true, true);
                }
            });
        });

        return false;
    };

    var chart = Highcharts.chart('container', {

        title: {
            text: 'Select points by click-drag'
        },

        chart: {
            type: 'scatter',
            events: {
                selection: selectPointsByDrag
            },
            zoomType: 'xy'
        },

        series: [{
            data: [[161.2, 51.6], [167.5, 59.0], [159.5, 49.2], [157.0, 63.0], [155.8, 53.6],
            [170.0, 59.0], [159.1, 47.6], [166.0, 69.8], [176.2, 66.8], [160.2, 75.2],
            [172.5, 55.2], [170.9, 54.2], [172.9, 62.5], [153.4, 42.0], [160.0, 50.0],
            [147.2, 49.8], [168.2, 49.2], [175.0, 73.2], [157.0, 47.8], [167.6, 68.8],
            [159.5, 50.6], [175.0, 82.5], [166.8, 57.2], [176.5, 87.8], [170.2, 72.8],
            [174.0, 54.5], [173.0, 59.8], [179.9, 67.3], [170.5, 67.8], [160.0, 47.0],
            [154.4, 46.2], [162.0, 55.0], [176.5, 83.0], [160.0, 54.4], [152.0, 45.8],
            [162.1, 53.6], [170.0, 73.2], [160.2, 52.1], [161.3, 67.9], [166.4, 56.6],
            [168.9, 62.3], [163.8, 58.5], [167.6, 54.5], [160.0, 50.2], [161.3, 60.3],
            [167.6, 58.3], [165.1, 56.2], [160.0, 50.2], [170.0, 72.9], [157.5, 59.8],
            [167.6, 61.0], [160.7, 69.1], [163.2, 55.9], [152.4, 46.5], [157.5, 54.3],
            [168.3, 54.8], [180.3, 60.7], [165.5, 60.0], [165.0, 62.0], [164.5, 60.3],
            [156.0, 52.7], [160.0, 74.3], [163.0, 62.0], [165.7, 73.1], [161.0, 80.0],
            [162.0, 54.7], [166.0, 53.2], [174.0, 75.7], [172.7, 61.1], [167.6, 55.7],
            [151.1, 48.7], [164.5, 52.3], [163.5, 50.0], [152.0, 59.3], [169.0, 62.5],
            [164.0, 55.7], [161.2, 54.8], [155.0, 45.9], [170.0, 70.6], [176.2, 67.2],
            [170.0, 69.4], [162.5, 58.2], [170.3, 64.8], [164.1, 71.6], [169.5, 52.8],
            [163.2, 59.8], [154.5, 49.0], [159.8, 50.0], [173.2, 69.2], [170.0, 55.9],
            [161.4, 63.4], [169.0, 58.2], [166.2, 58.6], [159.4, 45.7], [162.5, 52.2]],
            showInLegend: false
        }]
    });

    assert.strictEqual(
        chart.getSelectedPoints().length,
        0,
        'No selected points initially'
    );

    var controller = new TestController(chart);

    controller.pan([200, 200], [300, 300], { shiftKey: true });

    assert.ok(
        chart.getSelectedPoints().length > 0,
        'Has selected points after drag'
    );

});