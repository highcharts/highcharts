QUnit.test('Capture POST', function (assert) {
    var chart = Highcharts.charts[0],
        postData;

    Highcharts.post = function (url, data, formAttributes) {
        postData = data;
    };


    // Run export width custom file name
    chart.exportChart({
        type: 'application/pdf',
        filename: 'my-pdf'
    });
    assert.strictEqual(
        postData.type,
        'application/pdf',
        'Posting for PDF'
    );

    assert.strictEqual(
        postData.filename,
        'my-pdf',
        'File name came through'
    );
});