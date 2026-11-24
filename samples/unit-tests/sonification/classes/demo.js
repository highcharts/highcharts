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
    const originalContext = window.AudioContext;
    let chart, startResume, rejectResume;
    const resuming = new Promise(resolve => {
        startResume = resolve;
    });
    const pending = new Promise((_, reject) => {
        rejectResume = reject;
    });
    try {
        window.AudioContext = function () {
            this.destination = {};
            this.state = 'suspended';
            this.suspend = () => Promise.resolve();
            this.resume = () => {
                startResume();
                return pending;
            };
            this.close = () => {
                rejectResume(new DOMException(
                    'Context closed', 'InvalidStateError'
                ));
                return Promise.resolve();
            };
        };
        chart = Highcharts.chart('container', {});
    } finally {
        if (originalContext) {
            window.AudioContext = originalContext;
        } else {
            delete window.AudioContext;
        }
    }
    const sonification = chart.sonification;
    await resuming;
    chart.destroy();

    // Give the browser a turn to report an unhandled rejection to QUnit.
    await new Promise(resolve => setTimeout(resolve, 0));
    assert.strictEqual(
        sonification.audioContext, undefined,
        'The destroyed chart released its audio context'
    );
});
