QUnit.test('Sonification classes are exposed', function (assert) {
    assert.ok(Highcharts.sonification.Instrument.prototype);
    assert.ok(Highcharts.sonification.instruments);
});
