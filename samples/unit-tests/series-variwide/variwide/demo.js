QUnit.test('variwide', function (assert) {

    var chart = Highcharts.chart('container', {

        chart: {
            type: 'variwide'
        },

        xAxis: {
            type: 'category',
            crosshair: true
        }

    });

    assert.strictEqual(
        chart.series.length,
        0,
        'No series'
    );

    chart.addSeries({
        data: [
            [1, 1],
            [2, 2],
            [3, 3]
        ]
    });


    assert.strictEqual(
        chart.series[0].points.length,
        3,
        'Series successfully added'
    );

    chart.series[0].addPoint({
        y: 20,
        z: 50
    });

    assert.deepEqual(
        chart.series[0].points.length,
        4,
        'addPoint'
    );

    chart.series[0].removePoint(0);
    assert.deepEqual(
        chart.series[0].points.length,
        3,
        'removePoint'
    );

    // Show crosshair
    chart.series[0].points[1].onMouseOver();
    assert.close(
        chart.xAxis[0].cross.attr('stroke-width'),
        chart.series[0].points[1].crosshairWidth,
        1,
        'Crosshair has the same width as category (#8083)'
    );

    // Disable crosshair
    chart.xAxis[0].update({ crosshair: false });
    chart.series[0].points[0].onMouseOver();
    assert.ok(true, "No errors with disabled crosshair (#8173)");


    chart.update({
        xAxis: {
            minRange: 1
        },
        series: [{
            type: 'variwide',
            borderWidth: 0,
            cropThreshold: 1,

            data: [
                [0, 1, 1],
                [1, 2, 1],
                [2, 3, 1],
                [3, 2, 1]
            ]
        }]
    }, true, true, false);

    chart.xAxis[0].setExtremes(0, 1, true, false);
    chart.reflow();
    chart.xAxis[0].setExtremes(0, 3, true, false);

    assert.strictEqual(
        chart.series[0].points.length,
        4,
        'Correct number of points after zoom and redraw (#9525)'
    );

});

QUnit.test('variwide null points', function (assert) {
    var chart = Highcharts.chart('container', {

        chart: {
            type: 'variwide'
        },

        xAxis: {
            type: 'category'
        },

        series: [{
            data: [
                [1, 1],
                [2, null],
                [null, 3],
                [null, null],
                [3, 3]
            ]
        }]

    });

    assert.strictEqual(
        chart.series[0].points.map(function (p) {
            return p.isNull ? 'null' : 'valid';
        }).join(','),
        'valid,null,null,null,valid',
        'Nulls detected'
    );

});
