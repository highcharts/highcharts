QUnit.test('Count menu items', function (assert) {
    var chart = Highcharts.charts[0],
        button = chart.renderer.box.querySelector('.highcharts-button');


    assert.strictEqual(
        button.nodeName,
        'g',
        'Button is there'
    );

    // Click it
    $(button).click();
    assert.strictEqual(
        document.querySelector('.highcharts-contextmenu').firstChild.childNodes.length,
        2,
        'Two menu items'
    );


});