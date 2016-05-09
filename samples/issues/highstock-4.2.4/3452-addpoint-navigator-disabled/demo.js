$(function () {
    QUnit.test('Empty scroller with Axis min set', function (assert) {

        var chart,
            x = 0;

        function add() {
            // set up the updating of the chart each second
            var series = chart.series[0];
            series.addPoint([x++, x % 10], true, true);
        }
        // Create the chart
        chart = Highcharts.stockChart('container', {
            rangeSelector: {
                buttons: [{
                    count: 100,
                    type: 'millisecond',
                    text: '100ms'
                }, {
                    count: 1,
                    type: 'second',
                    text: '1s'
                }, {
                    type: 'all',
                    text: 'All'
                }],
                inputEnabled: false,
                selected: 0
            },

            title: {
                text: 'Live random data'
            },

            exporting: {
                enabled: false
            },

            series: [{
                name: 'Random data',
                data: (function () {
                    // generate an array of random data
                    var data = [],
                        i;

                    for (i = -1000; i <= 0; i += 1) {
                        data.push([
                            x++,
                            x % 10
                        ]);
                    }
                    return data;
                }())
            }],

            navigator: {
                enabled: false
            }
        });


        assert.strictEqual(
            chart.xAxis[0].min,
            900,
            'Initial min'
        );
        assert.strictEqual(
            chart.xAxis[0].max,
            1000,
            'Initial max'
        );

        // Add one point, the zoomed range should now move
        add();

        assert.strictEqual(
            chart.xAxis[0].min,
            901,
            'Adapted min'
        );
        assert.strictEqual(
            chart.xAxis[0].max,
            1001,
            'Adapted max'
        );
    });
});