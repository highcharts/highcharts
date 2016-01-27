jQuery(function () {
    QUnit.test('Correct float for isSum and isIntermediateSum', function (assert) {
        var chart = Highcharts.chart('container', {
            'chart': {
                'type': 'waterfall'
            },
            'plotOptions': {
                'series': {
                    'dataLabels': {
                        'enabled': true
                    }
                }
            },
            'series': [{
                'data': [
                    { 'y': 18.4 },
                    { 'y': 0.1 },
                    { 'isIntermediateSum': true },
                    { 'y': 0.3 },
                    { 'y': -0.4 },
                    { 'isIntermediateSum': true },
                    { 'isSum': true }
                ]
            }],
            'yAxis': {
                'min': 17.5
            }
        });
        console.log(chart);
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
});