
QUnit.test('Show and hide duration', function (assert) {

    var chart = Highcharts
        .chart('container', {
            loading: {
                hideDuration: 1000,
                showDuration: 1000
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            series: [{
                data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
            }]
        });

    var clock = null;

    try {

        var newOp,
            oldOp,
            done = assert.async();

        clock = lolexInstall();

        setTimeout(function () {
            chart.showLoading();
            oldOp = parseFloat(chart.loadingDiv.style.opacity);
            assert.strictEqual(
                oldOp.toPrecision(3),
                '0.00',
                'Starting...'
            );
        }, 0);

        setTimeout(function () {
            newOp = parseFloat(chart.loadingDiv.style.opacity);
            assert.strictEqual(
                newOp > oldOp,
                true,
                '100ms - Started'
            );
            oldOp = newOp;
        }, 100);

        setTimeout(function () {
            newOp = parseFloat(chart.loadingDiv.style.opacity);
            assert.strictEqual(
                newOp > oldOp,
                true,
                '500ms - Doing good'
            );
            oldOp = newOp;
        }, 500);

        setTimeout(function () {
            newOp = parseFloat(chart.loadingDiv.style.opacity);
            assert.strictEqual(
                newOp,
                chart.options.loading.style.opacity,
                '1000ms - Landed'
            );
            oldOp = newOp;

            // And hide
            chart.hideLoading();
        }, 1010);

        setTimeout(function () {
            newOp = parseFloat(chart.loadingDiv.style.opacity);
            assert.strictEqual(
                newOp < oldOp,
                true,
                '1500ms - Started hiding'
            );
            oldOp = newOp;
        }, 1500);

        setTimeout(function () {
            newOp = parseFloat(chart.loadingDiv.style.opacity);
            assert.strictEqual(
                newOp,
                0,
                '2000ms - Landed'
            );
            oldOp = newOp;
            done();
        }, 2020);

        lolexRunAndUninstall(clock);

    } finally {

        lolexUninstall(clock);

    }

});