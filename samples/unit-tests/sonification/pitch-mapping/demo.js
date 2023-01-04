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
