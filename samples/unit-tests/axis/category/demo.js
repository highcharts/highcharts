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
            categories: ['Apr', 'May', 'Jun']
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
