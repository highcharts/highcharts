QUnit.test('Capture POST', function (assert) {
    var chart = Highcharts.charts[0],
        postData;

    Highcharts.post = function (url, data, formAttributes) {
        postData = data;
    };


    // Run export width custom background
    chart.exportChart(null, {
        chart: {
            backgroundColor: '#FFEEFF'
        }
    });
    assert.strictEqual(
        postData.type,
        'image/png',
        'Posting for PNG'
    );

    assert.strictEqual(
        typeof postData.svg,
        'string',
        'SVG is there'
    );

    assert.strictEqual(
        postData.svg.indexOf('linearGradient'),
        -1,
        'Gradient is gone'
    );

    assert.notEqual(
        postData.svg.indexOf('#FFEEFF'),
        -1,
        'Solid background is there'
    );
});