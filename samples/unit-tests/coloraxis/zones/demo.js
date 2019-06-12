QUnit.test(
    'Testing zones vs colorAxis',
    function (assert) {

        var chart = Highcharts.chart('container', {
                colorAxis: {
                    stops: [
                        [0, '#FFFFFF'],
                        [1, '#000000']
                    ]
                },

                series: [{
                    type: 'heatmap',
                    data: [{
                        x: 0,
                        y: 0,
                        value: 1
                    }, {
                        x: 0,
                        y: 1,
                        value: 4
                    }],
                    zones: [{
                        value: 1
                    }]
                }]
            }),
            point = chart.series[0].points[0];

        point.setState('hover');
        point.setState('');

        assert.strictEqual(
            point.graphic.attr('fill').replace(/\ /g, ''),
            chart.colorAxis[0].toColor(
                point.value,
                point
            ).replace(/\ /g, ''),
            'Fill from colorAxis should be used when no color specified in zone (#10670).'
        );
    }
);