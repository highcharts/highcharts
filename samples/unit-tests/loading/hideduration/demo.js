
QUnit.test('Show and hide duration', function (assert) {

    var chart = Highcharts.chart('container', {
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

    var clock = TestUtilities.lolexInstall();

    try {

        var newOp,
            oldOp,
            done = assert.async();

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
                '200ms - Started'
            );
            oldOp = newOp;
        }, 200);

        setTimeout(function () {
            newOp = parseFloat(chart.loadingDiv.style.opacity);
            assert.strictEqual(
                newOp > oldOp,
                true,
                '400ms - Doing good'
            );
            oldOp = newOp;
        }, 400);

        setTimeout(function () {
            newOp = parseFloat(chart.loadingDiv.style.opacity);
            assert.strictEqual(
                newOp,
                chart.options.loading.style.opacity,
                '1200ms - Landed'
            );
            oldOp = newOp;

            // And hide
            chart.hideLoading();
        }, 1200);

        setTimeout(function () {
            newOp = parseFloat(chart.loadingDiv.style.opacity);
            assert.strictEqual(
                newOp < oldOp,
                true,
                '1600ms - Started hiding'
            );
            oldOp = newOp;
        }, 1600);

        setTimeout(function () {
            newOp = parseFloat(chart.loadingDiv.style.opacity);
            assert.strictEqual(
                newOp,
                0,
                '2400ms - Landed'
            );
            oldOp = newOp;
            done();
        }, 2400);

        TestUtilities.lolexRunAndUninstall(clock);

    } finally {

        TestUtilities.lolexUninstall(clock);

    }

});