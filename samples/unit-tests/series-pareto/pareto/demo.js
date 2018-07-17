
QUnit.test('Pareto', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            renderTo: 'container',
            type: 'column'
        },
        yAxis: [{
            title: {
                text: ''
            }
        }, {
            title: {
                text: ''
            },
            minPadding: 0,
            maxPadding: 0,
            max: 100,
            min: 0,
            opposite: true,
            labels: {
                format: "{value}%"
            }
        }],
        series: [{
            type: 'pareto',
            yAxis: 1,
            zIndex: 10,
            baseSeries: 1
        }, {
            type: 'column',
            zIndex: 2,
            data: [755, 222, 151, 86, 72, 51, 36, 10]
        }]
    });

    var series = chart.series[1];

    assert.deepEqual(
        chart.series[0].points.length,
        8,
        'Series successfully added'
    );

    assert.deepEqual(
        chart.series[0].yData,
        [54.591467823572, 70.643528561099, 81.561822125813, 87.780187997108, 92.986261749819, 96.673897324657, 99.276934201012, 100],
        'Series points are correctly calculated'
    );

    series.addPoint({
        y: 20
    });

    assert.deepEqual(
        chart.series[0].points.length,
        9,
        'addPoint'
    );

    assert.deepEqual(
        chart.series[0].yData,
        [53.813257305773, 69.636493228795, 80.39914468995, 86.528866714184, 91.660727013542, 95.295794725588, 97.861724875267, 98.574483250178, 100],
        'Series points are correctly calculated'
    );

    series.removePoint(0);
    assert.deepEqual(
        chart.series[1].points.length,
        8,
        'removePoint'
    );

    assert.deepEqual(
        chart.series[0].yData,
        [34.259259259259, 57.561728395062, 70.833333333333, 81.944444444444, 89.814814814815, 95.37037037037, 96.913580246914, 100],
        'Series points are correctly calculated'
    );

    series.points[0].update({
        y: 50
    });

    assert.deepEqual(
        chart.series[0].yData,
        [10.504201680672, 42.226890756303, 60.294117647059, 75.420168067227, 86.134453781513, 93.697478991597, 95.798319327731, 100],
        'Series points are correctly calculated'
    );

});
