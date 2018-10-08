QUnit.test('Reset text with with useHTML (#4928)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'bar',
            width: 100
        },
        title: {
            text: null
        },
        xAxis: {
            categories: ["Nick Presta", "Nathan Duthoit", "Jude", "Sarah", "Michael Warkentin", "Cam", "Vivian", "Brooke", "Jack", "Ash", "Andrew", "Dieter", "Brian", "Satraj", "Yoseph", "Henry", "James", "Fisher", "Cathy", "Azucena", "Katie", "Rustin", "Andrea"],
            title: {
                text: null
            },
            labels: {
                formatter: function () {
                    return '<a href="#">' + this.value + '</a>';
                },
                useHTML: true
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            data: [4, 1, 6.7, 1.2, 1.3, 1.3, 7.6, 1.85, 1.85, 2, 0.5, 1.5, 2, 4.15, 2, 1, 2, 2, 2.5, 2, 0.5, 0.5, 5]
        }],
        exporting: {
            enabled: false
        }
    });

    var labelLength = chart.xAxis[0].ticks[0].label.element.offsetWidth;
    assert.ok(
        labelLength > 20,
        'Label has length'
    );

    chart.setSize(600, 400, false);

    assert.ok(
        chart.xAxis[0].ticks[0].label.element.offsetWidth > labelLength,
        'Label has expanded'
    );

    chart.setSize(100, 400, false);

    assert.strictEqual(
        chart.xAxis[0].ticks[0].label.element.offsetWidth,
        labelLength,
        'Back to start'
    );

});


QUnit.test('Auto rotated labels with useHTML', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column',
            width: 310
        },

        xAxis: {
            categories: ['Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo Foo ', 'Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar Bar ', 'a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a '],

            labels: {
                useHTML: true
            }
        },

        series: [{
            data: [29.9, 71.5, 106.4]
        }]
    });

    var labelLength = chart.xAxis[0].ticks[0].label.element.offsetWidth;
    assert.ok(
        labelLength > 20,
        'Label has length'
    );

    chart.setSize(300, 400, false);

    assert.ok(
        chart.plotHeight > 100,
        'Plot height is ok'
    );

});

QUnit.test('Bounding box for rotated label', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            height: 400
        },
        title: {
            text: 'with useHTML enabled on Axis labels'
        },
        xAxis: {
            categories: ['This really looooong title name will be cut off', 'Feb'],
            labels: {
                useHTML: true,
                rotation: 45,
                style: {
                    textOverflow: 'none',
                    whiteSpace: "nowrap"
                }
            }
        },
        series: [{
            data: [29.9, 71.5]
        }]
    });

    var label = chart.xAxis[0].ticks[0].label.element;
    assert.strictEqual(
        label.style.whiteSpace,
        'nowrap',
        'The white-space is set'
    );
    assert.strictEqual(
        label.style.width,
        '',
        'The width should not be set when white-space is nowrap (#8467)'
    );
});

QUnit.test('Resizing chart with HTML labels (#8789)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            animation: false,
            type: 'column',
            width: 1000,
            height: 400
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false
        },
        title: {
            text: null
        },
        xAxis: {
            labels: {
                useHTML: true
            },
            type: 'category'
        },
        series: [{
            name: 'Average Sale Price',
            data: [{
                name: 'T00 (00.0,00.0)',
                y: 44.46
            },
            {
                name: 'T01 [00.0,10.0)',
                y: 81.33
            },
            {
                name: 'T02 [10.0,20.0)',
                y: 77.09
            },
            {
                name: 'T03 [20.0,30.0)',
                y: 68.43
            },
            {
                name: 'T04 [30.0,40.0)',
                y: 49.29
            },
            {
                name: 'T05 [40.0,50.0)',
                y: 53.11
            },
            {
                name: 'T06 [50.0,60.0)',
                y: 70.07
            },
            {
                name: 'T07 [60.0,70.0)',
                y: 75.05
            },
            {
                name: 'T08 [70.0,80.0)',
                y: 110.64
            },
            {
                name: 'T09 [80.0,90.0)',
                y: 87.78
            },
            {
                name: 'T10 [90.0,00.9)',
                y: 109.00
            }]
        }]
    });

    assert.ok(
        chart.plotHeight > 200,
        'Plot height should be more than 200'
    );

    chart.setSize(950);
    assert.ok(
        chart.plotHeight > 200,
        'Plot height should still be more than 200 after resize'
    );
});

