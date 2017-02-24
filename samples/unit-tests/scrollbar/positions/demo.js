QUnit.test('#6262 - inverted chart: wrong position for chart.scrollbar without navigator.', function (assert) {
    var options = {
            chart: {
                inverted: true
            },
            xAxis: {
                min: 0,
                max: 3,
                scrollbar: {
                    enabled: true
                }
            },
            series: [{
                data: [4, 20, 100, 5, 2, 33, 12, 23]
            }]
        },
        chart = Highcharts.chart('container', options),
        position = chart.xAxis[0].scrollbar.group.translateY;

    options.scrollbar = {
        enabled: true
    };
    options.xAxis.scrollbar = null;
    
    chart = Highcharts.chart('container', options);

    assert.strictEqual(
        chart.scrollbar.group.translateY,
        position,
        'The same position for xAxis.scrollbar and chart.scrollbar'
    );
});
