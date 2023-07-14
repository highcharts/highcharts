QUnit.test('Sonification classes are exposed', function (assert) {
    assert.ok(Highcharts.sonification.Sonification.prototype);
    assert.ok(Highcharts.sonification.SonificationInstrument.prototype);
    assert.ok(Highcharts.sonification.SonificationSpeaker.prototype);
    assert.ok(Highcharts.sonification.SonificationTimeline.prototype);
    assert.ok(Highcharts.sonification.SynthPatch.prototype);
    assert.ok(Highcharts.sonification.InstrumentPresets);
});
