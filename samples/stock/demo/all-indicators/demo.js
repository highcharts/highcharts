Highcharts.getJSON('https://demo-live-data.highcharts.com/aapl-ohlcv.json', function (data) {
    // split the data set into ohlc and volume
    var ohlc = [],
        volume = [],
        dataLength = data.length;

    for (var i = 0; i < dataLength; i += 1) {
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
        subtitle: {
            text: 'All indicators'
        },
        legend: {
            enabled: true
        },
        rangeSelector: {
            selected: 2
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
    }, function () {
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
                chart.addSeries({
                    type: seriesToAdd,
                    linkedTo: 'aapl',
                    showInLegend: true
                }, false);
            }
            chart.redraw();
        });

        document.getElementById("oscilators").addEventListener("change", function (e) {
            const seriesToAdd = e.target.value;

            // Add third axis if needed.
            if (chart.yAxis.length === 3) {
                chart.yAxis[0].update({
                    height: '55%'
                }, false);
                chart.yAxis[1].update({
                    top: '60%',
                    height: '15%'
                }, false);
                chart.addAxis({
                    top: '80%',
                    height: '20%',
                    opposite: true,
                    title: {
                        text: null
                    }
                }, false);
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
                chart.yAxis[3].remove(false);

                chart.yAxis[0].update({
                    height: '70%'
                }, false);
                chart.yAxis[1].update({
                    top: '75%',
                    height: '25%'
                }, false);
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
                } else {
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
});
