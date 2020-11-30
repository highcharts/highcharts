QUnit.test('Squished text with Chart.addSeries (#5086)', function (assert) {
    var series = {
        data: [
            ['MapRefreshListServer', 1618],
            ['MapGetNewLolomoServer', 1],
            ['MapGetGenreListServer', 1]
        ]
    };

    var chart1 = Highcharts.chart('container', {
        chart: {
            width: 400
        },
        xAxis: {
            type: 'category'
        },
        series: [series]
    });
    var textWidth = chart1.xAxis[0].ticks['0'].label.styles.width;

    var chart2 = Highcharts.chart('container', {
        chart: {
            width: 400
        },
        xAxis: {
            type: 'category'
        }
    });
    chart2.addSeries(series);

    assert.strictEqual(
        typeof chart2.xAxis[0].ticks['0'].label.styles.width,
        'string',
        'Label CSS width should be set'
    );
    assert.strictEqual(
        chart2.xAxis[0].ticks['0'].label.styles.width,
        textWidth,
        'Label widths are equal'
    );
});
