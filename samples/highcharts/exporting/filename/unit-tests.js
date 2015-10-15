QUnit.test('Capture POST', function (assert) {
    var chart = Highcharts.charts[0],
        postData;

    Highcharts.post = function (url, data, formAttributes) {
        postData = data;
    };


    // Run export
    chart.exportChart();
    assert.strictEqual(
        postData.type,
        'image/png',
        'Posting for PNG'
    );
    assert.strictEqual(
        postData.filename,
        'custom-file-name',
        'Custom filename'
    );
});