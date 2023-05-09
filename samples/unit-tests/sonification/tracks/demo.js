QUnit.test('Tracks', function (assert) {
    Highcharts.sonification.Sonification.prototype.forceReady = true;

    var chart = Highcharts.chart('container', {
        sonification: {
            duration: 7000,
            afterSeriesWait: 1500,
            order: 'sequential',
            pointGrouping: {
                enabled: false
            },
            defaultInstrumentOptions: {
                instrument: 'piano',
                mapping: {
                    pitch: 24
                }
            },
            globalTracks: [{
                instrument: 'vibraphone',
                mapping: {
                    pitch: [48, 56],
                    gapBetweenNotes: 60
                }
            }, {
                type: 'speech',
                mapping: {
                    text: '{point.y}'
                }
            }]
        },
        plotOptions: {
            pie: {
                sonification: {
                    defaultInstrumentOptions: {
                        instrument: 'flute'
                    },
                    tracks: [{
                        mapping: {
                            pitch: 30
                        }
                    }]
                }
            }
        },

        series: [{
            sonification: {
                tracks: [{
                    mapping: {
                        volume: {
                            mapTo: 'y',
                            min: 0,
                            max: 1,
                            within: 'series'
                        }
                    }
                }, {
                    mapping: {
                        pitch: {
                            mapTo: 'x',
                            min: 12,
                            max: 16
                        }
                    }
                }]
            },
            data: [10, 20, 30]
        }, {
            type: 'pie',
            sonification: {
                defaultInstrumentOptions: {
                    mapping: {
                        tremolo: {
                            depth: 1,
                            speed: 1
                        }
                    }
                }
            },
            data: [1, 2, 3]
        }]
    });

    var channels = chart.sonification.timeline.channels,
        numChannels = 7;

    assert.strictEqual(
        channels.length, numChannels,
        'Should have ' + numChannels + ' channels, one for each track.'
    );

    assert.strictEqual(
        channels.map(c => [
            c.events[0].relatedPoint.series.index,
            c.type,
            c.events[0].time
        ].join(',')).join('#'),
        [
            '0,instrument,0',
            '0,instrument,0',
            '0,instrument,0',
            '0,speech,0',
            '1,instrument,4100',
            '1,instrument,4100',
            '1,speech,4100'
        ].join('#'),
        'Tracks are correctly timed, assigned to correct series, and of correct type'
    );

    function getChannelEventInfo(channelIx, optionProp) {
        var events = channels[channelIx].events;
        return events[0].instrumentEventOptions[optionProp] + ',' +
            events[events.length - 1].instrumentEventOptions[optionProp];
    }

    assert.strictEqual(
        getChannelEventInfo(0, 'volume'), '0,1',
        'First channel has volume mapping'
    );
    assert.strictEqual(
        getChannelEventInfo(0, 'tremoloDepth'), 'undefined,undefined',
        'First channel does not have tremolo mapping'
    );
    assert.strictEqual(
        getChannelEventInfo(1, 'note'), '12,16',
        'Second channel has pitch mapping'
    );
    assert.ok(
        getChannelEventInfo(2, 'note') === getChannelEventInfo(5, 'note') &&
        getChannelEventInfo(5, 'note') === '48,56',
        '3rd and 6th channel pitch matches global track options'
    );
    assert.strictEqual(
        getChannelEventInfo(4, 'note'), '30,30',
        '5th channel pitch matches pie series track options'
    );

    // Check expected instrument types for each channel
    [
        'piano',
        'piano',
        'vibraphone',
        null,
        'flute',
        'vibraphone',
        null
    ].forEach(function (instrument, ix) {
        if (instrument) {
            assert.deepEqual(
                channels[ix].engine.synthPatch.options,
                Highcharts.sonification.InstrumentPresets[instrument],
                'Channel ' + (ix + 1) + ' is ' + instrument
            );
        }
    });


    chart.update({
        sonification: {
            order: 'simultaneous'
        }
    });

    assert.strictEqual(
        chart.sonification.timeline.channels.map(c => c.events[0].time).join(','),
        '0,0,0,0,0,0,0',
        'All channels start immediately when order is simultaneous'
    );

    delete Highcharts.sonification.Sonification.prototype.forceReady;
});
