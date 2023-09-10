(async () => {

    // Load the dataset
    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-ohlcv.json'
    ).then(response => response.json());

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

    // split the data set into ohlc and volume
    const ohlc = [],
        volume = [],
        dataLength = data.length;

    for (let i = 0; i < dataLength; i += 1) {
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
                        const chart = this.chart,
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
                                    const newZones = series.userOptions.zones;

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
        yAxis: [{
            height: '80%'
        }, {
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
        }],
        responsive: {
            rules: [{
                condition: {
                    minWidth: 600
                },
                chartOptions: {
                    yAxis: [{
                        labels: {
                            align: 'left'
                        }
                    }, {
                        labels: {
                            align: 'left'
                        }
                    }]
                }
            }]
        }
    });
})();