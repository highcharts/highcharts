QUnit.test('Point grouping', function (assert) {
    Highcharts.sonification.Sonification.prototype.forceReady = true;

    var chart = Highcharts.chart('container', {
        sonification: {
            duration: 4000,
            pointGrouping: {
                groupTimespan: 10,
                algorithm: 'first'
            }
        },
        plotOptions: {
            arearange: {
                sonification: {
                    defaultInstrumentOptions: {
                        pointGrouping: {
                            prop: 'high'
                        },
                        mapping: {
                            time: function (e) {
                                return e.point.options.custom.time;
                            },
                            pitch: {
                                mapTo: 'high',
                                min: 10,
                                max: 30,
                                within: 'series'
                            }
                        }
                    }
                }
            }
        },
        series: [{
            type: 'arearange',
            keys: ['low', 'high', 'custom.time'],
            data: [
                [10, 20, 0],
                [19, 23, 3],
                [20, 25, 4],
                [14, 30, 5],
                [15, 29, 7],
                [15, 27, 10],
                [16, 26, 15],
                [17, 24, 17],
                [17, 23, 18],
                [20, 21, 20],
                [10, 13, 35],
                [5, 16, 37],
                [4, 10, 39],
                [5, 11, 40],
                [7, 13, 50],
                [9, 19, 60]
            ]
        }]
    });

    // Get the time, point index, and note number for all events
    var eventInfo = function () {
        return chart.sonification.timeline.channels[0].events.map(
            e => [
                e.time, e.relatedPoint.index, e.instrumentEventOptions.note
            ].join(',')
        ).join('#');
    };

    assert.strictEqual(eventInfo(), [
        '5,0,20', // First point. NB: Note number === point.high
        '15,6,26',
        '35,10,13',
        '55,14,13'
    ].join('#'),
    'Events have correct times and using the correct point with "first" alg');

    chart.series[0].update({
        sonification: {
            defaultInstrumentOptions: {
                mapping: {
                    pitch: {
                        mapTo: 'low',
                        min: 4,
                        max: 20
                    }
                },
                pointGrouping: {
                    prop: 'low',
                    algorithm: 'minmax'
                }
            }
        }
    });

    assert.strictEqual(eventInfo(), [
        '2.5,0,10', // group 1 (0-10). Note number is now point.low
        '7.5,2,20',
        '12.5,6,16', // group 2 (10-20)
        '17.5,9,20',
        '32.5,10,10', // group 3 (30-40)
        '37.5,12,4',
        '52.5,14,7', // group 4 (50-60)
        '57.5,15,9'
    ].join('#'),
    'Events have correct times and points with "minmax" algorithm');

    chart.series[0].update({
        sonification: {
            defaultInstrumentOptions: {
                pointGrouping: {
                    algorithm: 'firstlast',
                    groupTimespan: 5
                }
            }
        }
    });

    assert.strictEqual(eventInfo(), [
        '1.25,0,10', // Group 1 (0-5)
        '3.75,3,14',
        '6.25,4,15', // Group 2 (5-10)
        '8.75,5,15',
        '16.25,6,16', // Group 3 (15-20)
        '18.75,9,20',
        '36.25,10,10', // Group 4 (35-40)
        '38.75,13,5',
        '52.5,14,7', // Group 5 (50-55)
        '62.5,15,9' // Group 6 (60-65)
    ].join('#'),
    'Events have correct times and points with "firstlast" algorithm');

    delete Highcharts.sonification.Sonification.prototype.forceReady;
});
