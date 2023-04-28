QUnit.module('Mapping tests', hooks => {
    var chart;

    hooks.before(() => {
        Highcharts.sonification.Sonification.prototype.forceReady = true;
        chart = Highcharts.chart('container', {
            sonification: {
                duration: 3000,
                pointGrouping: {
                    enabled: false
                },
                defaultInstrumentOptions: {
                    instrument: 'flute',
                    mapping: {
                        time: 'x',
                        pan: '-x',
                        volume: {
                            min: 0.5,
                            max: 1,
                            mapTo: '-y'
                        },
                        pitch: {
                            min: 'c4',
                            max: 'c5'
                        },
                        playDelay: 10,
                        noteDuration: {
                            min: 100,
                            max: 200,
                            mapTo: 'x'
                        },
                        tremolo: {
                            depth: 'y',
                            speed: 0.9
                        },
                        highpass: {
                            frequency: function (e) {
                                return (
                                    e.time / 200 + e.point.x + e.point.y
                                ) * 10;
                            },
                            resonance: 'x'
                        },
                        lowpass: {
                            frequency: {
                                mapTo: 'custom.lowpass.freq',
                                min: 2000,
                                max: 7000
                            },
                            resonance: 'custom.lowpass.res'
                        }
                    }
                },
                defaultSpeechOptions: {
                    mapping: {
                        time: 'x',
                        text: 'Msg: {point.options.custom.message.payload}',
                        playDelay: 'x',
                        rate: 2,
                        pitch: 'y',
                        volume: 0.4
                    }
                }
            },
            series: [{
                type: 'pie',
                sonification: {
                    tracks: [{}, {
                        type: 'speech'
                    }]
                },
                data: [{
                    y: 1,
                    custom: {
                        lowpass: {
                            freq: 1,
                            res: 2
                        },
                        message: {
                            payload: 'custom1'
                        },
                        log: 0
                    }
                }, {
                    y: 5,
                    custom: {
                        lowpass: {
                            freq: 2,
                            res: 2
                        },
                        message: {
                            payload: 'custom2'
                        },
                        log: 10
                    }
                }, {
                    y: 3,
                    custom: {
                        lowpass: {
                            freq: 3,
                            res: 3
                        },
                        message: {
                            payload: 'custom3'
                        },
                        log: 100
                    }
                }]
            }]
        });
    });
    hooks.after(() => delete Highcharts.sonification
        .Sonification.prototype.forceReady);


    QUnit.test('Basic mappings', function (assert) {
        var channels = chart.sonification.timeline.channels;
        assert.strictEqual(channels.length, 2, 'Has two channels, one for each track');
        assert.strictEqual(channels[0].type, 'instrument', 'First track is instrument');
        assert.strictEqual(channels[1].type, 'speech', 'Second track is speech');

        function assertInstrumentEvent(event, expectedTime, expectedProps) {
            assert.strictEqual(event.time, expectedTime, 'Instrument event has expected time');
            assert.propEqual(event.instrumentEventOptions, expectedProps, 'Instrument event has expected props');
        }

        function assertSpeechEvent(event, expectedTime, text, expectedProps) {
            assert.strictEqual(event.time, expectedTime, 'Speech event has expected time');
            assert.strictEqual(event.message, text, 'Speech event has expected text');
            assert.propEqual(event.speechOptions, expectedProps, 'Speech event has expected props');
        }

        assertInstrumentEvent(channels[0].events[0], 10, {
            noteDuration: 100,
            pan: 1,
            volume: 1,
            lowpassFreq: 2000,
            lowpassResonance: -6,
            highpassFreq: 10,
            highpassResonance: -6,
            tremoloDepth: 0,
            tremoloSpeed: 0.9,
            note: 48
        });

        assertInstrumentEvent(channels[0].events[1], 1360, {
            noteDuration: 150,
            pan: 0,
            volume: 0.5,
            lowpassFreq: 4500,
            lowpassResonance: -6,
            highpassFreq: 127.5,
            highpassResonance: 3,
            tremoloDepth: 0.8,
            tremoloSpeed: 0.9,
            note: 60
        });

        assertInstrumentEvent(channels[0].events[2], 2710, {
            noteDuration: 200,
            pan: -1,
            volume: 0.75,
            lowpassFreq: 7000,
            lowpassResonance: 12,
            highpassFreq: 185,
            highpassResonance: 12,
            tremoloDepth: 0.4,
            tremoloSpeed: 0.9,
            note: 54
        });

        assertSpeechEvent(channels[1].events[0], 0, 'Msg: custom1', {
            pitch: 0.3,
            rate: 2,
            volume: 0.4
        });

        assertSpeechEvent(channels[1].events[1], 1450, 'Msg: custom2', {
            pitch: 2,
            rate: 2,
            volume: 0.4
        });

        assertSpeechEvent(channels[1].events[2], 2900, 'Msg: custom3', {
            pitch: 1.15,
            rate: 2,
            volume: 0.4
        });
    });


    QUnit.test('Mapping functions', function (assert) {
        chart.update({
            sonification: {
                defaultInstrumentOptions: {
                    mapping: {
                        time: {
                            mapFunction: 'logarithmic',
                            mapTo: 'custom.log',
                            min: 50,
                            max: 250
                        },
                        playDelay: 0
                    }
                }
            }
        });

        var sonification = chart.sonification;

        assert.strictEqual(
            sonification.timeline.channels[0].events
                .map(e => e.time).join(','),
            '50,150,250',
            'Logarithmic times are correct'
        );

        chart.addSeries({
            type: 'spline',
            sonification: {
                tracks: [{
                    mapping: {
                        pan: {
                            mapTo: 'y',
                            within: 'series',
                            mapFunction: 'logarithmic',
                            min: 0,
                            max: 100
                        }
                    }
                }]
            },
            data: [0.01, 0.1, 1, 10, 100]
        });

        assert.strictEqual(
            sonification.timeline.channels[2].events
                .map(e => e.instrumentEventOptions.pan).join(','),
            '0,25,50,75,100',
            'Non-negative logarithmic mapping works as expected'
        );

        chart.series[1].setData([
            -10000, -1000, -100, -10, -1, -0.1, 0,
            0.1, 1, 10, 100, 1000, 10000
        ]);

        assert.strictEqual(
            sonification.timeline.channels[2].events
                .map(e => Math.round(e.instrumentEventOptions.pan * 1000) / 1000).join(','),
            '0,12.5,25,37.5,46.516,49.532,50,50.468,53.484,62.5,75,87.5,100',
            'Negative and 0 logarithmic mapping works as expected'
        );
    });
});
