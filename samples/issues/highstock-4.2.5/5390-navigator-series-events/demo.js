$(function () {
    QUnit.test('Extremes in navigator with empty series initalized.', function (assert) {

        var chart = Highcharts.stockChart('container', {
                series: []
            }),
            series = [{
                data: [{
                    x: 1465102500000,
                    y: 0.0057043973610007015
                }, {
                    x: 1465251900000,
                    y: 0.020374603343000786
                }]
            }, {
                data: [{
                    x: 1465102800000,
                    y: 23
                }, {
                    x: 1465252200000,
                    y: 77
                }]
            }, {
                data: [{
                    x: 1465102800000,
                    y: 1.2800000000000011
                }, {
                    x: 1465252200000,
                    y: 1.3199999999999932
                }]
            }],
            points = [{
                data: [{
                    x: 1464951300000,
                    y: 0.04950855198299564
                }, {
                    x: 1465100700000,
                    y: 0.007108723524993366
                }]
            }, {
                data: [{
                    x: 1464951600000,
                    y: 101
                }, {
                    x: 1465101000000,
                    y: 18
                }]
            }, {
                data: [{
                    x: 1464951600000,
                    y: 1.5
                }, {
                    x: 1465101000000,
                    y: 1.2399999999999949
                }]
            }];

        Highcharts.each(series, function (s) {
            chart.addSeries(s, false);
        });
        chart.xAxis[0].setExtremes();

        Highcharts.each(points, function (s, index) {
            if (chart.series[index].options.id !== "highcharts-navigator-series") {
                Highcharts.each(s.data, function (p) {
                    chart.series[index].addPoint(p, false);
                });
            }
        });
        chart.xAxis[0].setExtremes();

        assert.strictEqual(
            chart.xAxis[1].getExtremes().max,
            1465251900000,
            'Correct extremes in navigator'
        );

    });
});