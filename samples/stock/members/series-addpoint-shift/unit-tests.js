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
            series.addPoint(data[i], false, true);
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
        'Stick to max'
    );

    assert.strictEqual(
        chart.series[0].options.data.length,
        500,
        'New data length'
    );

    // Move viewed area left
    chart.xAxis[0].setExtremes(
        chart.series[0].xData[300],
        chart.series[0].xData[400]
    );

    // Once the navigator is disconnected from the max, it should stay after adding points.
    var minBefore = chart.xAxis[0].min,
        maxBefore = chart.xAxis[0].max;

    add100();
    assert.strictEqual(
        chart.series[0].options.data.length,
        500,
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

    add100();
    add100();
    assert.strictEqual(
        chart.xAxis[0].min,
        chart.xAxis[1].min,
        'Stick left'
    );

    minBefore = chart.xAxis[0].min;
    maxBefore = chart.xAxis[0].max;

    add100();
    assert.strictEqual(
        chart.xAxis[0].min > minBefore,
        true,
        'Stick left, data shifted'
    );

    assert.strictEqual(
        chart.xAxis[0].max > maxBefore,
        true,
        'Stick left, data shifted'
    );

});