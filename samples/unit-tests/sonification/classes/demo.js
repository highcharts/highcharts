QUnit.test('Sonification classes are exposed', function (assert) {
    assert.ok(Highcharts.sonification.Sonification.prototype);
    assert.ok(Highcharts.sonification.SonificationInstrument.prototype);
    assert.ok(Highcharts.sonification.SonificationSpeaker.prototype);
    assert.ok(Highcharts.sonification.SonificationTimeline.prototype);
    assert.ok(Highcharts.sonification.SynthPatch.prototype);
    assert.ok(Highcharts.sonification.InstrumentPresets);
});

QUnit.test('Filters accept zero frequency pitch tracking', function (assert) {
    const context = new AudioContext(),
        synth = new Highcharts.sonification.SynthPatch(context, {
            oscillators: [{
                type: 'sine',
                lowpass: {
                    frequency: 1000,
                    frequencyPitchTrackingMultiplier: 0
                }
            }]
        }),
        frequencyParam = synth.oscillators[0].lowpassNode.frequency,
        originalSetTargetAtTime = frequencyParam.setTargetAtTime;
    let scheduledFrequency;

    frequencyParam.setTargetAtTime = function (value) {
        scheduledFrequency = value;
        return originalSetTargetAtTime.apply(this, arguments);
    };
    synth.playFreqAtTime(0, 1000);

    assert.ok(
        scheduledFrequency < 1000,
        'The filter should apply the configured zero tracking multiplier'
    );

    context.close();
});
