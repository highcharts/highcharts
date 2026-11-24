QUnit.test('Sonification classes are exposed', function (assert) {
    assert.ok(Highcharts.sonification.Sonification.prototype);
    assert.ok(Highcharts.sonification.SonificationInstrument.prototype);
    assert.ok(Highcharts.sonification.SonificationSpeaker.prototype);
    assert.ok(Highcharts.sonification.SonificationTimeline.prototype);
    assert.ok(Highcharts.sonification.SynthPatch.prototype);
    assert.ok(Highcharts.sonification.InstrumentPresets);
});

QUnit.test('Destroying a chart while audio is resuming', async function (
    assert
) {
    const chart = Highcharts.chart('container', {});
    const sonification = chart.sonification;
    const context = sonification.audioContext;
    await context.suspend();

    let rejectResume;
    const resuming = new Promise(resolve => {
        context.resume = () => new Promise((_, reject) => {
            rejectResume = reject;
            resolve();
        });
    });
    sonification.update();
    await resuming;
    chart.destroy();
    rejectResume(new DOMException('Context closed', 'InvalidStateError'));

    // Give the browser a turn to report an unhandled rejection to QUnit.
    await new Promise(resolve => setTimeout(resolve, 0));
    assert.strictEqual(
        sonification.audioContext, undefined,
        'The destroyed chart released its audio context'
    );
});
