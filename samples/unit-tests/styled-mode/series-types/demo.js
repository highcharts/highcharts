QUnit.module('Styled mode for series types', function () {

    var notified = {};

    function checkStyledMode(chart, assert) {
        var container = chart.container;
        var blacklist = [
            'fill',
            'fill-opacity',
            //'opacity', // To do: check this in HC7
            'stroke',
            'stroke-width',
            'style'
        ];
        if (
            (new RegExp(' (' + blacklist.join('|') + ')="', 'g')).test(
                container.innerHTML
            )
        ) {
            blacklist.forEach(function (attr) {
                container.querySelectorAll('*[' + attr + ']').forEach(
                    function (elem) {
                        var key = [attr, elem.nodeName, elem.getAttribute('class')].join(',');
                        if (!notified[key]) {
                            console.log(
                                '⚠️ Found presentational attribute in styled mode:',
                                attr,
                                elem
                            );
                            assert.ok(
                                false,
                                'Unexpected attribute: ' + attr + '. See console for details.'
                            );
                        }
                        notified[key] = true;
                    }
                );
            });
        }
    }

    Object.keys(Highcharts.seriesTypes).forEach(function (type) {

        if (
            // Don't test indicator series (yet), they have more complex setup
            !('linkedTo' in Highcharts.defaultOptions.plotOptions[type]) &&

            // In solid gauge, the fill conveys magnitued
            type !== 'solidgauge' &&

            // Complains about a missing axis
            type !== 'scatter3d'
        ) {

            QUnit.test('Styled mode for ' + type, function (assert) {

                var cfg = {
                    chart: {
                        type: type,
                        styledMode: true
                    },
                    series: [{
                        id: 'primary',
                        data: [
                            [1, 2, 3, 4],
                            [2, 3, 4, 5],
                            [3, 4, 5, 6]
                        ],
                        dataLabels: {
                            enabled: true
                        }
                    }, {
                        colorByPoint: true,
                        data: [
                            [1, 2, 3, 4],
                            [2, 3, 4, 5],
                            [3, 4, 5, 6]
                        ]
                    }]
                };

                // Secial cases
                if (type === 'line') {
                    cfg.annotations = [{
                        labels: [{
                            point: {
                                xAxis: 2,
                                yAxis: 2
                            },
                            text: 'Annotation label'
                        }]
                    }];
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

