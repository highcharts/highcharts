// Highcharts 3.0.10, Issue #2813
// stack's labels lives their own lives when you dynamically change type of stack normal <=> percent
QUnit.test('stacklabels update #2813', function (assert) {

    var chart = Highcharts.chart('container', {
            chart: {
                type: 'column',
                marginTop: 70
            },
            credits: {
                enabled: false
            },
            title: {
                text: 'Chart1',
                align: 'left'
            },
            xAxis: {
                categories: ['Room1'],
                title: {
                    text: 'Rooms'
                }
            },
            yAxis: {
                title: {
                    text: 'Numbers'
                },
                stackLabels: {
                    enabled: true,
                    crop: false,
                    style: {
                        fontWeight: 'bold',
                        color: '#6E6E6E'
                    },
                    formatter: function () {
                        return this.stack;
                    }
                }
            },
            tooltip: {
                enabled: false,
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
                shared: false
            },
            plotOptions: {
                series: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        color: '#210B61',
                        align: 'center',
                        style: {
                            fontSize: '9px',
                            fontFamily: 'Verdana, sans-serif'
                        },
                        formatter: function () {
                            return this.y;
                        }
                    },
                    groupPadding: 0
                }
            },
            series: [{
                name: "Baseline Fail",
                data: [31],
                stack: "Baseline Gary",
                id: "Baseline FailGary",
                color: "#BDBDBD"
            }, {
                name: "Baseline Fail",
                data: [17],
                stack: "Baseline Marty",
                color: "#BDBDBD",
                linkedTo: "Baseline FailGary"
            }, {
                name: "Baseline Fail",
                data: [28],
                stack: "Baseline TonyG",
                color: "#BDBDBD",
                linkedTo: "Baseline FailGary"
            }, {
                name: "Baseline Fail",
                data: [58],
                stack: "Baseline piernot",
                color: "#BDBDBD",
                linkedTo: "Baseline FailGary"
            }, {
                name: "Baseline",
                data: [49],
                stack: "Baseline Gary",
                id: "BaselineGary",
                color: "#DF7401"
            }, {
                name: "Baseline",
                data: [63],
                stack: "Baseline Marty",
                color: "#DF7401",
                linkedTo: "BaselineGary"
            }, {
                name: "Baseline",
                data: [52],
                stack: "Baseline TonyG",
                color: "#DF7401",
                linkedTo: "BaselineGary"
            }, {
                name: "Baseline",
                data: [22],
                stack: "Baseline piernot",
                color: "#DF7401",
                linkedTo: "BaselineGary"
            }]
        }),
        percent = false;

    assert.strictEqual(
        chart.series.length,
        8,
        'There should be 8 series.'
    );

    function changeStackingType() {

        var oldTranslateX,
            oldTranslateY,
            newTranslateX,
            newTranslateY;

        Highcharts.each(chart.series, function (series) {

            oldTranslateX = series.data[0].dataLabel.translateX;
            oldTranslateY = series.data[0].dataLabel.translateY;

            series.update({
                stacking: percent ? 'normal' : 'percent'
            });

            newTranslateX = series.data[0].dataLabel.translateX;
            newTranslateY = series.data[0].dataLabel.translateY;

            assert.strictEqual(
                newTranslateX,
                oldTranslateX,
                'The x position should be equal.'
            );

            assert.ok(
                (percent ? oldTranslateY < newTranslateY : oldTranslateY > newTranslateY),
                'The y position should be lower.'
            );

        });

        percent = !percent;

    }

    changeStackingType();
    changeStackingType();
    changeStackingType();

});

QUnit.test('#6546 - stacking with gapSize', function (assert) {
    var chart = Highcharts.stockChart('container', {
            chart: {
                type: 'area'
            },
            rangeSelector: {
                selected: 1
            },
            plotOptions: {
                series: {
                    gapSize: 1,
                    stacking: 'normal'
                }
            },
            series: [{
                name: 'USD to EUR',
                data: [
                    [0, 1],
                    [1, 1],
                    [2, 1],
                    [3, 1],
                    [4, 1],
                    [7, 1],
                    [8, 1],
                    [9, 1],
                    [10, 1],
                    [11, 1]
                ]
            }]
        }),
        path = chart.series[0].graphPath;

    path.splice(0, 1);

    assert.strictEqual(
        Highcharts.inArray('M', path) > -1,
        true,
        'Line is broken'
    );
});

QUnit.test('Updating to null value (#7493)', function (assert) {
    var chart = Highcharts.chart('container', {
        series: [{
            type: 'area',
            stacking: 'normal',
            data: [1, 2, 3, 4, 5]
        }]
    });

    assert.strictEqual(
        chart.series[0].graph.element.getAttribute('d').lastIndexOf('M'),
        0,
        'Graph should not be broken initially'
    );

    chart.series[0].setData([4, 3, null, 2, 1]);
    assert.notEqual(
        chart.series[0].graph.element.getAttribute('d').lastIndexOf('M'),
        0,
        'Graph should be broken after update with null'
    );

});

QUnit.test("StackLabels position with multiple yAxis (#7798)", function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },
        yAxis: [{
            top: '0%',
            height: '30%',
            stackLabels: {
                enabled: true,
                allowOverlap: true
            }
        }, {
            top: '30%',
            height: '70%',
            stackLabels: {
                enabled: true,
                allowOverlap: true
            }
        }],
        series: [{
            data: [1, 2]
        }, {
            data: [2, 2]
        }, {
            data: [3, 1],
            yAxis: 1
        }]
    });

    assert.strictEqual(
        chart.yAxis[0].stacks.column[0].label.alignAttr.y <
        chart.series[1].points[0].plotY,
        true,
        'Stack labels should be above the stack'
    );
});

QUnit.test("Stack Labels position in bar chart (#8187)", function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'bar',
            marginLeft: 200
        },
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },
        yAxis: {
            stackLabels: {
                enabled: true,
                allowOverlap: true
            }
        },
        series: [{
            data: [1, 1]
        }, {
            data: [1, 1]
        }]
    });

    var labelPos = chart.yAxis[0].stacks.bar[0].label.getBBox(true);
    assert.close(
        chart.xAxis[0].toPixels(0, true),
        labelPos.y + (labelPos.height / 2),
        1.2,
        'Stack labels should be properly positioned'
    );
});
