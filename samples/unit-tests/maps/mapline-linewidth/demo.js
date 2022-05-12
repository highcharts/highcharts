QUnit.test(
    'Setting lineWidth of mapline series should work in all browsers (#5201)',
    function (assert) {
        var chart = Highcharts.mapChart('container', {
            series: [
                {
                    type: 'mapline',
                    data: Highcharts.geojson(
                        Highcharts.maps['countries/us/custom/us-small'],
                        'mapline'
                    ),
                    lineWidth: 30
                }
            ]
        });

        assert.close(
            chart.series[0].transformGroups[0].element.getAttribute(
                'stroke-width'
            ) * chart.mapView.getSVGTransform().scaleX,
            30,
            0.0000000001,
            'Line width should be set'
        );
    }
);

QUnit.test(
    'Setting lineWidth hover state for the mapLine series (#17105)',
    function (assert) {

        // Initialize the chart
        const chart = Highcharts.mapChart('container', {
            series: [{
                type: 'mappoint',
                data: [{
                    id: 'one',
                    lat: 1,
                    lon: 5
                }, {
                    id: 'two',
                    lat: 15,
                    lon: 1
                }]
            }]
        });

        chart.addSeries({
            type: 'mapline',
            states: {
                hover: {
                    lineWidth: 4
                }
            },
            data: [{
                id: 'one - two',
                path: [["M", 5, 1], ["Q", 2.9268292682926833, 7.8048780487804885, 1, 15]]
            }]
        }, true, false);

        chart.series[1].points[0].setState('hover');

        assert.strictEqual(
            chart.series[1].options.states.hover.lineWidth,
            4,
            'Line width should have a value of 4 on hover state (#17105).'
        );
    });
