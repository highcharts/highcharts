QUnit.test('Prop metrics are calculated correctly', function (assert) {
    Highcharts.sonification.Sonification.prototype.forceReady = true;

    var chart = Highcharts.chart('container', {
        series: [{
            sonification: {
                tracks: [{
                    mapping: {
                        pitch: {
                            mapTo: 'custom.extra',
                            within: 'series'
                        }
                    }
                }]
            },
            data: [{
                y: 1,
                custom: {
                    extra: 56
                }
            }, {
                y: 5,
                custom: {
                    extra: 16
                }
            }, {
                y: 3,
                x: 5,
                custom: {
                    extra: 97
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

    var metrics = chart.sonification.propMetrics;
    assert.strictEqual(metrics.globalExtremes.x.min, 0, 'Global X min');
    assert.strictEqual(metrics.globalExtremes.x.max, 5, 'Global X max');
    assert.strictEqual(metrics.globalExtremes.y.min, 1, 'Global Y min');
    assert.strictEqual(metrics.globalExtremes.y.max, 1102, 'Global Y max');
    assert.strictEqual(metrics.seriesTimeProps[0].x, true, 'Time props first series');
    assert.strictEqual(metrics.seriesTimeProps[1].y, true, 'Time props second series');
    assert.strictEqual(metrics.seriesExtremes[0].x.min, 0, 'First series X min');
    assert.strictEqual(metrics.seriesExtremes[0].x.max, 5, 'First series X max');
    assert.strictEqual(metrics.seriesExtremes[2].x.min, 0, 'Last series X min');
    assert.strictEqual(metrics.seriesExtremes[2].x.max, 2, 'Last series X max');
    assert.strictEqual(metrics.seriesExtremes[0]['custom.extra'].min, 16, 'Series custom prop min');
    assert.strictEqual(metrics.seriesExtremes[0]['custom.extra'].max, 97, 'Series custom prop max');

    delete Highcharts.sonification.Sonification.prototype.forceReady;
});
