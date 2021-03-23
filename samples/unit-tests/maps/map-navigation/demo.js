QUnit.test(
    'Zoom in - zoomout with padding, panning in both directions.',
    function (assert) {
        var chart = Highcharts.mapChart('container', {
            chart: {
                plotBorderWidth: 1
            },

            mapNavigation: {
                enabled: false
            },

            colorAxis: {
                min: 1,
                max: 1000,
                type: 'logarithmic',
                minColor: '#e6e696',
                maxColor: '#003700'
            },

            // Add some padding inside the plot box
            xAxis: {
                minPadding: 0.2,
                maxPadding: 0.2
            },
            yAxis: {
                minPadding: 0.2,
                maxPadding: 0.2
            },

            // The map series
            series: [
                {
                    data: [
                        {
                            value: 1,
                            path: 'M,0,0,L,100,0,L,100,100,L,0,100,z'
                        },
                        {
                            value: 2,
                            path: 'M,200,200,L,300,200,L,300,300,L,200,300,z'
                        }
                    ]
                }
            ]
        });

        var plotLeft = chart.plotLeft,
            plotTop = chart.plotTop,
            controller = new TestController(chart);

        controller.pan(
            [plotLeft + 50, plotTop + 50],
            [plotLeft + 100, plotTop + 100]
        );

        assert.ok(
            !chart.resetZoomButton,
            'Reset zoom button should not appear while panning and chart is not zoomed.'
        );

        const zoomBefore = chart.mapView.zoom;
        chart.mapZoom(0.5);

        assert.notEqual(
            chart.mapView.zoom,
            zoomBefore,
            'The chart should have zoomed in'
        );

        chart.mapZoom(-0.5);
        assert.strictEqual(
            chart.mapView.zoom,
            zoomBefore,
            'The chart should be zoomed out to original state'
        );

        chart.mapZoom(0.2);


        const { x, y } = chart.mapView.center;

        controller.pan(
            [plotLeft + 50, plotTop + 50],
            [plotLeft + 100, plotTop + 100]
        );

        assert.notEqual(
            chart.mapView.center.x,
            x,
            'The chart should pan horizontally'
        );

        assert.notEqual(
            chart.mapView.center.y,
            y,
            'The chart should pan vertically'
        );
    }
);

QUnit.test('Map navigation button alignment', assert => {
    const chart = Highcharts.mapChart('container', {
        chart: {
            plotBorderWidth: 1,
            width: 600
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        series: [
            {
                data: [
                    {
                        path: 'M 0 0 L 100 0 L 0 100',
                        value: 1
                    },
                    {
                        path: 'M 100 0 L 100 100 L 0 100',
                        value: 2
                    }
                ]
            }
        ]
    });

    assert.close(
        chart.mapNavButtons[1].translateY +
            chart.mapNavButtons[1].element.getBBox().height,
        chart.plotTop + chart.plotHeight,
        1.5,
        'The buttons should initially be bottom-aligned to the plot box (#12776)'
    );

    chart.setSize(undefined, 380);

    assert.close(
        chart.mapNavButtons[1].translateY +
            chart.mapNavButtons[1].element.getBBox().height,
        chart.plotTop + chart.plotHeight,
        1.5,
        'The buttons should be bottom-aligned to the plot box after redraw (#12776)'
    );
});
