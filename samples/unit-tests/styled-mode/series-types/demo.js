QUnit.module('Styled mode for series types', function () {
    var notified = {};

    function checkStyledMode(chart, assert) {
        var container = chart.container;
        var denylist = [
            'fill',
            'fill-opacity',
            // 'opacity', // To do: check this in HC7
            'stroke',
            'stroke-width',
            'style'
        ];
        if (
            new RegExp(' (' + denylist.join('|') + ')="', 'gu').test(
                container.innerHTML
            )
        ) {
            denylist.forEach(function (attr) {
                container
                    .querySelectorAll('*[' + attr + ']')
                    .forEach(function (elem) {
                        if (elem.className === 'highcharts-a11y-proxy-button') {
                            return;
                        }
                        var key = [
                            attr,
                            elem.nodeName,
                            elem.getAttribute('class')
                        ].join(',');
                        if (!notified[key]) {
                            console.log(
                                '⚠️ Found presentational attribute in styled mode:',
                                attr,
                                elem
                            );
                            assert.ok(
                                false,
                                'Unexpected attribute: ' +
                                    attr +
                                    '. See console for details.'
                            );
                        }
                        notified[key] = true;
                    });
            });
        }
    }

    Object.keys(Highcharts.Series.types).forEach(function (type) {
        if (
            // Don't test indicator series (yet), they have more complex setup
            !('linkedTo' in Highcharts.defaultOptions.plotOptions[type]) &&
            // In solid gauge, the fill conveys magnitude
            type !== 'solidgauge' &&
            // Complains about a missing axis
            type !== 'scatter3d' &&
            // Uses CSS for HTML data label positioning
            type !== 'organization'
        ) {
            QUnit.test('Styled mode for ' + type, function (assert) {
                var cfg = {
                    chart: {
                        type: type,
                        styledMode: true
                    },
                    accessibility: {
                        enabled: false // A11y forces graphic for null points
                    },
                    series: [
                        {
                            id: 'primary',
                            data: [
                                [1, 2, 3, 4],
                                [2, 3, 4, 5],
                                [3, 4, 5, 6]
                            ],
                            dataLabels: {
                                enabled: true
                            }
                        },
                        {
                            colorByPoint: true,
                            data: [
                                [1, 2, 3, 4],
                                [2, 3, 4, 5],
                                [3, 4, 5, 6]
                            ]
                        }
                    ]
                };

                // Special cases
                if (type === 'line') {
                    cfg.annotations = [
                        {
                            labels: [
                                {
                                    point: {
                                        xAxis: 2,
                                        yAxis: 2
                                    },
                                    text: 'Annotation label'
                                }
                            ]
                        }
                    ];
                }

                if (type === 'networkgraph') {
                    cfg.series[0].keys = ['from', 'to'];
                    cfg.series[1].keys = ['from', 'to'];
                }

                var chart = Highcharts.chart('container', cfg);

                assert.strictEqual(
                    chart.series[0].type,
                    type,
                    'Successfully created ' + type + ' chart'
                );

                chart.tooltip.refresh(chart.series[0].points[0]);
                checkStyledMode(chart, assert);
            });
        }
    });
});
