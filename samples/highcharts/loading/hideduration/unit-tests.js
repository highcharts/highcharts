QUnit.test('Show and hide duration', function (assert) {
    var chart = Highcharts.charts[0],
        newOp,
        oldOp,
        done = assert.async();

    chart.showLoading();
    oldOp = parseFloat(chart.loadingDiv.style.opacity);
    assert.strictEqual(
        oldOp,
        0,
        'Starting...'
    );
   

    setTimeout(function () {
        newOp = parseFloat(chart.loadingDiv.style.opacity);
        assert.strictEqual(
            newOp > oldOp,
            true,
            '400ms - Started'
        );
        oldOp = newOp;
    }, 400);

    setTimeout(function () {
        newOp = parseFloat(chart.loadingDiv.style.opacity);
        assert.strictEqual(
            newOp > oldOp,
            true,
            '800ms - Doing good'
        );
        oldOp = newOp;
    }, 800);

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

});