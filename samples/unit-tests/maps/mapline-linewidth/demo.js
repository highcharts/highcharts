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

        // Function to return an SVG path between two points, with an arc
        function pointsToPath(fromPoint, toPoint, invertArc) {
            const
                from = chart.mapView.lonLatToProjectedUnits(fromPoint),
                to = chart.mapView.lonLatToProjectedUnits(toPoint),
                curve = 0.05,
                arcPointX =
                    (from.x + to.x) /
                    (invertArc ? 2 + curve : 2 - curve),
                arcPointY =
                    (from.y + to.y) /
                    (invertArc ? 2 + curve : 2 - curve);
            return [
                ['M', from.x, from.y],
                ['Q', arcPointX, arcPointY, to.x, to.y]
            ];
        }

        const pointOne = chart.get('one'),
            pointTwo = chart.get('two');

        chart.addSeries({
            type: 'mapline',
            states: {
                hover: {
                    lineWidth: 4
                }
            },
            data: [{
                id: 'one - two',
                path: pointsToPath(pointOne, pointTwo, true)
            }]
        }, true, false);

        chart.series[1].points[0].setState('hover');

        assert.strictEqual(
            chart.series[1].options.states.hover.lineWidth,
            4,
            'Line width should have a value of 4 on hover state (#17105).'
        );
    });
