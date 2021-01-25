Highcharts.getJSON('https://demo-live-data.highcharts.com/aapl-ohlcv.json', function (data) {
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

    // create the chart
    const chart = Highcharts.stockChart('container', {
        chart: {
            height: 600
        },
        title: {
            text: 'AAPL Historical'
        },
        subTitle: {
            text: 'All indicators'
        },
        legend: {
            enabled: true
        },
        rangeSelector: {
            selected: 2
        },
        tooltip: {
            split: true
        },
        yAxis: [{
            height: '70%'
        }, {
            top: '75%',
            height: '25%'
        }],
        series: [{
            type: 'candlestick',
            id: 'aapl',
            name: 'AAPL',
            data: data
        }, {
            type: 'column',
            id: 'volume',
            name: 'Volume',
            data: volume,
            yAxis: 1
        }]
    });

    document.getElementById("overlays").addEventListener("change", function (e) {
        const seriesToAdd = e.target.value;

        // Destroy previously existing series.
        if (chart.series[2] && chart.series[2].yAxis.options.index === 0) {
            chart.series[2].destroy(false);
        }
        if (chart.series[3] && chart.series[3].yAxis.options.index === 0) {
            chart.series[3].destroy(false);
        }

        if (seriesToAdd !== 'none') {
            if (seriesToAdd === 'ikh') {
                chart.addSeries({
                    type: 'ikh',
                    linkedTo: 'aapl',
                    showInLegend: true,
                    tenkanLine: {
                        styles: {
                            lineColor: 'lightblue'
                        }
                    },
                    kijunLine: {
                        styles: {
                            lineColor: 'darkred'
                        }
                    },
                    chikouLine: {
                        styles: {
                            lineColor: 'lightgreen'
                        }
                    },
                    senkouSpanA: {
                        styles: {
                            lineColor: 'green'
                        }
                    },
                    senkouSpanB: {
                        styles: {
                            lineColor: 'red'
                        }
                    },
                    senkouSpan: {
                        color: 'rgba(0, 255, 0, 0.3)',
                        styles: {
                            fill: 'rgba(0, 0, 255, 0.1)'
                        }
                    }
                }, false);
            } else {
                chart.addSeries({
                    type: seriesToAdd,
                    linkedTo: 'aapl',
                    showInLegend: true
                }, false);
            }
        }
        chart.redraw();
    });

    document.getElementById("oscilators").addEventListener("change", function (e) {
        const seriesToAdd = e.target.value;

        // Add third axis if needed.
        if (chart.yAxis.length === 3) {
            chart.yAxis[0].update({
                height: '55%'
            });
            chart.yAxis[1].update({
                top: '60%',
                height: '15%'
            });
            chart.addAxis({
                top: '80%',
                height: '20%',
                opposite: true,
                title: {
                    text: null
                }
            });
        }

        // Destroy previously existing series.
        if (chart.series[2] && chart.series[2].yAxis.options.index === 3) {
            chart.series[2].destroy(false);
        }
        if (chart.series[3] && chart.series[3].yAxis.options.index === 3) {
            chart.series[3].destroy(false);
        }

        // Remove axis if not necessary.
        if (seriesToAdd === 'none') {
            chart.yAxis[3].remove();

            chart.yAxis[0].update({
                height: '70%'
            });
            chart.yAxis[1].update({
                top: '75%',
                height: '25%'
            });
        } else {
            if (seriesToAdd === 'aroon') {
                chart.addSeries({
                    yAxis: 3,
                    type: 'aroon',
                    linkedTo: 'aapl',
                    color: 'green',
                    lineWidth: 1,
                    showInLegend: true,
                    aroonDown: {
                        styles: {
                            lineColor: 'red'
                        }
                    }
                }, false);
            }

            if (seriesToAdd !== 'aroon') {
                chart.addSeries({
                    type: seriesToAdd,
                    linkedTo: 'aapl',
                    yAxis: 3,
                    showInLegend: true
                }, false);
            }
        }
        chart.redraw();
    });
});
