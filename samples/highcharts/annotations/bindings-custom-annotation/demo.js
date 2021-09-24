Highcharts.chart('container', {
    navigation: {
        bindings: {
            thresholds: {
                className: 'highcharts-threshold-annotation',
                start: function (event) {
                    const chart = this.chart,
                        x = chart.xAxis[0].toValue(event.chartX),
                        y = chart.yAxis[0].toValue(event.chartY),
                        colors = chart.options.colors,
                        series = chart.series[0],
                        zones = series.userOptions.zones || [];

                    chart.customColorIndex = chart.customColorIndex || 1;

                    chart.customColorIndex++;

                    if (chart.customColorIndex === colors.length) {
                        chart.customColorIndex = 1;
                    }

                    zones.push({
                        color: colors[chart.customColorIndex],
                        value: y
                    });

                    chart.addAnnotation({
                        langKey: 'thresholds',
                        zoneIndex: zones.length - 1,
                        type: 'infinityLine',
                        draggable: 'y',
                        events: {
                            drag: function (e) {
                                var newZones = series.userOptions.zones;

                                newZones[this.userOptions.zoneIndex].value =
                                chart.yAxis[0].toValue(e.chartY);

                                chart.series[0].update({
                                    zones: newZones
                                });
                            }
                        },
                        typeOptions: {
                            type: 'horizontalLine',
                            points: [{
                                x: x,
                                y: y
                            }]
                        }
                    });

                    chart.series[0].update({
                        zones: zones
                    });
                }
            }
        }
    },
    series: [{
        data: [2, 5, 1, 6, 7, 8, 5]
    }]
}, function () {
    const chart = this;
    document.getElementById('add-annotation').addEventListener('click', function (e) {
        const button = this,
            annotationOptions =
                chart.navigationBindings.options.bindings.thresholds;

        chart.navigationBindings.bindingsButtonClick(
            button,
            annotationOptions,
            e
        );
    });
});
