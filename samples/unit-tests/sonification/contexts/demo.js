QUnit.test('Contexts', function (assert) {
    Highcharts.sonification.Sonification.prototype.forceReady = true;

    var chart = Highcharts.chart('container', {
        sonification: {
            duration: 6300,
            pointGrouping: {
                enabled: false
            },
            defaultInstrumentOptions: {
                mapping: {
                    pitch: 24
                }
            },
            globalContextTracks: [{
                valueInterval: 0.5,
                mapping: {
                    pitch: 90
                }
            }, {
                timeInterval: 300,
                mapping: {
                    pitch: 94
                }
            }]
        },
        plotOptions: {
            area: {
                sonification: {
                    contextTracks: [{
                        valueInterval: 1,
                        valueProp: 'x',
                        mapping: {
                            pitch: {
                                mapTo: 'value',
                                min: 40,
                                max: 60
                            }
                        }
                    }]
                }
            }
        },
        series: [{
            data: [10, 20, 30],
            sonification: {
                defaultInstrumentOptions: {
                    mapping: {
                        pitch: 48
                    }
                },
                contextTracks: [{
                    timeInterval: 300,
                    valueProp: 'x',
                    activeWhen: {
                        min: 1,
                        max: 2
                    },
                    mapping: {
                        pitch: {
                            mapTo: 'y',
                            value: 20,
                            min: 50,
                            max: 70
                        }
                    }
                }, {
                    type: 'speech',
                    valueInterval: 1,
                    activeWhen: {
                        max: 1
                    },
                    mapping: {
                        text: 'speak{value}'
                    }
                }]
            }
        }, {
            type: 'area',
            data: [30, 20, 10]
        }]
    });

    function getChannelsString(timeline) {
        return timeline.channels.map(c => c.events
            .map(e => e.time + ':' + (
                e.message ? e.message : e.instrumentEventOptions.note
            )).join(',')).join('#');
    }

    // Common to both tests
    var expectedBaseChannels = [
        // Series 1 sonification
        '0:48,1325:48,2650:48',
        // Series 1, 1st context track
        '1500:60,1800:60,2100:60,2400:60',
        // Series 1, 2nd context track - speech
        '0:speak0,1325:speak1',
        // Global context track 1
        '0:90,662.5:90,1325:90,1987.5:90,2650:90',
        // Global context track 2
        '0:94,300:94,600:94,900:94,1200:94,1500:94,1800:94,2100:94,2400:94'
    ];

    assert.strictEqual(
        getChannelsString(chart.sonification.timeline),
        expectedBaseChannels.concat([
            // Series 2 sonification
            '3350:24,4675:24,6000:24',
            // Series 2, context track from plotOptions
            '3350:40,4675:50,6000:60',
            // Global context track 1
            '3350:90,4012.5:90,4675:90,5337.5:90,6000:90',
            // Global context track 2
            '3350:94,3650:94,3950:94,4250:94,4550:94,4850:94,5150:94,5450:94,5750:94'
        ]).join('#'),
        'Times and notes for all channels are as expected'
    );

    chart.update({
        sonification: {
            order: 'simultaneous',
            duration: 2950
        }
    });

    assert.strictEqual(
        getChannelsString(chart.sonification.timeline),
        expectedBaseChannels.concat([
            // Series 2 sonification
            '0:24,1325:24,2650:24',
            // Series 2, context track from plotOptions
            '0:40,1325:50,2650:60'
        ]).join('#'),
        'Times and notes for all channels are as expected'
    );

    delete Highcharts.sonification.Sonification.prototype.forceReady;
});
