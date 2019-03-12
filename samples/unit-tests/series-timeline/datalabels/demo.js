QUnit.test('Timeline: General tests.', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            width: 600,
            height: 400
        },

        series: [{
            showInLegend: true,
            dataLabels: {
                allowOverlap: false
            },
            type: 'timeline',
            data: [{
                name: 'Date 1',
                label: 'Some label',
                dataLabels: {
                    y: 50
                }
            }, {
                name: 'Date 2',
                label: 'Some label'
            }, {
                name: 'Date 3',
                label: 'Some label'
            }]
        }]
    });

    var series = chart.series[0],
        firstDL = series.points[0].dataLabel,
        secondDL = series.points[1].dataLabel;

    assert.strictEqual(
        secondDL.absoluteBox.y - firstDL.absoluteBox.y,
        50,
        "Data label's position is set from point configuration level."
    );

    var oldWidth = firstDL.width;

    series.update({
        dataLabels: {
            width: 50,
            connectorColor: 'green',
            connectorWidth: 4
        }
    });

    firstDL = series.points[0].dataLabel;

    assert.notEqual(
        firstDL.width,
        oldWidth,
        "Data label's new width is set."
    );

    var connector = series.points[0].connector,
        connectorWidth = connector.strokeWidth(),
        connectorColor = connector.stroke;

    assert.strictEqual(
        connectorWidth,
        4,
        "Data label's new connector width is set."
    );

    assert.strictEqual(
        connectorColor,
        "green",
        "Data label's new connector color is set."
    );

    // Add normal point to series.
    series.addPoint({
        name: "Another Date",
        label: "Some label"
    });

    assert.strictEqual(
        series.points.length,
        4,
        "New point is added to series."
    );

    // Hide the third point.
    series.points[2].setVisible();

    assert.strictEqual(
        series.visiblePointsCount === 3 &&
        !series.points[2].visible,
        true,
        "The third point is hidden."
    );

    // Remove third point
    series.points[2].remove();

    assert.strictEqual(
        series.visiblePointsCount === 3 &&
        series.points.length === 3,
        true,
        "The third point is removed."
    );

    // Set new series data.
    series.setData([null, {
        name: "New Date",
        label: "Some new label"
    }, {
        name: "New Date 2",
        label: "Some new label"
    }, {
        name: "New Date 3",
        label: "Some new label"
    }, {
        name: "New Date 4",
        label: "Some new label"
    }, {
        name: "New Date 5",
        label: "Some new label"
    }]);

    assert.strictEqual(
        series.points.length,
        6,
        "New timeline series data is set."
    );

    // Check whether first point is null.
    assert.strictEqual(
        series.points[0].isNull,
        true,
        "The first point is null point."
    );

});
