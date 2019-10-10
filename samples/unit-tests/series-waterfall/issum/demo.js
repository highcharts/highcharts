QUnit.test('Correct float for isSum and isIntermediateSum (#4954)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'waterfall'
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        series: [{
            data: [
                { y: 18.4 },
                { y: 0.1 },
                { isIntermediateSum: true },
                { y: 0.3 },
                { y: -0.4 },
                { isIntermediateSum: true },
                { isSum: true }
            ]
        }],
        yAxis: {
            min: 17.5
        }
    });

    assert.strictEqual(
        chart.series[0].data[2].y,
        18.5,
        'First isIntermediateSum is correct'
    );
    assert.strictEqual(
        chart.series[0].data[5].y,
        -0.1,
        'Second isIntermediateSum is correct'
    );
    assert.strictEqual(
        chart.series[0].data[6].y,
        18.4,
        'isSum is correct'
    );
});

QUnit.test('First point as sum', assert => {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'waterfall'
        },

        xAxis: {
            type: 'category'
        },

        series: [{
            data: [{
                name: 'Positive Balance',
                isIntermediateSum: true
            }, {
                name: 'Fixed Costs',
                y: -342000
            }, {
                name: 'Balance',
                isSum: true
            }]
        }]
    });
    assert.ok(
        chart.series[0].points[1].graphic.attr('height') > 10,
        'The series should initially be rendered without errors (#3245)'
    );

    chart.series[0].setData([{
        name: 'Positive Balance',
        isIntermediateSum: true
    }, {
        name: 'Balance',
        isSum: true
    }]);

    assert.strictEqual(
        chart.series[0].points[1].graphic.attr('stroke-width'),
        1,
        'The series should be updated without errors (#7559)'
    );
});
