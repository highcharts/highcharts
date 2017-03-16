QUnit.test('#6433 - axis.update leaves empty plotbands\' groups', function (assert) {
    var chart = new Highcharts.chart('container', {
            xAxis: {
                plotBands: [{
                    from: 0.5,
                    to: 1,
                    color: 'red'
                }]
            },
            series: [{
                data: [10, 20]
            }]
        });

    chart.xAxis[0].update({});
    chart.xAxis[0].update({});

    assert.strictEqual(
        document.getElementsByClassName('highcharts-plot-bands-0').length,
        1,
        'Just one plotband group'
    );
});
