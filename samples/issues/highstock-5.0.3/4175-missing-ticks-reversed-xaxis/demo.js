$(function () {
    QUnit.test(
        'Ticks should be visible, when xAxis is reversed',
        function (assert) {
            var chart = Highcharts.stockChart('container', {
                xAxis: {
                    reversed: true
                },
                rangeSelector: {
                    selected: 1
                },
                navigator: {
                    enabled: false
                },
                series: [{
                    data: [
                        [Date.UTC(2007, 7, 29), 0.7311],
                        [Date.UTC(2007, 7, 30), 0.7331],
                        [Date.UTC(2007, 7, 31), 0.7337],
                        [Date.UTC(2007, 8, 3), 0.7342],
                        [Date.UTC(2007, 8, 4), 0.7349],
                        [Date.UTC(2007, 8, 5), 0.7326],
                        [Date.UTC(2007, 8, 6), 0.7306],
                        [Date.UTC(2007, 8, 7), 0.7263],
                        [Date.UTC(2007, 8, 10), 0.7247],
                        [Date.UTC(2007, 8, 11), 0.7227],
                        [Date.UTC(2007, 8, 12), 0.7191],
                        [Date.UTC(2007, 8, 13), 0.7209],
                        [Date.UTC(2007, 8, 14), 0.7207],
                        [Date.UTC(2007, 8, 17), 0.7211],
                        [Date.UTC(2007, 8, 18), 0.7153],
                        [Date.UTC(2007, 8, 19), 0.7165],
                        [Date.UTC(2007, 8, 20), 0.7107],
                        [Date.UTC(2007, 8, 21), 0.7097],
                        [Date.UTC(2007, 8, 24), 0.7098],
                        [Date.UTC(2007, 8, 25), 0.7069],
                        [Date.UTC(2007, 8, 26), 0.7078],
                        [Date.UTC(2007, 8, 27), 0.7066],
                        [Date.UTC(2007, 8, 28), 0.7006],
                        [Date.UTC(2007, 9, 1), 0.7027],
                        [Date.UTC(2007, 9, 2), 0.7067],
                        [Date.UTC(2007, 9, 3), 0.7097],
                        [Date.UTC(2007, 9, 4), 0.7074],
                        [Date.UTC(2007, 9, 5), 0.7075],
                        [Date.UTC(2007, 9, 8), 0.7114]
                    ]
                }]
            });

            assert.strictEqual(
                chart.xAxis[0].tickPositions.length > 2,
                true,
                'Ticks exist'
            );

        }
    );
});