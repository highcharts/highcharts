QUnit.test('Categories undefined, inferred from names', function (assert) {

    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: "Point names and categories"
        },
        "series": [{
            "data": [{
                "name": "May",
                "y": 1
            }],
            "name": "Alpha"
        }, {
            "data": [{
                "name": "Apr",
                "y": 1
            }, {
                "name": "May",
                "y": 2
            }, {
                "name": "Jun",
                "y": 3
            }],
            "name": "Beta"
        }],
        xAxis: {
            type: 'category'
        }
    });

    assert.strictEqual(
        chart.xAxis[0].names.join(','),
        'May,Apr,Jun',
        'Names added by source order'
    );

    assert.strictEqual(
        chart.series[0].points[0].x,
        0,
        'First series, first point, lands at 0'
    );

    assert.strictEqual(
        chart.series[1].points[0].x,
        1,
        'Second series, first point, lands at 1'
    );
    assert.strictEqual(
        chart.series[1].points[1].x,
        0,
        'Second series, first point, lands at 0 because name exists in categories'
    );
});

QUnit.test('Categories defined, points go in right category', function (assert) {

    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: "Point names and categories"
        },
        "series": [{
            "data": [{
                "name": "May",
                "y": 1
            }],
            "name": "Alpha"
        }, {
            "data": [{
                "name": "Apr",
                "y": 1
            }, {
                "name": "May",
                "y": 2
            }, {
                "name": "Jun",
                "y": 3
            }],
            "name": "Beta"
        }],
        xAxis: {
            categories: ['Apr', 'May', 'Jun'],
            type: 'category'
        }
    });

    assert.strictEqual(
        chart.series[0].points[0].x,
        1,
        'First series, first point, lands at 1'
    );

    assert.strictEqual(
        chart.series[1].points[0].x,
        0,
        'Second series, first point, lands at 0'
    );
    assert.strictEqual(
        chart.series[1].points[1].x,
        1,
        'Second series, first point, lands at 1 because name exists in categories'
    );
});

QUnit.test('Keeping names updated with dynamic data', function (assert) {
    var chart = Highcharts.chart('container', {

        chart: {
            animation: false,
            type: 'column'
        },

        xAxis: {
            type: 'category'
        },

        plotOptions: {
            series: {
                animation: false
            }
        },

        series: [{
            name: 'First',
            data: [{
                name: 'Apples',
                y: 3
            }, {
                name: 'Pears',
                y: 2
            }, {
                name: 'Oranges',
                y: 4
            }]
        }, {
            name: 'Second',
            data: [{
                name: 'Oranges',
                y: 2
            }, {
                name: 'Bananas',
                y: 2
            }]
        }]

    });

    var names = chart.xAxis[0].names;
    assert.strictEqual(
        names.toString(),
        'Apples,Pears,Oranges,Bananas',
        'Initial'
    );


    chart.series[0].remove();
    assert.strictEqual(
        names.toString(),
        'Oranges,Bananas',
        'Series.remove'
    );

    chart.addSeries({
        name: 'Added',
        data: [{
            name: 'Addid1',
            y: 2
        }, {
            name: 'Addid2',
            y: 2
        }],
        type: 'column'
    });
    assert.strictEqual(
        names.toString(),
        'Oranges,Bananas,Addid1,Addid2',
        'Chart.addSeries'
    );


    chart.series[0].setData([{
        name: 'Setta1',
        y: 2
    }, {
        name: 'Setta2',
        y: 2
    }]);

    assert.strictEqual(
        names.toString(),
        'Setta1,Setta2,Addid1,Addid2',
        'Series.setData'
    );

    chart.series[0].update({
        name: 'Updated',
        data: [{
            name: 'Upda1',
            y: 2
        }, {
            name: 'Upda2',
            y: 2
        }]
    });

    assert.strictEqual(
        names.toString(),
        'Upda1,Upda2,Addid1,Addid2',
        'Series.update'
    );

    chart.series[0].points[0].update({
        name: 'UpdatPoint',
        y: 2
    });

    assert.strictEqual(
        names.toString(),
        'UpdatPoint,Upda2,Addid1,Addid2',
        'Point.update'
    );

    chart.series[0].points[0].remove();
    assert.strictEqual(
        names.toString(),
        'Upda2,Addid1,Addid2',
        'Point.remove'
    );
});

