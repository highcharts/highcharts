QUnit.test('Add point without shift', function (assert) {
    var chart = $('#container').highcharts(),
        maxX;

    function add100() {
        var chart = $('#container').highcharts(),
            i = 0,
            series = chart.series[0],
            data = usdeur.splice(0, 100);

        maxX = data[data.length - 1][0];
        for (i; i < data.length; i += 1) {
            series.addPoint(data[i], false);
        }
        chart.redraw();
    }

    chart.setSize(800, 300, false);

    assert.strictEqual(
        chart.series[0].data.length,
        500,
        'Start data length'
    );

    // Add 100 points
    add100();

    assert.strictEqual(
        chart.xAxis[0].getExtremes().max,
        maxX,
        'New max'
    );

    assert.strictEqual(
        chart.series[0].options.data.length,
        600,
        'New data length'
    );

    // Move viewed area left
    chart.xAxis[0].setExtremes(
        chart.series[0].xData[400],
        chart.series[0].xData[500]
    );

    // Once the navigator is disconnected from the max, it should stay after adding points.
    var minBefore = chart.xAxis[0].min,
        maxBefore = chart.xAxis[0].max;

    add100();
    assert.strictEqual(
        chart.series[0].options.data.length,
        700,
        'Yes, we have added data'
    );
    assert.strictEqual(
        chart.xAxis[0].min,
        minBefore,
        'Min is unchanged'
    );
    assert.strictEqual(
        chart.xAxis[0].max,
        maxBefore,
        'Max is unchanged'
    );


});