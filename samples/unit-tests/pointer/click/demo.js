(function () {
    function test(type, tooltipEnabled) {
        QUnit.test(
            'Click event on ' +
                type +
                ' with tooltip enabled = ' +
                tooltipEnabled +
                ' (#5101)',
            function (assert) {
                var chart = Highcharts.chart('container', {
                    chart: {
                        type: type,
                        animation: false
                    },

                    tooltip: {
                        enabled: tooltipEnabled
                    },

                    plotOptions: {
                        series: {
                            point: {
                                events: {
                                    click: function () {
                                        this.update({
                                            y: this.y + 1
                                        });
                                    }
                                }
                            }
                        }
                    },

                    series: [
                        {
                            data: [1, 1, 1]
                        }
                    ]
                });
                assert.strictEqual(
                    chart.series[0].points[0].y,
                    1,
                    'Initial value'
                );

                chart.series[0].points[0].onMouseOver();
                chart.pointer.onContainerClick({
                    target: chart.series[0].points[0].graphic.element
                });

                assert.strictEqual(
                    chart.series[0].points[0].y,
                    2,
                    'First click'
                );

                chart.pointer.onContainerClick({
                    target: chart.series[0].points[0].graphic.element
                });

                assert.strictEqual(
                    chart.series[0].points[0].y,
                    3,
                    'Second click without leaving'
                );
            }
        );
    }

    test('pie', true);
    test('pie', false);
    test('column', true);
    test('column', false);
}());

QUnit.test('Click to add', function (assert) {
    var chart = Highcharts.chart('container', {
            chart: {
                type: 'scatter',
                margin: [70, 50, 60, 80],
                events: {
                    click: function (e) {
                        // find the clicked values and the series
                        var x = Math.round(e.xAxis[0].value),
                            y = Math.round(e.yAxis[0].value),
                            series = this.series[0];

                        // Add it
                        series.addPoint([x, y]);
                    }
                }
            },
            title: {
                text: 'User supplied data'
            },
            subtitle: {
                text:
                    'Click the plot area to add a point. Click a point to remove it.'
            },
            xAxis: {
                gridLineWidth: 1,
                minPadding: 0.2,
                maxPadding: 0.2,
                maxZoom: 60
            },
            yAxis: {
                title: {
                    text: 'Value'
                },
                minPadding: 0.2,
                maxPadding: 0.2,
                maxZoom: 60,
                plotLines: [
                    {
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }
                ]
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            plotOptions: {
                series: {
                    lineWidth: 1,
                    point: {
                        events: {
                            click: function () {
                                if (this.series.data.length > 1) {
                                    this.remove();
                                }
                            }
                        }
                    }
                }
            },
            series: [
                {
                    data: [
                        [20, 20],
                        [80, 80]
                    ]
                }
            ]
        }),
        offset = $(chart.container).offset();

    chart.pointer.onContainerClick({
        pageX: offset.left + 100,
        pageY: offset.top + 100,
        type: 'click',
        target: chart.renderer.box.querySelector('rect.highcharts-background')
    });

    chart.pointer.onContainerClick({
        pageX: offset.left + 300,
        pageY: offset.top + 100,
        type: 'click',
        target: chart.renderer.box.querySelector('rect.highcharts-background')
    });

    assert.equal(
        chart.series[0].points.length,
        4,
        'Four points should be added'
    );
});
