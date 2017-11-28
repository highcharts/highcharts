QUnit.test('Histogram', function (assert) {
    var chart = Highcharts.chart('container', {
        series: [{
            type: 'histogram',
            baseSeries: 1,
            binWidth: 10
        }, {
            data: [36, { y: 25, id: 'p1' }, 38, 46, 55, 68, 72, 55, 36, 38, 67, 45, 22, 48, 91, 46, 52, 61, 58, 55]
        }, {
            data: [1, 1, 1, 1, 2, 2, 2, 3],
            id: 's2'
        }]
    });

    var histogram = chart.series[0];
    var baseSeries = chart.series[1];

    assert.ok(histogram, 'Histogram series initialised');
    assert.ok(histogram.baseSeries === baseSeries, 'Histogram\'s base series is set correctly');

    assert.deepEqual(
        histogram.xData,
        [20, 30, 40, 50, 60, 70, 80, 90],
        'Bins ranges are calculated correctly'
    );

    assert.deepEqual(
        histogram.yData,
        [2, 4, 4, 5, 3, 1, 0, 1],
        'Bins frequencies are calculated correctly'
    );

    histogram.update({
        binWidth: 5
    });

    assert.deepEqual(
        histogram.xData,
        [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90],
        'After updating histogram\'s bin width bin ranges are calculated correctly'
    );

    assert.deepEqual(
        histogram.yData,
        [1, 1, 0, 4, 0, 4, 1, 4, 1, 2, 1, 0, 0, 0, 1],
        'After updating histogram\'s bin width bin frequencies are calculated correctly'
    );

    baseSeries.addPoint(20);
    assert.deepEqual(
        histogram.yData,
        [2, 1, 0, 4, 0, 4, 1, 4, 1, 2, 1, 0, 0, 0, 1],
        'After adding a new point to the base series bin frequencies are calculated correctly'
    );

    chart.get('p1').update({ y: 20 });
    assert.deepEqual(
        histogram.yData,
        [3, 0, 0, 4, 0, 4, 1, 4, 1, 2, 1, 0, 0, 0, 1],
        'After updating a point in the base series bin frequencies are calculated correctly'
    );

    chart.get('p1').remove();
    assert.deepEqual(
        histogram.yData,
        [2, 0, 0, 4, 0, 4, 1, 4, 1, 2, 1, 0, 0, 0, 1],
        'After removing a point in the base series bin frequencies are calculated correctly'
    );

    chart.addSeries({
        type: 'histogram',
        id: 'h-binsNumber-as-function',
        baseSeries: 's2',
        binsNumber: function () {
            return 2;
        }
    });
    assert.ok(
        true,
        'Not crashing when function used for binsNumber (#7457)'
        // when number of bins is correct change this test to check len of yData
    );


    var addedHistogram = chart.addSeries({
        type: 'histogram',
        id: 'h2',
        baseSeries: 's2',
        binWidth: 1
    });
    assert.deepEqual(
        addedHistogram && addedHistogram.yData,
        [4, 3, 1],
        'Added histogram dynamically is calculated correctly'
    );

    baseSeries.remove();
    assert.ok(Highcharts.inArray(histogram, chart.series) !== -1, 'Histogram is not removed after the base series is removed');

    histogram.remove();
    assert.ok(Highcharts.inArray(histogram, chart.series) === -1, 'Histogram is removed after histogram.remove()');
});