QUnit.test('Varying label width with HTML labels (#8809)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column',
            animation: false,
            width: 800,
            style: {
                fontFamily: '"Open Sans", sans-serif'
            },
            events: {
                drilldown: function (e) {
                    if (!e.seriesOptions) {

                        var chart = this,
                            drilldowns = {
                                'All patches maximum dE': {
                                    name: 'Animals',
                                    data: [
                                        ['Cows', 2],
                                        ['Sheep', 3]
                                    ]
                                },
                                'Primaries maximum dE': {
                                    name: 'Fruits',
                                    data: [
                                        ['Apples', 5],
                                        ['Oranges', 7],
                                        ['Bananas', 2]
                                    ]
                                },
                                'All patches average dE': {
                                    name: 'Cars',
                                    data: [
                                        ["value 0", 99],
                                        ["value 1", 56],
                                        ["value 2", 86],
                                        ["value 3", 75],
                                        ["value 4", 0],
                                        ["value 5", 74],
                                        ["value 6", 82],
                                        ["value 7", 40],
                                        ["value 8", 27],
                                        ["value 9", 18],
                                        ["value 10", 30],
                                        ["value 11", 92],
                                        ["value 12", 33],
                                        ["value 13", 69],
                                        ["value 14", 13],
                                        ["value 15", 4],
                                        ["value 16", 13],
                                        ["value 17", 84],
                                        ["value 18", 95],
                                        ["value 19", 52],
                                        ["value 20", 95],
                                        ["value 21", 40],
                                        ["value 22", 77],
                                        ["value 23", 13],
                                        ["value 24", 29],
                                        ["value 25", 52],
                                        ["value 26", 92],
                                        ["value 27", 57],
                                        ["value 28", 73],
                                        ["value 29", 25],
                                        ["value 30", 33],
                                        ["value 31", 72],
                                        ["value 32", 47],
                                        ["value 33", 59],
                                        ["value 34", 27],
                                        ["value 35", 97],
                                        ["value 36", 24],
                                        ["value 37", 41],
                                        ["value 38", 9],
                                        ["value 39", 40],
                                        ["value 40", 90],
                                        ["value 41", 98],
                                        ["value 42", 81],
                                        ["value 43", 19],
                                        ["value 44", 90],
                                        ["value 45", 2],
                                        ["value 46", 58],
                                        ["value 47", 99],
                                        ["value 48", 49],
                                        ["value 49", 93],
                                        ["value 50", 69],
                                        ["value 51", 16],
                                        ["value 52", 65],
                                        ["value 53", 61],
                                        ["value 54", 52],
                                        ["value 55", 74],
                                        ["value 56", 56],
                                        ["value 57", 54],
                                        ["value 58", 89],
                                        ["value 59", 34],
                                        ["value 60", 94],
                                        ["value 61", 69],
                                        ["value 62", 41],
                                        ["value 63", 53],
                                        ["value 64", 24],
                                        ["value 65", 55],
                                        ["value 66", 80],
                                        ["value 67", 22],
                                        ["value 68", 28],
                                        ["value 69", 1],
                                        ["value 70", 6],
                                        ["value 71", 88]
                                    ]
                                }
                            },
                            series = drilldowns[e.point.name];
                        chart.addSeriesAsDrilldown(e.point, series);

                    }

                }
            }
        },
        title: {
            text: 'Async drilldown'
        },
        xAxis: {
            type: 'category',
            labels: {
                style: {
                    fontSize: '14px'
                },
                useHTML: true,
                autoRotationLimit: 10,
                formatter: function () {
                    var value = this.value;
                    if (this.chart.series[0].name === 'Cars') {
                        return '<div style="background: #f86b57;' +
                            'border: 1px solid #f86b57;' +
                            'border-radius: 2px;' +
                            'width: 6px; height: 6px"></div>';
                    }
                    return '<div>' + value + '</div>';

                }
            }
        },

        legend: {
            enabled: false
        },

        plotOptions: {
            series: {
                connectNulls: true,
                borderWidth: 0,
                cropThreshold: 200,
                maxPointWidth: 120,
                marker: {
                    symbol: "circle"
                }
            }
        },

        series: [{
            name: 'Things',
            colorByPoint: true,
            data: [{
                name: 'All patches maximum dE',
                y: 50,
                drilldown: true
            }, {
                name: 'Primaries maximum dE',
                y: 72,
                drilldown: true
            }, {
                name: 'All patches average dE',
                y: 44,
                drilldown: true
            }]
        }],
        yAxis: {

        },


        drilldown: {

            series: []
        }
    });

    assert.strictEqual(
        chart.xAxis[0].ticks[0].label.element.style.width,
        '',
        'Initially there should not be a label width'
    );

    chart.series[0].points[2].doDrilldown();


    chart.drillUp();

    assert.strictEqual(
        chart.xAxis[0].ticks[0].label.element.style.width,
        '',
        'After resetting, the label width should be released'
    );

});