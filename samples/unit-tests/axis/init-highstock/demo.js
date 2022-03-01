QUnit.test('Init chart with different defined type.', function (assert) {
    [[], {}, undefined, null].forEach(definedType => {
        Highcharts.stockChart('container', {
            xAxis: definedType,
            yAxis: definedType,
            series: []
        });
        assert.ok(true, 'No errors (#7995).');
    });
});
