QUnit.test('Map within', function (assert) {
    Highcharts.sonification.Sonification.prototype.forceReady = true;

    var chart = Highcharts.chart('container', {
        sonification: {
            defaultInstrumentOptions: {
                mapping: {
                    pitch: {
                        min: 0,
                        max: 100
                    }
                }
            }
        },
        yAxis: [{}, {}],
        series: [{
            data: [100, 300]
        }, {
            data: [10, 30]
        }, {
            data: [1, 3],
            yAxis: 1
        }]
    });

    var notes = function (channelIx) {
            var events = chart.sonification.timeline
                .channels[channelIx].events;
            return events[0].instrumentEventOptions.note + ',' +
                events[1].instrumentEventOptions.note;
        },
        setWithin = function (within) {
            chart.update({
                sonification: {
                    defaultInstrumentOptions: {
                        mapping: {
                            pitch: {
                                within: within
                            }
                        }
                    }
                }
            });
        };

    assert.strictEqual(notes(0), '31,100', 'Series 1 is high-high pitch');
    assert.strictEqual(notes(1), '0,7', 'Series 2 is low-low pitch');
    assert.strictEqual(notes(2), '0,100', 'Series 3 is low-high pitch');

    setWithin('chart');

    assert.strictEqual(notes(0), '33,100', 'Series 1 is high-high pitch');
    assert.strictEqual(notes(1), '3,10', 'Series 2 is low-low pitch');
    assert.strictEqual(notes(2), '0,1', 'Series 3 is low-low pitch');

    setWithin('series');

    assert.ok(
        notes(0) === notes(1) && notes(0) === notes(2) && notes(0) === '0,100',
        'All series are low-high'
    );

    delete Highcharts.sonification.Sonification.prototype.forceReady;
});
