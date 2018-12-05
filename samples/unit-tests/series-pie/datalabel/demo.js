

QUnit.test('Pie Point dataLabel distance (#1174)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'pie'
        },

        plotOptions: {
            series: {
                animation: false,
                dataLabels: {
                    distance: 20
                },
                size: '100%'
            }
        },

        series: [{
            data: [{
                y: 3,
                dataLabels: {
                    distance: -30
                }
            }]
        }, {
            dataLabels: {
                distance: -30
            },
            data: [{
                y: 3
            }]
        }]
    });
    var dataLabel1 = chart.series[0].data[0].dataLabel,
        dataLabel2 = chart.series[1].data[0].dataLabel;

    assert.equal(
        dataLabel1.x,
        dataLabel2.x,
        'x value of dataLabels'
    );

    assert.equal(
        dataLabel1.y,
        dataLabel2.y,
        'y value of dataLabels'
    );

});

QUnit.test('Small pie and labels (#6992)', function (assert) {
    var chart = Highcharts.chart('container', {
        series: [{
            type: 'pie',
            size: 10,
            data: [1, 2, 3, 4, 5, 6, 7]
        }],
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    rotation: -45
                }
            }
        }
    });
    assert.strictEqual(
        chart.container.innerHTML.indexOf('NaN'),
        -1,
        'All numbers valid'
    );
});

// Highcharts v4.0.1, Issue #3163
// Pie chart data labels drawn outside plot area
QUnit.test('Pie labels outside plot (#3163)', function (assert) {

    var chart = Highcharts.chart('container', {
            chart: {
                height: 243,
                type: "pie",
                plotBackgroundColor: '#EFEFFF'
            },
            title: {
                text: null
            },
            series: [{
                name: "Value",
                showInLegend: true,
                dataLabels: {
                    format: "{y:,f}"
                },
                minSize: 150,
                data: [{
                    name: "641397 (Description 641397)",
                    y: 46115816.00
                }, {
                    name: "641402 (Description 641402)",
                    y: 23509037.00
                }, {
                    name: "641396 (Description 641396)",
                    y: 18884796.00
                }, {
                    name: "641403 (Description 641403)",
                    y: 11970798.00
                }]
            }]
        }),
        plotSizeY = chart.plotSizeY,
        seriesData = chart.series[0].data,
        labelYPos = [];

    for (var i = 0; i < seriesData.length; i++) {
        labelYPos.push(seriesData[i].labelPosition.final.y);
    }

    function isLabelInsidePlot() {
        for (var i = 0; i < labelYPos.length; i++) {
            if (labelYPos[i] < 0) {
                return false;
            }
            if (labelYPos[i] > plotSizeY) {
                return false;
            }
        }
        return true;
    }

    assert.ok(
        isLabelInsidePlot(),
        "Pie label is outside of plot"
    );
});


QUnit.test('Mouse events on dataLabels with useHTML set to true.', function (assert) {
    var clicked = false,
        chart = new Highcharts.Chart({
            chart: {
                type: 'pie',
                renderTo: 'container'
            },
            series: [{
                dataLabels: {
                    useHTML: true
                },
                point: {
                    events: {
                        click: function () {
                            clicked = true;
                        }
                    }
                },
                data: [
                    ['Firefox', 44.2],
                    ['IE7', 26.6],
                    ['IE6', 20],
                    ['Chrome', 3.1],
                    ['Other', 5.4]
                ]
            }]
        }),
        points = chart.series[0].points,
        offset = Highcharts.offset(chart.container),
        event = $.Event('mouseover', {
            which: 1,
            pageX: offset.left + points[0].labelPosition.natural.x,
            pageY: offset.top + points[0].labelPosition.natural.y
        });

    $(points[0].dataLabel.div).trigger(event);

    assert.strictEqual(
        points[0] === chart.hoverPoint,
        true,
        'First point hovered.'
    );

    event = $.Event('mouseover', {
        which: 1,
        pageX: offset.left + points[4].labelPosition.natural.x,
        pageY: offset.top + points[4].labelPosition.natural.y
    });

    $(points[4].dataLabel.div).trigger(event);

    assert.strictEqual(
        points[4] === chart.hoverPoint,
        true,
        'Last point hovered.'
    );

    chart.pointer.onContainerClick({
        pageX: offset.left + points[4].labelPosition.natural.x,
        pageY: offset.top + points[4].labelPosition.y,
        target: points[4].dataLabel.div
    });

    assert.strictEqual(
        clicked,
        true,
        'Click event on dataLabel works.'
    );
});


