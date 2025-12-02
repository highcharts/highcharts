QUnit.test(
    'Hiding flags when the distance between them and its anchors is exceeded.',
    function (assert) {
        const chart = Highcharts.stockChart('container', {
            chart: {
                width: 600
            },
            series: [{
                data: [{
                    x: 0,
                    y: 1
                }, {
                    x: 11,
                    y: 2
                }]
            }, {
                type: 'flags',
                data: (function (n) {
                    var d = [],
                        i = 0;
                    while (i++ < n + 1) {
                        d.push({
                            x: 350 + i - 1,
                            title: 'Flag ' + i
                        });
                    }
                    return d;
                }(11))
            }]
        });

        const hiddenCount = chart.series[1].points.reduce(
            (x, p) => (p.graphic?.attr('visibility') === 'hidden' ? x + 1 : x),
            0
        );

        assert.ok(
            hiddenCount < chart.series[1].points.length,
            'Flags are hidden when distances between them and their anchors ' +
                'are exceeded.'
        );
    }
);
