QUnit.test('getTitlePosition', function (assert) {
    assert.expect(0);
    Highcharts.chart('container', {
        yAxis: {
            title: {
                text: 'yAxisTitle',
                style: {
                    color: 'red',
                    fontSize: 'x-large'
                }
            }
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            title: {
                text: 'xAxisTitle',
                style: {
                    color: 'red',
                    fontSize: 'x-large'
                }
            }
        },

        legend: {
            enabled: false
        },

        credits: {
            enabled: false
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]
    });
});
