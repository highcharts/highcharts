QUnit.test('Capture POST', function (assert) {
    var chart = Highcharts.charts[0],
        button = chart.renderer.box.querySelector('.highcharts-button'),
        postData;

    Highcharts.post = function (url, data, formAttributes) {
        postData = data;
    };


    assert.strictEqual(
        button.nodeName,
        'g',
        'Button is there'
    );

    // Click it
    $(button).click();
    assert.strictEqual(
        postData.type,
        'image/png',
        'Posting for PNG'
    );
    assert.strictEqual(
        typeof postData.svg,
        'string',
        'SVG is posted'
    );


});