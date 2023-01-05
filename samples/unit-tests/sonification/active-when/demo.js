QUnit.test('ActiveWhen - Zones', function (assert) {
    Highcharts.sonification.Sonification.prototype.forceReady = true;

    var chart = Highcharts.chart('container', {
        sonification: {
            duration: 7800,
            pointGrouping: {
                enabled: false
            },
            defaultInstrumentOptions: {
                mapping: {
                    pitch: 24
                }
            },
            globalTracks: [{
                activeWhen: function (e) {
                    return e.point.y > 10 && e.time < 5300;
                },
                mapping: {
                    pitch: 28
                }
            }]
        },
        series: [{
            sonification: {
                tracks: [{
                    // Normal track
                }, {
                    activeWhen: {
                        min: 0,
                        max: 5,
                        prop: 'y'
                    },
                    mapping: {
                        pitch: 48
                    }
                }, {
                    activeWhen: {
                        min: 5,
                        max: 10,
                        prop: 'y'
                    },
                    mapping: {
                        pitch: 52
                    }
                }, {
                    activeWhen: {
                        min: 8,
                        max: 15,
                        prop: 'y'
                    },
                    mapping: {
                        pitch: 52
                    }
                }, {
                    activeWhen: {
                        crossingUp: 10,
                        prop: 'y'
                    },
                    mapping: {
                        pitch: 60
                    }
                }, {
                    activeWhen: {
                        crossingDown: 10,
                        prop: 'y'
                    },
                    mapping: {
                        pitch: 36
                    }
                }, {
                    activeWhen: {
                        crossingUp: 3,
                        prop: 'x'
                    },
                    mapping: {
                        pitch: 64
                    }
                }]
            },
            data: [
                -1, -2, -4, -1, 0, 1, 4, 3, 5, 6, 5, 7,
                8, 10, 9, 10, 11, 12, 9, 8, 5, 3, 1, 1, 1
            ]
        }]
    });

    assert.strictEqual(
        chart.sonification.timeline.channels
            .map(c => c.events.map(e => e.time).join(',')).join('#'),
        [
            // First track is always active
            '0,312.5,625,937.5,1250,1562.5,1875,2187.5,2500,2812.5,3125,3437.5,3750,4062.5,4375,4687.5,5000,5312.5,5625,5937.5,6250,6562.5,6875,7187.5,7500',
            // active on Y val between 0 - 5 (inclusive)
            '1250,1562.5,1875,2187.5,2500,3125,6250,6562.5,6875,7187.5,7500',
            // active on Y val between 5 - 10 (inclusive)
            '2500,2812.5,3125,3437.5,3750,4062.5,4375,4687.5,5625,5937.5,6250',
            // Y between 8 - 15
            '3750,4062.5,4375,4687.5,5000,5312.5,5625,5937.5',
            // Crossing up over 10 (or reaching 10)
            '4062.5,4687.5',
            // Crossing down under 10 from above (not if only 10 reached)
            '5625',
            // Crossing X val of 3
            '937.5',
            // Y is more than 10 (not just 10) and time < 5300
            '5000'
        ].join('#'),
        'Channels are active when expected.'
    );

    delete Highcharts.sonification.Sonification.prototype.forceReady;
});