QUnit.test('uniqueNames default in the data module', function (assert) {
    var chart = Highcharts.chart('container', {
        data: {
            "seriesMapping": [{
                "x": 0
            }, {
                "x": 0
            }, {
                "x": 0
            }, {
                "x": 0
            }, {
                "x": 0
            }, {
                "x": 0
            }, {
                "x": 0
            }],
            "columnTypes": [
                "string",
                "float",
                "float",
                "float",
                "float",
                "float",
                "float",
                "float"
            ],
            "csv": ",Canada,France,Germany,Italy,Japan,United Kingdom,United States\n2008 Q1,100,100,100,100,100,100,100\nQ2,100.5,99.5,99.8,99.2,98.8,99.8,100.5\nQ3,101.2,99.3,99.4,97.9,97.8,98.1,100\nQ4,100.1,97.7,97.4,95.6,94.5,95.9,97.9\n2009 Q1,97.8,96.1,93.1,92.8,90.8,94.2,96.5\nQ2,96.9,96,93.2,92.4,92.4,94,96.4\nQ3,97.4,96.2,93.7,92.9,92.4,94.1,96.7\nQ4,98.7,96.8,94.5,92.9,94,94.5,97.7\n2010 Q1,100,97.2,95.2,93.4,95.4,95,98.1\nQ2,100.7,97.8,97.3,94.2,96.4,95.9,99\nQ3,101.1,98.4,98,94.6,97.8,96.5,99.7\nQ4,102.2,98.9,98.7,95,97.2,96.6,100.3\n2011 Q1,103,100,100.5,95.2,95.5,97.1,99.9\nQ2,103,99.9,100.7,95.4,94.9,97.3,100.7\nQ3,104.7,100.2,101.1,95.1,97.4,98,100.9\nQ4,105.3,100.4,101.1,94.3,97.5,98,102\n2012 Q1,105.5,100.6,101.4,93.5,98.6,98,102.6\nQ2,106,100.4,101.6,93.1,98.2,97.9,103\nQ3,106.1,100.6,101.6,92.7,97.7,98.7,103.6\nQ4,106.3,100.4,101.2,92,97.5,98.3,103.7\n2013 Q1,107.2,100.4,100.8,91.2,98.9,98.9,104.4\nQ2,107.7,101,101.6,91,99.6,99.6,104.8\nQ3,108.4,101,101.9,91,100,100.3,106\nQ4,109.2,101.2,102.4,90.9,99.7,100.7,106.9\n2014 Q1,109.5,101.2,103.2,90.9,101.1,101.3,106.3\nQ2,110.4,101.1,103.1,90.6,99.3,102.1,107.5\nQ3,111.2,101.3,103.1,90.5,98.9,102.9,108.8\nQ4,,,,,,103.4,"
        }
    });
    assert.strictEqual(
        chart.xAxis[0].names.length,
        28,
        'Each point its own category'
    );
});

QUnit.test('uniqueNames: false', function (assert) {
    var chart = Highcharts.chart('container', {

        xAxis: {
            type: 'category',
            uniqueNames: false
        },

        series: [{
            data: [{
                name: 'First',
                y: 1
            }, {
                name: 'Third',
                y: 2
            }, {
                name: 'Third',
                y: 3
            }],
            type: 'column',
            stacking: 'normal'
        }]

    });
    assert.strictEqual(
        chart.xAxis[0].names.length,
        3,
        'Each point its own category'
    );
});

