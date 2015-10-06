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
        'image/jpeg',
        'Posting for JPG'
    );
});