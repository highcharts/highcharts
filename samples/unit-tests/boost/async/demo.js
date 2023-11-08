QUnit.test(
    'Deleting boost series while being created does not raise an error',
    function (assert) {
        const done = assert.async();

        function getData(n) {
            const arr = new Array(n);

            let i = 0;
            let x = Date.UTC(new Date().getUTCFullYear(), 0, 1) - n * 36e5;

            for (; i < n; i = i + 1, x = x + 36e5) {
                arr[i] = [x, 2 * Math.sin(i / 100)];
            }

            return arr;
        }

        const chart = Highcharts.chart('container', {});

        // wait for ~1 second
        setTimeout(() => {
            // Failure will be a global TypeError, which QUnit catches by itself
            assert.ok(
                true,
                'There should be no global errors prior to this one'
            );
            done();
        }, 1000);

        chart.addSeries({
            data: getData(5000)
        });

        chart.series[0].remove();
    }
);
