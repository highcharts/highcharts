QUnit.test('Hiding flags when the distance between them and its anchors is exceeded.', function (assert) {
    var chart = Highcharts.chart('container', {
        series: [{
            data: [{
                x: 0,
                y: 1
            }, {
                x: 11,
                y: 2
            }],
            id: 's1'
        }, {
            type: 'flags',
            onSeries: 's1',
            data: (function (n) {
                var d = [],
                    i = 0;
                while (i++ < n + 1) {
                    d.push({
                        x: 87 + i - 1,
                        title: "Flag " + i
                    });
                }
                return d;
            }(11))
        }]
    });

    var flagSVG = chart.series[1].points[10].graphic;

    assert.strictEqual(
        flagSVG.x === -9999,
        true,
        'Flags are hidden when distances between them and their anchors are exceeded.'
    );
});
