QUnit.test('Init chart with different defined type.', function (assert) {
    Highcharts.each([[], {}, undefined, null], function (definedType) {
        Highcharts.stockChart('container', {
            xAxis: definedType,
            yAxis: definedType,
            series: []
        });
        assert.ok(true, "No errors (#7995).");
    });
});
