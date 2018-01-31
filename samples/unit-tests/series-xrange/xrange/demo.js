QUnit.test('X-Range', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'xrange'
        },
        title: {
            text: 'Highcharts X-range'
        },
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
            title: '',
            categories: ['Prototyping', 'Development', 'Testing']
        }
    });

    assert.strictEqual(
        chart.yAxis[0].max,
        undefined,
        'Axis empty'
    );

    chart.addSeries({
        name: 'Project 1',
        borderRadius: 5,
        data: [{
            x: Date.UTC(2014, 11, 1),
            x2: Date.UTC(2014, 11, 2),
            y: 0,
            colorIndex: 9
        }, {
            x: Date.UTC(2014, 11, 2),
            x2: Date.UTC(2014, 11, 5),
            y: 1
        }, {
            x: Date.UTC(2014, 11, 8),
            x2: Date.UTC(2014, 11, 9),
            y: 2
        }, {
            x: Date.UTC(2014, 11, 9),
            x2: Date.UTC(2014, 11, 19),
            y: 1
        }, {
            x: Date.UTC(2014, 11, 10),
            x2: Date.UTC(2014, 11, 23),
            y: 2
        }]
    });

    assert.strictEqual(
        chart.series[0].points[0].colorIndex,
        9,
        'The point colorIndex option should be applied'
    );

    assert.strictEqual(
        chart.yAxis[0].max,
        2,
        'Axis added'
    );

    var series = chart.series[0];
    series.addPoint({
        x: Date.UTC(2014, 11, 23),
        x2: Date.UTC(2014, 11, 30),
        y: 3
    });
    chart.yAxis[0].setCategories([
        'Prototyping',
        'Development',
        'Testing',
        'Resting'
    ]);

    assert.strictEqual(
        series.points.length,
        6,
        'Now six points'
    );

    series.points[5].update({
        partialFill: 0.5
    });

    assert.strictEqual(
        series.points[5].partialFill,
        0.5,
        'Partial fill set'
    );

    series.points[0].remove();
    assert.strictEqual(
        series.points.length,
        5,
        'Now five points'
    );

    series.remove();
    assert.strictEqual(
        chart.series.length,
        0,
        'No series left'
    );

    // #7617
    chart.addSeries({
        pointWidth: 20,
        data: [{
            x: 1,
            x2: 9,
            y: 0,
            partialFill: 0.25
        }]
    }, false);
    chart.xAxis[0].setExtremes(2, null);

    var point = chart.series[0].points[0],
        clipBox = point.clipRect.getBBox(true);

    assert.strictEqual(
        Math.round(chart.xAxis[0].toValue(clipBox.width - clipBox.x)),
        (point.x2 - point.x) * point.partialFill,
        'Clip rect ends at correct position after zoom (#7617).'
    );
});

QUnit.test('X-range data labels', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            "zoomType": "x",
            width: 600
        },
        xAxis: [{
            minRange: 1
        }],
        series: [{
            "type": "xrange",
            "dataLabels": {
                "enabled": true,
                "format": "{point.label}"
            },
            "data": [{
                "y": 0,
                "x": 0,
                "x2": 2,
                "color": "#8CCAF4",
                "label": "first"
            }, {
                "y": 0,
                "x": 2,
                "x2": 4,
                "color": "#F4C986",
                "label": "second"
            }, {
                "y": 0,
                "x": 4,
                "x2": 5,
                "color": "#AA45FC",
                "label": "third"
            }, {
                "y": 0,
                "x": 5,
                "x2": 7,
                "color": "#FCC9FF",
                "label": "fourth"
            }]
        }]
    });

    var y = chart.series[0].points[0].dataLabel.attr('y');


    assert.strictEqual(
        chart.series[0].points.map(function (p) {
            return p.dataLabel.attr('y');
        }).join(','),
        [y, y, y, y].join(','),
        'Initial labels'
    );

    chart.xAxis[0].setExtremes(3.2, 3.5);

    assert.strictEqual(
        chart.series[0].points.map(function (p) {
            return p.dataLabel.attr('y');
        }).join(','),
        [-9999, y, -9999, -9999].join(','),
        'Shown and hidden labels'
    );

    chart.xAxis[0].setExtremes();

    assert.strictEqual(
        chart.series[0].points.map(function (p) {
            return p.dataLabel.attr('y');
        }).join(','),
        [y, y, y, y].join(','),
        'Reverted labels'
    );

    chart.xAxis[0].setExtremes(0, 0.5);

    assert.strictEqual(
        chart.series[0].points.map(function (p) {
            return p.dataLabel.attr('y');
        }).join(','),
        [y, -9999, -9999, -9999].join(','),
        'Shown and hidden labels'
    );

});
