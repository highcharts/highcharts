QUnit.test(
    'Setting lineWidth and borderWidth should work in all browsers (#5201, #17105)',
    function (assert) {
        const chart = Highcharts.mapChart('container', {
            series: [{
                data: [{
                    path: [
                        ['M', 10, 10],
                        ['H', 90],
                        ['V', 90],
                        ['H', 10],
                        ['L', 10, 10]
                    ]
                }],
                nullInteraction: true,
                states: {
                    hover: {
                        borderWidth: 5
                    }
                }
            }, {
                type: 'mapline',
                states: {
                    hover: {
                        lineWidth: 10
                    }
                },
                data: [{
                    path: [
                        ['M', 400, 50],
                        ['L', -200, 50]
                    ]
                }]
            }]
        });

        chart.series[0].points[0].setState('hover', false);
        chart.series[1].points[0].setState('hover', false);

        assert.close(
            chart.series[0]
                .transformGroups[0].element.childNodes[0]
                .getAttribute('stroke-width') *
                chart.mapView.getSVGTransform().scaleX,
            5,
            0.0000000001,
            'Border width in the map should have a value of 5 on hover state (#17105).'
        );

        assert.close(
            chart.series[1]
                .transformGroups[0].element.childNodes[0]
                .getAttribute('stroke-width') *
                chart.mapView.getSVGTransform().scaleX,
            10,
            0.0000000001,
            'Line width in mapline should have a value of 10 on hover state (#5201, #17105).'
        );

        chart.series[1].points[0].update({
            lineWidth: 15
        });

        const pointLineWidth = chart.series[1].points[0].graphic['stroke-width'];
        chart.mapView.zoomBy(2);

        assert.ok(
            chart.series[1].points[0].graphic['stroke-width'] < pointLineWidth,
            'Line width set on point in mapline should scale down on zoom, #18166.'
        );
    }
);
