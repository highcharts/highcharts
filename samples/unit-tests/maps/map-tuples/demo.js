QUnit.test('Basic map tuple', function (assert) {
    var chart = Highcharts.mapChart('container', {
        series: [{
            mapData: Highcharts.maps['custom/europe'],
            data: [
                ['no', 5],
                ['fr', 3],
                ['gb', 2]
            ]
        }]
    });

    assert.strictEqual(
        chart.series[0].points[0]['hc-key'],
        'no',
        'hc-key is set'
    );

    assert.strictEqual(
        chart.series[0].points[0].value,
        5,
        'value is set'
    );

    assert.ok(
        chart.series[0].points[0].path.length,
        'has path'
    );
});

QUnit.test('Map tuple with keys', function (assert) {
    var chart = Highcharts.mapChart('container', {
        series: [{
            keys: ['hc-key', 'value', 'testprop'],
            mapData: Highcharts.maps['custom/europe'],
            data: [
                ['no', 6, 'bob'],
                ['fr', 3, 'john'],
                ['gb', 2, 'fred']
            ]
        }]
    });

    assert.strictEqual(
        chart.series[0].points[0]['hc-key'],
        'no',
        'hc-key is set'
    );

    assert.strictEqual(
        chart.series[0].points[0].value,
        6,
        'value is set'
    );

    assert.strictEqual(
        chart.series[0].points[0].testprop,
        'bob',
        'testprop is set'
    );

    assert.ok(
        chart.series[0].points[0].path.length,
        'has path'
    );
});

QUnit.test('Map tuple with keys in other order', function (assert) {
    var chart = Highcharts.mapChart('container', {
        series: [{
            keys: ['value', 'hc-key', 'name', 'testprop'],
            joinBy: 'name',
            mapData: Highcharts.maps['custom/europe'],
            data: [
                [5, 'no', 'Norway', 1],
                [4, 'fr', 'France', 1],
                [3, 'de', 'Germany', 1]
            ]
        }]
    });

    assert.strictEqual(
        chart.series[0].points[0]['hc-key'],
        'no',
        'hc-key is set'
    );

    assert.strictEqual(
        chart.series[0].points[0].name,
        'Norway',
        'name is set'
    );

    assert.strictEqual(
        chart.series[0].points[0].value,
        5,
        'value is set'
    );

    assert.strictEqual(
        chart.series[0].points[0].testprop,
        1,
        'testprop is set'
    );

    assert.ok(
        chart.series[0].points[0].path.length,
        'has path'
    );
});