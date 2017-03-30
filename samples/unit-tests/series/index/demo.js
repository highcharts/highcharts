

QUnit.test('Series index and updating (#5960)', function (assert) {

    var chart;

    function getNames() {
        return chart.series.map(function (s) {
            return s.name;
        }).join(', ');
    }

    chart = Highcharts.chart('container', {
        series: [{
            data: [5, 5, 5]
        }, {
            data: [10, 10, 10]
        }, {
            data: [15, 15, 15]
        }, {
            data: [20, 20, 20]
        }, {
            data: [25, 25, 25]
        }]
    });

    assert.strictEqual(
        getNames(),
        'Series 1, Series 2, Series 3, Series 4, Series 5',
        'Initial order'
    );

    chart.series[1].remove();
    chart.series[1].remove();
    chart.series[1].remove();


    assert.strictEqual(
        getNames(),
        'Series 1, Series 5',
        'Order after remove'
    );

    chart.addSeries({
        data: [25, 25, 25],
        name: "New Series"
    });

    assert.strictEqual(
        getNames(),
        'Series 1, Series 5, New Series',
        'Order after adding'
    );
});

QUnit.test('Updating series index (#6112)', function (assert) {
    var chart = Highcharts.chart('container', {

        series: [{
            id: 'test1',
            name: 'First',
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
            type: 'column'
        }, {
            id: 'test2',
            name: 'Second',
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
            type: 'column'
        }]

    });

    var swapped = false;
    function swap() {

        chart.get('test1').update({ index: swapped ? 0 : 1 }, false);
        chart.get('test2').update({ index: swapped ? 1 : 0 }, false);

        chart.redraw();
        swapped = !swapped;
    }

    assert.strictEqual(
        chart.series[0].name,
        'First',
        'Initial order'
    );

    assert.strictEqual(
        chart.series[0].index,
        0,
        'Initial order'
    );

    assert.strictEqual(
        chart.series[1].name,
        'Second',
        'Initial order'
    );

    assert.strictEqual(
        chart.series[1].index,
        1,
        'Initial order'
    );

    swap();

    assert.strictEqual(
        chart.series[0].name,
        'Second',
        'Swapped once'
    );

    assert.strictEqual(
        chart.series[0].index,
        0,
        'Swapped once'
    );

    assert.strictEqual(
        chart.series[1].name,
        'First',
        'Swapped once'
    );

    assert.strictEqual(
        chart.series[1].index,
        1,
        'Swapped once'
    );

    swap();

    assert.strictEqual(
        chart.series[0].name,
        'First',
        'Swapped twice'
    );

    assert.strictEqual(
        chart.series[0].index,
        0,
        'Swapped twice'
    );

    assert.strictEqual(
        chart.series[1].name,
        'Second',
        'Swapped twice'
    );

    assert.strictEqual(
        chart.series[1].index,
        1,
        'Swapped twice'
    );
});