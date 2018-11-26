QUnit.test('Sonification classes are exposed', function (assert) {
    assert.ok(Highcharts.sonification.Instrument.prototype);
    assert.ok(Highcharts.sonification.instruments);
    assert.ok(Highcharts.sonification.Earcon.prototype);
    assert.ok(Highcharts.sonification.utilities);
    assert.ok(Highcharts.sonification.utilities.musicalFrequencies);
});
