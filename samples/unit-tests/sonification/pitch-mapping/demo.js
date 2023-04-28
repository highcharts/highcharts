QUnit.test('Pitch and note mapping', function (assert) {
    Highcharts.sonification.Sonification.prototype.forceReady = true;

    var chart = Highcharts.chart('container', {
        sonification: {
            duration: 4300,
            pointGrouping: {
                enabled: false
            },
            defaultInstrumentOptions: {
                mapping: {
                    pitch: {
                        min: 10,
                        max: 'e8', // Note #100
                        mapTo: '-y'
                    }
                }
            }
        },
        series: [{
            data: [10, 20]
        }]
    });

    var notes = function (prop) {
            var events = chart.sonification.timeline
                .channels[0].events;
            return events.map(
                e => e.instrumentEventOptions[prop || 'note']
            ).join(',');
        },
        updateMapping = function (mapping) {
            chart.series[0].update({
                sonification: {
                    tracks: [{
                        mapping: mapping
                    }]
                }
            });
        };

    assert.strictEqual(notes(), '100,10', 'Inverted pitch mapping');

    updateMapping({
        pitch: 'C5'
    });

    assert.strictEqual(notes(), '60,60', 'Fixed pitch mapping');

    updateMapping({
        frequency: 440
    });

    assert.strictEqual(notes(), '100,10', 'Note mapping remains after setting frequency');
    assert.strictEqual(notes('frequency'), '440,440', 'Fixed frequency mapping');

    updateMapping({
        pitch: [60, 'C6', 'e4', 96],
        gapBetweenNotes: {
            min: 100,
            max: 200,
            mapTo: '-x'
        }
    });

    assert.strictEqual(notes(), '60,72,52,96,60,72,52,96', 'Multiple note mapping');
    assert.strictEqual(
        chart.sonification.timeline
            .channels[0].events.map(e => e.time)
            .join(','),
        '0,200,400,600,4000,4100,4200,4300',
        'Timing of events with note gap'
    );

    chart.update({
        sonification: {
            defaultInstrumentOptions: {
                roundToMusicalNotes: false
            }
        }
    });

    updateMapping({
        pitch: {
            min: 0,
            max: 10,
            mapTo: 'y'
        },
        frequency: {
            min: 1000,
            max: 2000,
            mapTo: 'y'
        }
    });

    chart.series[0].setData([0, 5.5435, 10]);

    assert.strictEqual(notes(), '0,5.5435,10', 'Rounding to musical notes off (pitch)');
    assert.strictEqual(notes('frequency'), '1000,1554.35,2000', 'Rounding to musical notes off (freq)');

    delete Highcharts.sonification.Sonification.prototype.forceReady;
});


QUnit.test('Map to musical scales', function (assert) {
    Highcharts.sonification.Sonification.prototype.forceReady = true;

    var chart = Highcharts.chart('container', {
        sonification: {
            duration: 3300,
            pointGrouping: {
                enabled: false
            },
            defaultInstrumentOptions: {
                mapping: {
                    pitch: {
                        min: 11,
                        max: 'c8', // Note #96
                        mapTo: 'y',
                        scale: [0]
                    }
                }
            }
        },
        series: [{
            data: [1, 2, 3, 4, 5, 6, 7, 8]
        }]
    });

    function getNotes(chart) {
        return chart.sonification.timeline.channels[0].events
            .map(e => e.instrumentEventOptions.note).toString();
    }

    assert.strictEqual(
        getNotes(chart),
        '12,24,36,48,60,72,84,96',
        'Notes follow the octaves, within min/max'
    );

    chart.series[0].setData([
        1, 2, 3, 4, 5, 6, 7, 8, 9
    ]);

    assert.strictEqual(
        getNotes(chart),
        '12,24,36,48,60,60,72,84,96',
        'More notes than scale points, some notes are the same.'
    );

    chart.series[0].setData([
        1, 2, 3
    ]);

    assert.strictEqual(
        getNotes(chart),
        '12,60,96',
        'Less notes than scale points, some octaves are skipped.'
    );

    chart.update({
        sonification: {
            defaultInstrumentOptions: {
                mapping: {
                    pitch: {
                        min: 'c2',
                        max: 'c4',
                        mapTo: 'y',
                        scale: [0, 2, 4, 5, 7, 9, 11] // Major scale
                    }
                }
            }
        },
        series: [{
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
        }]
    });

    assert.strictEqual(
        getNotes(chart),
        '24,26,28,29,31,33,35,36,38,40,41,43,45,47,48',
        'Two full C-major octaves played'
    );

    chart.update({
        sonification: {
            defaultInstrumentOptions: {
                mapping: {
                    pitch: {
                        min: 'c#3',
                        max: 'c#5',
                        scale: [1, 3, 4, 6, 8, 9, 11] // C# minor scale
                    }
                }
            }
        }
    });

    assert.strictEqual(
        getNotes(chart),
        '37,39,40,42,44,45,47,49,51,52,54,56,57,59,61',
        'Two full C#-minor octaves played'
    );

    chart.update({
        sonification: {
            defaultInstrumentOptions: {
                mapping: {
                    pitch: {
                        mapTo: '-y'
                    }
                }
            }
        }
    });

    assert.strictEqual(
        getNotes(chart),
        '61,59,57,56,54,52,51,49,47,45,44,42,40,39,37',
        'Two full C#-minor octaves played in reverse'
    );

    chart.update({
        sonification: {
            defaultInstrumentOptions: {
                mapping: {
                    pitch: {
                        mapTo: 'y',
                        min: 'c3',
                        max: 'c6',
                        scale: [0, 4, 2, 4, 2, 5, 7]
                    }
                }
            }
        },
        series: [{
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
                12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
        }]
    });

    assert.strictEqual(
        getNotes(chart),
        '36,40,38,40,38,41,43,48,52,50,52,50,53,55,60,64,62,64,62,65,67,72',
        'Scale goes up and down within octaves, but octaves increase.'
    );

    chart.update({
        sonification: {
            defaultInstrumentOptions: {
                mapping: {
                    pitch: {
                        mapTo: 'y',
                        min: 'c3',
                        max: 'c6',
                        scale: [-12, 0, 5, 7, 12, 24]
                    }
                }
            }
        },
        series: [{
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        }]
    });

    assert.strictEqual(
        getNotes(chart),
        '36,43,48,36,48,55,60,48,60,67,72,72',
        'Scale should be able to go beyond one octave without crashing.'
    );

    chart.update({
        sonification: {
            defaultInstrumentOptions: {
                roundToMusicalNotes: false,
                mapping: {
                    pitch: {
                        mapTo: 'y',
                        min: 'c4',
                        max: 'c#6',
                        scale: [0.3, 1.8, 4.2, 5.1, 6.75, 9.22, 11.1]
                    }
                }
            }
        },
        series: [{
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
        }]
    });

    assert.strictEqual(
        getNotes(chart),
        '48.3,49.8,52.2,53.1,54.75,57.22,59.1,60.3,61.8,64.2,65.1,66.75,69.22,71.1,72.3',
        'Detuned piano.'
    );

    delete Highcharts.sonification.Sonification.prototype.forceReady;
});
