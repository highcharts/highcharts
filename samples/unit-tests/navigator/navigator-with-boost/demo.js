QUnit.test(
    'Navigator with Boost',
    function (assert) {
        const pointStart = Date.UTC(2024, 0, 1),
            pointInterval = 36e5;
        function getData(n) {
            const arr = [];

            for (let i = 0; i < n; i = i + 1) {
                arr.push([
                    pointStart + pointInterval * i,
                    2 * Math.sin(i / 100) + Math.random()
                ]);
            }
            return arr;
        }
        const n = 10000,
            data = getData(n);

        const chart = Highcharts.stockChart('container', {
            navigator: {
                enabled: true,
                series: {
                    type: 'line',
                    dataGrouping: {
                        enabled: false
                    }
                }
            },
            xAxis: {
                type: 'datetime'
            },
            series: [{
                data: data,
                dataGrouping: {
                    enabled: false
                }
            }]
        });

        // Chart redraw triggers the invisible navigator error.
        chart.redraw();
        assert.ok(true);
    }
);