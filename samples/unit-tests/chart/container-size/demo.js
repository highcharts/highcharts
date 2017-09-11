QUnit.test('Zero height', function (assert) {
    var container = document.createElement('div');
    container.style.minHeight = 0;
    document.getElementById('container').appendChild(container);

    var chart = Highcharts.chart(container, {
        series: [{
            data: [1, 3, 2, 4]
        }]
    });

    assert.strictEqual(
        chart.chartHeight,
        400,
        '400px'
    );
});

QUnit.test('1px height (#6261)', function (assert) {
    var container = document.createElement('div');
    container.style.minHeight = '1px';
    document.getElementById('container').appendChild(container);

    var chart = Highcharts.chart(container, {
        series: [{
            data: [1, 3, 2, 4]
        }]
    });

    assert.strictEqual(
        chart.chartHeight,
        400,
        '400px'
    );
});

QUnit.test('10px height (#6217)', function (assert) {
    var container = document.createElement('div');
    container.style.minHeight = '10px';
    document.getElementById('container').appendChild(container);

    var chart = Highcharts.chart(container, {
        series: [{
            data: [1, 3, 2, 4]
        }]
    });

    assert.strictEqual(
        chart.chartHeight,
        10,
        '10px'
    );
});