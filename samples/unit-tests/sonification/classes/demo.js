QUnit.test('Sonification classes are exposed', function (assert) {
    assert.ok(Highcharts.sonification.Sonification.prototype);
    assert.ok(Highcharts.sonification.SonificationInstrument.prototype);
    assert.ok(Highcharts.sonification.SonificationSpeaker.prototype);
    assert.ok(Highcharts.sonification.SonificationTimeline.prototype);
    assert.ok(Highcharts.sonification.SynthPatch.prototype);
    assert.ok(Highcharts.sonification.InstrumentPresets);
});

QUnit.test('Pulse oscillators accept a zero pulse width', function (assert) {
    const context = new AudioContext(),
        synth = new Highcharts.sonification.SynthPatch(context, {
            oscillators: [{
                type: 'pulse',
                pulseWidth: 0
            }]
        }),
        pulseNode = synth.oscillators[0].pulseNode;

    assert.strictEqual(
        pulseNode.pulseWidth,
        0,
        'The oscillator should preserve the configured zero width'
    );

    context.close();
});
