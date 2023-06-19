QUnit.test('Prop metrics are calculated correctly', function (assert) {
    Highcharts.sonification.Sonification.prototype.forceReady = true;

    var chart = Highcharts.chart('container', {
        sonification: {
            defaultInstrumentOptions: {
                mapping: {
                    pan: 'custom.extra2'
                }
            }
        },
        plotOptions: {
            line: {
                sonification: {
                    defaultInstrumentOptions: {
                        mapping: {
                            volume: 'custom.extra3'
                        }
                    }
                }
            }
        },
        series: [{
            type: 'line',
            sonification: {
                tracks: [{
                    mapping: {
                        pitch: {
                            mapTo: 'custom.extra1',
                            within: 'series'
                        }
                    }
                }]
            },
            data: [{
                y: 1,
                custom: {
                    extra1: 56,
                    extra2: 10,
                    extra3: 100
                }
            }, {
                y: 5,
                custom: {
                    extra1: 16,
                    extra2: 20,
                    extra3: 200
                }
            }, {
                y: 3,
                x: 5,
                custom: {
                    extra1: 97,
                    extra2: 30,
                    extra3: 300
                }
            }]
        }, {
            sonification: {
                tracks: [{
                    mapping: {
                        time: 'y'
                    }
                }]
            },
            data: [10, 50, 32]
        }, {
            data: [900, 543, 1102]
        }]
    });

    var metrics = chart.sonification.propMetrics,
        minmax = function (x) {
            return x.min + ',' + x.max;
        };

    assert.strictEqual(
        minmax(metrics.globalExtremes.x), '0,5', 'Global X'
    );
    assert.strictEqual(
        minmax(metrics.globalExtremes.y), '1,1102', 'Global Y'
    );
    assert.strictEqual(
        metrics.seriesTimeProps[0].x, true, 'Time props first series'
    );
    assert.strictEqual(
        metrics.seriesTimeProps[1].y, true, 'Time props second series'
    );
    assert.strictEqual(
        minmax(metrics.seriesExtremes[0].x), '0,5', 'First series X'
    );
    assert.strictEqual(
        minmax(metrics.seriesExtremes[2].x), '0,2', 'Last series X'
    );
    assert.strictEqual(
        minmax(metrics.seriesExtremes[0]['custom.extra1']), '16,97', 'Series custom prop'
    );
    assert.strictEqual(
        minmax(metrics.globalExtremes['custom.extra2']), '10,30', 'Chart-level custom prop'
    );
    assert.strictEqual(
        minmax(metrics.globalExtremes['custom.extra3']), '100,300', 'Plotoptions-level custom prop'
    );

    delete Highcharts.sonification.Sonification.prototype.forceReady;
});
