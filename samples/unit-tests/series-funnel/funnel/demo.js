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
                    center: ['45%', '55%'],
                    dataLabels: {
                        inside: true,
                        verticalAlign: 'center'
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
        (point.dataLabel.x + point.dataLabel.width / 2).toFixed(4),
        (pointBBox.x + pointBBox.width / 2).toFixed(4),
        'DataLabels centered inside the funnel (#10036)'
    );

    series.update({
        dataLabels: {
            align: 'left'
        }
    });

    point = series.points[2];
    pointWidth = series.getWidthAt(point.plotY);

    assert.strictEqual(
        point.plotX - pointWidth / 2 + point.dataLabel.padding,
        point.labelPosition.final.x,
        'DataLabels inside the funnel and left aligned (#10036)'
    );

    series.update({
        center: ['58%', '47%'],
        reversed: true
    });

    point = series.points[2];
    pointWidth = series.getWidthAt(2 * series.center[1] - point.plotY);

    assert.strictEqual(
        point.plotX - pointWidth / 2 + point.dataLabel.padding,
        point.labelPosition.final.x,
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
        point.plotX + pointWidth / 2 - point.dataLabel.padding - point.dataLabel.width,
        point.labelPosition.final.x,
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
        (pointBBox.y + pointBBox.height -
        point.dataLabel.padding + point.dataLabel.options.y -
        point.dataLabel.height).toFixed(4),
        (point.labelPosition.final.y).toFixed(4),
        'DataLabels inside the funnel and bottom aligned (#10036)'
    );

    series.update({
        dataLabels: {
            verticalAlign: 'top'
        }
    });

    point = series.points[2];
    pointBBox = point.graphic.getBBox();

    assert.strictEqual(
        (pointBBox.y + point.dataLabel.padding - point.dataLabel.options.y).toFixed(4),
        (point.labelPosition.final.y).toFixed(4),
        'DataLabels inside the funnel and top aligned (#10036)'
    );
});