QUnit.test('Test OBV calculations on data updates.', function (assert) {
    const chart = Highcharts.stockChart('container', {
        yAxis: [{
            height: '60%'
        }, {
            height: '20%',
            top: '60%'
        }, {
            height: '20%',
            top: '80%'
        }],
        series: [{
            id: 'main',
            data: [
                [1552311000000, 10],
                [1552397400000, 10.15],
                [1552483800000, 10.17],
                [1552570200000, 10.13],
                [1552656600000, 10.11],
                [1552915800000, 10.15],
                [1553002200000, 10.20],
                [1553088600000, 10.20],
                [1553175000000, 10.22]
            ]
        }, {
            type: 'column',
            id: 'volume',
            yAxis: 1,
            data: [
                [1552311000000, 25200],
                [1552397400000, 30000],
                [1552483800000, 25600],
                [1552570200000, 32000],
                [1552656600000, 23000],
                [1552915800000, 40000],
                [1553002200000, 36000],
                [1553088600000, 20500],
                [1553175000000, 23000]
            ]
        }, {
            type: 'obv',
            linkedTo: 'main',
            yAxis: 2
        }]
    });

    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[1].points.length,
        'OBV should have the same amount of points as the main series.'
    );

    chart.series[0].addPoint([1553261400000, 10.21], false);
    chart.series[1].addPoint([1553261400000, 27500]);

    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[1].points.length,
        'OBV should have the same amount of points as the main series after adding point.'
    );

    assert.deepEqual(
        chart.series[2].yData,
        [
            0,
            30000,
            55600,
            23600,
            600,
            40600,
            76600,
            76600,
            99600,
            72100
        ],
        'Correct values'
    );
});
