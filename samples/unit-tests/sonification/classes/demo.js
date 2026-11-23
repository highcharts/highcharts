QUnit.test('Sonification classes are exposed', function (assert) {
    assert.ok(Highcharts.sonification.Sonification.prototype);
    assert.ok(Highcharts.sonification.SonificationInstrument.prototype);
    assert.ok(Highcharts.sonification.SonificationSpeaker.prototype);
    assert.ok(Highcharts.sonification.SonificationTimeline.prototype);
    assert.ok(Highcharts.sonification.SynthPatch.prototype);
    assert.ok(Highcharts.sonification.InstrumentPresets);
});

QUnit.test('Oscillators accept zero volume pitch tracking', function (assert) {
    const context = new AudioContext(),
        synth = new Highcharts.sonification.SynthPatch(context, {
            oscillators: [{
                type: 'sine',
                volumePitchTrackingMultiplier: 0
            }]
        });

    assert.ok(
        synth.oscillators[0].volTrackingNode,
        'The oscillator should create its volume tracking stage'
    );

    context.close();
});
