// Get an instrument object from a basic timeline
function getTimelineInstrumentObject(timeline) {
    return timeline.paths[0][0].events[0].options.playOptions.instruments[0];
}

// Crude function to get duration of a basic timeline
function getTimelineDuration(timeline) {
    return timeline.paths[0][0].targetDuration;
}

// Crude test to see if two instruments are the same
function isSameInstrument(a, b) {
    const freqA = a.options.allowedFrequencies;
    const freqB = b.options.allowedFrequencies;
    return (
        a.options.oscillator.waveformShape ===
            b.options.oscillator.waveformShape &&
        freqA.length === freqB.length &&
        freqA.every((val, ix) => val === freqB[ix])
    );
}

const timelinePrototype = Highcharts.sonification.Timeline.prototype;
const defaultSonificationOptions = Highcharts.getOptions().sonification;
const allInstruments = Highcharts.sonification.instruments;
let oldPlayFunc;
let actualDuration;
let instrObject;

QUnit.module(
    'Test that sonification options in chart config are translated to sonify API format',
    {
        before: function () {
            oldPlayFunc = timelinePrototype.play;
            timelinePrototype.play = function () {
                instrObject = getTimelineInstrumentObject(this);
                actualDuration = getTimelineDuration(this);
            };
        },
        after: function () {
            timelinePrototype.play = oldPlayFunc;
        }
    },
    function () {
        QUnit.test('Default options should be translated', function (assert) {
            const chart = Highcharts.chart('container', {
                series: [
                    {
                        data: [1, 2, 3, 4]
                    }
                ]
            });
            const defaultDuration = defaultSonificationOptions.duration;

            chart.sonify();

            const actualInstrument = instrObject.instrument;
            const actualInstrumentMapping = instrObject.instrumentMapping;
            const actualMinFreq = instrObject.instrumentOptions.minFrequency;
            const actualMaxFreq = instrObject.instrumentOptions.maxFrequency;
            const defaultInstrumentOptions =
                defaultSonificationOptions.defaultInstrumentOptions;
            const defaultInstrument =
                allInstruments[defaultInstrumentOptions.instrument];
            const defaultInstrumentMapping = defaultInstrumentOptions.mapping;
            const defaultMinFreq = defaultInstrumentOptions.minFrequency;
            const defaultMaxFreq = defaultInstrumentOptions.maxFrequency;

            assert.strictEqual(
                actualDuration,
                defaultDuration,
                'Duration should equal default duration'
            );
            assert.ok(
                isSameInstrument(actualInstrument, defaultInstrument),
                'Instrument used should be the default instrument'
            );
            assert.propEqual(
                actualInstrumentMapping,
                defaultInstrumentMapping,
                'Instrument mapping should be the default instrument mapping'
            );
            assert.strictEqual(
                actualMinFreq,
                defaultMinFreq,
                'Min freq should be the default min freq'
            );
            assert.strictEqual(
                actualMaxFreq,
                defaultMaxFreq,
                'Max freq should be the default max freq'
            );
        });

        QUnit.test('Chart options should be translated', function (assert) {
            const mapping = {
                frequency: 'x',
                pan: 'y',
                pointPlayTime: 'y',
                duration: 10
            };
            const chart = Highcharts.chart('container', {
                sonification: {
                    duration: 950,
                    defaultInstrumentOptions: {
                        instrument: 'triangleMajor',
                        minFrequency: 1,
                        maxFrequency: 1000,
                        mapping
                    }
                },
                series: [
                    {
                        data: [1, 2, 3, 4]
                    }
                ]
            });

            chart.sonify();

            const actualInstrument = instrObject.instrument;
            const actualInstrumentMapping = instrObject.instrumentMapping;
            const actualMinFreq = instrObject.instrumentOptions.minFrequency;
            const actualMaxFreq = instrObject.instrumentOptions.maxFrequency;

            assert.strictEqual(
                actualDuration,
                950,
                'Duration should override default duration'
            );
            assert.ok(
                isSameInstrument(
                    actualInstrument,
                    allInstruments.triangleMajor
                ),
                'Instrument used should override the default instrument'
            );
            assert.propEqual(
                actualInstrumentMapping,
                mapping,
                'Instrument mapping should override the default instrument mapping'
            );
            assert.strictEqual(
                actualMinFreq,
                1,
                'Min freq should override the default min freq'
            );
            assert.strictEqual(
                actualMaxFreq,
                1000,
                'Max freq should override the default max freq'
            );
        });

        QUnit.test(
            'Series options should be translated and override chart options',
            function (assert) {
                const seriesMapping = {
                    frequency: 'x',
                    pan: 'y',
                    pointPlayTime: 'x',
                    duration: 10
                };
                const chart = Highcharts.chart('container', {
                    sonification: {
                        duration: 950,
                        defaultInstrumentOptions: {
                            instrument: 'squareMajor',
                            minFrequency: 1,
                            maxFrequency: 1000,
                            mapping: {
                                frequency: 440,
                                pan: 'x',
                                pointPlayTime: 'y',
                                duration: 90
                            }
                        }
                    },
                    series: [
                        {
                            data: [1, 2, 3, 4],
                            sonification: {
                                duration: 1200,
                                instruments: [
                                    {
                                        minFrequency: 200,
                                        maxFrequency: 2000,
                                        mapping: seriesMapping
                                    }
                                ]
                            }
                        }
                    ]
                });

                chart.sonify();

                const actualInstrument = instrObject.instrument;
                const actualInstrumentMapping = instrObject.instrumentMapping;
                const actualMinFreq =
                    instrObject.instrumentOptions.minFrequency;
                const actualMaxFreq =
                    instrObject.instrumentOptions.maxFrequency;

                assert.strictEqual(
                    actualDuration,
                    950,
                    'Duration should not override chart-wide duration with chart.sonify()'
                );
                assert.ok(
                    isSameInstrument(
                        actualInstrument,
                        allInstruments.squareMajor
                    ),
                    'Series should inherit chart instrument'
                );
                assert.propEqual(
                    actualInstrumentMapping,
                    seriesMapping,
                    'Series should override chart instrument mapping'
                );
                assert.strictEqual(
                    actualMinFreq,
                    200,
                    'Series should override min freq'
                );
                assert.strictEqual(
                    actualMaxFreq,
                    2000,
                    'Series should override max freq'
                );
            }
        );
    }
);
