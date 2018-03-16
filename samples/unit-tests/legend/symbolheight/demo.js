

QUnit.test(
    'Legend symbol marker should not exceed symbolHeight (#6202)',
    function (assert) {

        var done = assert.async();

        var url = (location.host === 'localhost:9876') ?
            'url(base/test/testimage.png)' : // karma
            'url(testimage.png)'; // utils

        var chart = Highcharts.chart('container', {

            chart: {
                events: {
                    load: function () {

                        assert.strictEqual(
                            Math.round(chart.series[0].legendSymbol.getBBox().height),
                            Math.round(chart.legend.symbolHeight),
                            'Legend symbol is reduced to symbolHeight'
                        );

                        assert.strictEqual(
                            Math.round(chart.series[1].legendSymbol.getBBox().height),
                            Math.round(chart.legend.symbolHeight),
                            'Legend image is reduced to symbolHeight'
                        );

                        done();
                    }
                }
            },

            series: [{
                data: [1, 3, 2, 4],
                marker: {
                    radius: 20
                }
            }, {
                data: [2, 4, 3, 5],
                marker: {
                    symbol: url.replace(')', '?' + Date.now() + ')')
                }
            }]

        });

    }
);