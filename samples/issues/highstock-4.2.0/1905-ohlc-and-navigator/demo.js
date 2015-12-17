$(function () {
    QUnit.test('OHLC and navigator', function (assert) {
        var chart = Highcharts.stockChart('container', {
            "series": [{
                "data": [{
                    "open": 3.01,
                    "high": 3.16,
                    "low": 2.97,
                    "close": 3.12,
                    "x": 1059350400000
                }, {
                    "open": 3.12,
                    "high": 3.25,
                    "low": 3.01,
                    "close": 3.01,
                    "x": 1059436800000
                }],
                "type": "candlestick"
            }],
            "navigator": {
                "enabled": true
            },
            "chart": {
                "renderTo": "container113"
            }
        });
        assert.ok(
            chart.scroller.series.graph.element.getBBox().width > 100,
            'Navigator has a graph'
        );
    });
});