QUnit.test('uniqueNames: true', function (assert) {
    var chart = Highcharts.chart('container', {

        xAxis: {
            type: 'category',
            uniqueNames: true
        },

        series: [{
            data: [{
                name: 'First',
                y: 1
            }, {
                name: 'Third',
                y: 2
            }, {
                name: 'Third',
                y: 3
            }],
            type: 'column',
            stacking: 'normal'
        }]

    });
    assert.strictEqual(
        chart.xAxis[0].names.length,
        2,
        'Equal categories creates stacks'
    );
});

QUnit.test('Keeping updated with setData (#5768)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },

        xAxis: {
            type: 'category'
        },

        series: [{
            data: [{
                name: 'Point 1',
                color: '#00FF00',
                y: 1
            }, {
                name: 'Point 2',
                color: '#FF00FF',
                y: 5
            }]
        }]
    });
    assert.strictEqual(
        chart.xAxis[0].names.join(','),
        'Point 1,Point 2',
        'Good to go'
    );

    chart.series[0].setData([{
        name: 'Updated 1',
        color: '#00FF00',
        y: 2
    }, {
        name: 'Updated 2',
        color: '#FF00FF',
        y: 3
    }, {
        name: 'Updated 3',
        color: '#8800FF',
        y: 3
    }]);

    assert.strictEqual(
        chart.xAxis[0].names.join(','),
        'Updated 1,Updated 2,Updated 3',
        'Changed with setData'
    );
});


QUnit.test('Set crosshair width (#5819)', function (assert) {
    var chart = Highcharts.chart('container', {
        xAxis: {
            type: 'category',
            crosshair: {
                color: 'black',
                width: 1
            }
        },
        series: [{
            data: [1, 2, 3, 4, 5]
        }]
    });

    chart.series[0].points[1].onMouseOver();
    chart.xAxis[0].drawCrosshair({}, chart.series[0].points[1]);

    assert.strictEqual(chart.xAxis[0].cross['stroke-width'], 1, 'Stroke width is set to 1');
});

QUnit.test('Extremes unaltered after redraw (#5928)', function (assert) {
    var chart = Highcharts.chart('container', {

        chart: {
            width: 400,
            animation: false
        },

        xAxis: {
            type: 'category',
            uniqueNames: false
        },

        "series": [{
            animation: false,
            "data": [
                ["2014", 1.1],
                ["2013", 11.6],
                ["2012", 8.4]
            ]
        }]
    });

    assert.strictEqual(
        chart.xAxis[0].min,
        0,
        'Initial min'
    );

    assert.strictEqual(
        chart.xAxis[0].max,
        2,
        'Initial max'
    );

    chart.setSize(390);



    assert.strictEqual(
        chart.xAxis[0].min,
        0,
        'Unaltered min'
    );

    assert.strictEqual(
        chart.xAxis[0].max,
        2,
        'Unaltered max'
    );


    chart.series[0].addPoint(['2016', 3]);

    assert.strictEqual(
        chart.xAxis[0].min,
        0,
        'Unaltered min'
    );

    assert.strictEqual(
        chart.xAxis[0].max,
        3,
        'Increased max'
    );
});

QUnit.test(
    'Keep names after redraw when point.options.x is set (#6207)',
    function (assert) {
        var chart = new Highcharts.Chart({
            chart: {
                renderTo: 'container',
                type: 'column',

            },
            xAxis: {
                type: 'category'
            },

            series: [{
                data: [{
                    x: 0,
                    y: 3750,
                    name: "Zero"
                }, {
                    x: 1,
                    y: 3000,
                    name: "One"
                }, {
                    x: 3,
                    y: 2500,
                    name: "Three"
                }]
            }]
        });

        assert.strictEqual(
            chart.xAxis[0].names.toString(),
            'Zero,One,,Three',
            'Initial names'
        );

        chart.series[0].hide();
        chart.series[0].show();
        assert.strictEqual(
            chart.xAxis[0].names.toString(),
            'Zero,One,,Three',
            'Preserved names'
        );

    }
);
