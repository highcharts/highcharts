Highcharts.setOptions({
    lang: {
        stockTools: {
            gui: {
                thresholds: 'Click on a chart to add an alarm-line which will change color of the series'
            }
        },
        navigation: {
            popup: {
                thresholds: 'Color threshold'
            }
        }
    }
});

$.getJSON('https://www.highcharts.com/samples/data/aapl-ohlcv.json', function (data) {

    // split the data set into ohlc and volume
    var ohlc = [],
        volume = [],
        dataLength = data.length,
        i = 0;

    for (i; i < dataLength; i += 1) {
        ohlc.push([
            data[i][0], // the date
            data[i][1], // open
            data[i][2], // high
            data[i][3], // low
            data[i][4] // close
        ]);

        volume.push([
            data[i][0], // the date
            data[i][5] // the volume
        ]);
    }

    Highcharts.stockChart('container', {
        stockTools: {
            gui: {
                buttons: [
                    'thresholds',
                    'separator',
                    'indicators',
                    'separator',
                    'simpleShapes',
                    'lines',
                    'crookedLines',
                    'measure',
                    'advanced',
                    'toggleAnnotations',
                    'separator',
                    'verticalLabels',
                    'flags',
                    'separator',
                    'zoomChange',
                    'fullScreen',
                    'typeChange',
                    'separator',
                    'currentPriceIndicator',
                    'saveChart'
                ],
                definitions: {
                    thresholds: {
                        className: 'highcharts-threshold-annotation',
                        symbol: 'horizontal-line.svg'
                    }
                }
            }
        },
        navigation: {
            bindings: {
                thresholds: {
                    className: 'highcharts-threshold-annotation',
                    start: function (event) {
                        var chart = this.chart,
                            x = chart.xAxis[0].toValue(event.chartX),
                            y = chart.yAxis[0].toValue(event.chartY),
                            colors = chart.options.colors,
                            series = chart.series[0],
                            zones = series.userOptions.zones || [];

                        chart.customColorIndex = chart.customColorIndex || 1;

                        chart.customColorIndex++;

                        if (
                            chart.customColorIndex === colors.length
                        ) {
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

                                    newZones[this.userOptions.zoneIndex].value = chart.yAxis[0].toValue(e.chartY);

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
        yAxis: [{
            labels: {
                align: 'left'
            },
            height: '80%'
        }, {
            labels: {
                align: 'left'
            },
            top: '80%',
            height: '20%',
            offset: 0
        }],
        series: [{
            type: 'line',
            id: 'aapl-ohlc',
            name: 'AAPL Stock Price',
            data: ohlc
        }, {
            type: 'column',
            id: 'aapl-volume',
            name: 'AAPL Volume',
            data: volume,
            yAxis: 1
        }]
    });
});
