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
        'Addid1,Addid2,Upda1,Upda2', // Note that xAxis.series order gets changed when series.update. It may be considered a bug.
        'Series.update'
    );

    chart.series[0].points[0].update({
        name: 'UpdatPoint',
        y: 2
    });

    assert.strictEqual(
        names.toString(),
        'Addid1,Addid2,UpdatPoint,Upda2',
        'Point.update'
    );

    chart.series[0].points[0].remove();
    assert.strictEqual(
        names.toString(),
        'Addid1,Addid2,Upda2',
        'Point.remove'
    );
});