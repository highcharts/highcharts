QUnit.test('Visible funnel items', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'funnel',
            marginRight: 100,
            width: 300
        },
        title: {
            text: 'Sales funnel',
            x: -50
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b> ({point.y:,.0f})',
                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                    softConnector: true
                },
                neckWidth: '30%',
                neckHeight: '25%'

                //-- Other available options
                // height: pixels or percent
                // width: pixels or percent
            }
        },
        legend: {
            enabled: true
        },
        series: [{
            name: 'Unique users',
            data: [
                {
                    name: 'Website visits',
                    y: 15654,
                    visible: false
                }, {
                    name: 'Downloads',
                    y: 4064
                },
                ['Requested price list', 1987],
                ['Invoice sent', 976],
                ['Finalized', 846]
            ]
        }]
    });

    assert.strictEqual(
        chart.series[0].points[0].graphic.attr('visibility'),
        'hidden',
        'No graphic for invisible point'
    );
});

QUnit.test('Top path of funnel intact', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'funnel'
        },
        plotOptions: {
            series: {
                reversed: true
            }
        },
        series: [{
            name: 'Unique users',
            data: [
                ['Website visits', 323],
                ['Downloads', 1343],
                ['Requested price list', 2287],
                ['Invoice sent', 2784]
            ]
        }]
    });

    assert.strictEqual(
        chart.series[0].points[3].graphic.element.getAttribute('d').split(' ')
            .filter(function (s) {
                return s !== 'L'; // Because Edge adds an L for each segment
            }).length,
        14,
        'The path should have the neck intact (#8277)'
    );
});

QUnit.test('Funnel dataLabels', function (assert) {
    var chart = Highcharts.chart('container', {
            chart: {
                type: 'funnel'
            },
            plotOptions: {
                series: {
                    center: ['50%', '50%'],
                    dataLabels: {
                        inside: true,
                        verticalAlign: 'middle'
                    },
                    reversed: false,
                    width: '50%'
                }
            },
            series: [{
                name: 'Unique users',
                data: [
                    ['Website visits', 5654],
                    ['Downloads', 4064],
                    ['Requested price list', 1987],
                    ['Invoice sent', 1976],
                    ['Finalized', 4201]
                ]
            }]
        }),
        series = chart.series[0],
        point = series.points[2],
        pointBBox = point.graphic.getBBox(),
        pointWidth;

    assert.strictEqual(
        Math.round(
            pointBBox.x + pointBBox.width / 2 - point.dataLabel.width / 2
        ),
        point.dataLabel.x,
        'DataLabels centered horizontally inside the funnel (#10036)'
    );

    series.update({
        dataLabels: {
            align: 'left'
        }
    });

    point = series.points[2];
    pointWidth = series.getWidthAt(point.plotY);

    assert.strictEqual(
        Math.round(point.plotX - pointWidth / 2 + point.dataLabel.padding),
        point.dataLabel.x,
        'DataLabels inside the funnel and left aligned (#10036)'
    );

    series.update({
        center: ['58%', '47%'],
        reversed: true
    });

    point = series.points[2];
    pointWidth = series.getWidthAt(2 * series.center[1] - point.plotY);

    assert.strictEqual(
        Math.round(point.plotX - pointWidth / 2 + point.dataLabel.padding),
        point.dataLabel.x,
        'DataLabels aligned correctly when funnel is reversed (#10036)'
    );

    series.update({
        dataLabels: {
            align: 'right'
        }
    });

    point = series.points[2];
    pointWidth = series.getWidthAt(2 * series.center[1] - point.plotY);

    assert.strictEqual(
        Math.round(
            point.plotX + pointWidth / 2 -
            point.dataLabel.padding - point.dataLabel.width
        ),
        point.dataLabel.x,
        'DataLabels inside the funnel and right aligned (#10036)'
    );

    series.update({
        dataLabels: {
            verticalAlign: 'bottom'
        }
    });

    point = series.points[2];
    pointBBox = point.graphic.getBBox();

    assert.strictEqual(
        Math.round(
            pointBBox.y + pointBBox.height +
            point.dataLabel.options.y - point.dataLabel.height
        ),
        point.dataLabel.y,
        'DataLabels inside the funnel and bottom aligned (#10036)'
    );

    series.update({
        dataLabels: {
            verticalAlign: 'top'
        }
    });

    point = series.points[4];
    pointBBox = point.graphic.getBBox();

    assert.strictEqual(
        Math.round(
            pointBBox.y + point.dataLabel.padding + point.dataLabel.options.y
        ),
        point.dataLabel.y,
        'DataLabels inside the funnel and top aligned (#10036)'
    );

    series.update({
        dataLabels: {
            verticalAlign: 'middle'
        }
    });

    point = series.points[1];
    pointBBox = point.graphic.getBBox();

    assert.strictEqual(
        Math.round(
            pointBBox.y + pointBBox.height / 2 - point.dataLabel.height / 2
        ),
        point.dataLabel.y,
        'DataLabels inside the funnel and centered vertically (#10036)'
    );
});
