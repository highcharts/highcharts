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

    assert.notEqual(
        typeof chart.yAxis[0].max,
        'number',
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

    series.update({
        states: {
            hover: {
                color: '#ff0000',
                borderWidth: 4,
                borderColor: '#00ff00',
                animation: {
                    duration: 0
                }
            }
        }
    });

    series.points[5].setState('hover');

    assert.strictEqual(
        series.points[5].graphic.rect.attr('fill'),
        '#ff0000',
        'Hover color of graphicOriginal is correct (#9880).'
    );

    assert.strictEqual(
        series.points[5].graphic.partRect.attr('fill').replace(/ /g, ''),
        'rgb(179,0,0)',
        'Hover color of graphicOverlay (#9880).'
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
        clipRect = point.graphic.partialClipRect;
    assert.strictEqual(
        Math.floor(
            chart.xAxis[0].toValue(
                clipRect.attr('width') - clipRect.attr('x')
            )
        ),
        (point.x2 - point.x) * point.partialFill,
        'Clip rect ends at correct position after zoom (#7617).'
    );

    point.select();
    assert.strictEqual(
        point.graphic.rect.attr('fill'),
        point.series.options.states.select.color,
        'Correct fill for a point upon point selection (#8104).'
    );

    chart.xAxis[0].update({
        min: 0,
        max: 1000,
        reversed: true
    }, false);
    chart.series[0].update({
        minPointLength: 10,
        borderWidth: 0,
        data: [{
            x: 45,
            x2: 45.1,
            y: 1
        }, {
            x: 5,
            x2: 45,
            y: 0
        }]
    });

    assert.strictEqual(
        chart.series[0].points[0].graphic.getBBox().width,
        10,
        'Correct width for minPointLength on a reversed xAxis (#8933).'
    );

    assert.ok(
        chart.series[0].points[1].graphic.getBBox().width > 10,
        'Longer points unaffected by minPointWidth on a reversed xAxis (#8933).'
    );

    chart.series[0].update({
        pointPlacement: 0.5
    });

    point = chart.series[0].points[1];
    assert.close(
        point.graphic.rect.attr('y') + point.graphic.rect.getBBox().height / 2,
        chart.plotHeight,
        1,
        'The point should now be on the center of the plot area'
    );
});

QUnit.test('Partial fill reversed', assert => {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'xrange'
        },
        xAxis: {
            type: 'datetime'
        },
        series: [{
            data: [{
                x: Date.UTC(2019, 0, 1),
                x2: Date.UTC(2019, 0, 2),
                y: 1,
                partialFill: 0.5
            }]
        }]
    });

    assert.strictEqual(
        chart.series[0].points[0].graphic.rect.attr('x'),
        chart.series[0].points[0].graphic.partialClipRect.attr('x'),
        'Partial fill should be aligned left'
    );

    chart.xAxis[0].update({
        reversed: true
    });

    assert.close(
        chart.series[0].points[0].graphic.rect.attr('x') +
        chart.series[0].points[0].graphic.rect.attr('width'),
        chart.series[0].points[0].graphic.partialClipRect.attr('x') +
        chart.series[0].points[0].graphic.partialClipRect.attr('width'),
        1,
        'Partial fill should be aligned left'
    );
});

QUnit.test('X-range data labels', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            zoomType: 'x',
            width: 600
        },
        xAxis: [{
            minRange: 1
        }],
        series: [{
            type: 'xrange',
            dataLabels: {
                enabled: true
            },
            data: [{
                y: 0,
                x: 0,
                x2: 2,
                color: "#8CCAF4",
                label: "first",
                partialFill: 0.28
            }, {
                y: 0,
                x: 2,
                x2: 4,
                color: "#F4C986",
                label: "second"
            }, {
                y: 0,
                x: 4,
                x2: 5,
                color: "#AA45FC",
                label: "third"
            }, {
                y: 0,
                x: 5,
                x2: 7,
                color: "#FCC9FF",
                label: "fourth"
            }]
        }]
    });

    assert.strictEqual(
        chart.series[0].points[0].dataLabel.text.textStr,
        '28%',
        'Correctly rounded value using default formatter (#9291)'
    );

    chart.series[0].update({
        dataLabels: {
            format: '{point.label}'
        }
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

    chart.xAxis[0].setExtremes();
    chart.series[0].addPoint({
        y: 1,
        x: 0.1,
        x2: 0.2,
        label: 'fifth'
    });
    chart.yAxis[0].setExtremes(0.5);

    assert.deepEqual(
        chart.series[0].points.map(function (p) {
            return p.dataLabel.attr('y') === -9999 ? 'hidden' : 'visible';
        }),
        ['hidden', 'hidden', 'hidden', 'hidden', 'visible'],
        'Shown and hidden labels'
    );

});
