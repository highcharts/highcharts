QUnit.test('Packed Bubble Tooltip options', function (assert) {
    try {
        const chart = Highcharts.chart('container', {
                chart: {
                    type: 'packedbubble',
                    height: '100%'
                },
                title: false,
                plotOptions: {
                    packedbubble: {
                        layoutAlgorithm: {
                            enableSimulation: false,
                            splitSeries: true
                        },
                        dataLabels: {
                            enabled: false
                        }
                    }
                },
                tooltip: {
                    shared: true
                },
                series: [{
                    data: [{
                        value: 20
                    }, {
                        value: 20
                    }]
                }, {
                    data: [{
                        value: 20
                    }, {
                        value: 20
                    }]
                }, {
                    data: [{
                        value: 20
                    }]
                }]
            }),
            offset = $('#container').offset(),
            left = offset.left + chart.plotLeft,
            top = offset.top + chart.plotTop,
            points = chart.series[0].points;

        chart.pointer.onContainerMouseMove({
            type: 'mousemove',
            pageX: left + points[0].plotX,
            pageY: top + points[0].plotY,
            target: points[0].series.group.element
        });

        assert.ok(
            true,
            'PackedBubble series works correctly with shared tooltip.'
        );
    } catch (error) {
        assert.ok(
            false,
            'PackedBubble series with shared tooltip throws error.'
        );
    }
});