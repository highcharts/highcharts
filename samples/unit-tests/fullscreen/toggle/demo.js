QUnit.test("Fullscreen module.", function (assert) {
    var chart = Highcharts.chart('container', {
        series: [{
            data: [5, 3, 4, 2, 4, 3]
        }]
    });

    chart.fullscreen.toggle();

    assert.ok(
        true,
        'Chart displayed in fullscreen mode without any errors.'
    );

});