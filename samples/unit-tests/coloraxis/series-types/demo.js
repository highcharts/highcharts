QUnit.module('Color axis for series types', function () {
    Object.keys(Highcharts.Series.types)
        .sort()
        .forEach(function (type) {
            if (
                !('linkedTo' in Highcharts.defaultOptions.plotOptions[type]) &&
                ![
                    'gauge',
                    'solidgauge',
                    'map', // Needs a map for coordinates
                    'mapline', // Needs a map for coordinates
                    'mapbubble', // Needs a map for coordinates
                    'mappoint', // Needs a map for coordinates
                    'tiledwebmap',
                    'networkgraph',
                    'organization',
                    'sunburst',
                    'sankey',
                    'dependencywheel',
                    'treegraph',
                    'arcdiagram',
                    'venn',
                    'wordcloud',
                    'flowmap'
                ].includes(type)
            ) {
                QUnit.test('Color axis for ' + type, function (assert) {
                    var cfg = {
                        colorAxis: {},
                        chart: {
                            options3d: {
                                enabled: type === 'scatter3d'
                            }
                        },
                        series: [
                            {
                                colorByPoint: false,
                                marker: {
                                    enabled: true
                                },
                                type: type,
                                data: [
                                    [1, 2, 3, 4, 10],
                                    [2, 3, 4, 5, 15],
                                    [3, 2, 5, 6, 20]
                                ]
                            }
                        ]
                    };

                    // Special cases
                    if (type === 'treemap') {
                        cfg.series[0].keys = ['x', 'y', 'value', 'colorValue'];
                    } else if (type === 'xrange') {
                        cfg.series[0].keys = ['x', 'x2', 'y'];
                    } else if (type === 'gantt') {
                        cfg.series[0].data = [
                            { start: 0, end: 4, y: 1 },
                            { start: 2, end: 5, y: 2 }
                        ];
                    } else if (type === 'geoheatmap') {
                        cfg.series[0].data = [
                            { lat: 0, lon: 10, value: 1 },
                            { lat: 10, lon: 0, value: 2 }
                        ];
                    }

                    var chart = Highcharts.chart('container', cfg),
                        points = chart.series[0].points;

                    assert.notEqual(
                        points[0].color,
                        points[1].color,
                        'Color axis should work with ' + type + ' chart'
                    );
                });
            }
        });
});
