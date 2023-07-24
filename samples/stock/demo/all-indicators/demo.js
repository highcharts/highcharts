(async () => {

    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-ohlcv.json'
    ).then(response => response.json());

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

    // create the chart
    Highcharts.stockChart('container', {
        chart: {
            height: 600
        },
        title: {
            text: 'AAPL Historical'
        },
        subtitle: {
            text: 'All indicators'
        },
        accessibility: {
            series: {
                descriptionFormat: '{seriesDescription}.'
            },
            description: 'Use the dropdown menus above to display different indicator series on the chart.',
            screenReaderSection: {
                beforeChartFormat: '<{headingTagName}>{chartTitle}</{headingTagName}><div>{typeDescription}</div><div>{chartSubtitle}</div><div>{chartLongdesc}</div>'
            }
        },
        legend: {
            enabled: true
        },
        rangeSelector: {
            selected: 2
        },
        yAxis: [{
            height: '60%'
        }, {
            top: '60%',
            height: '20%'
        }, {
            top: '80%',
            height: '20%'
        }],
        plotOptions: {
            series: {
                showInLegend: true,
                accessibility: {
                    exposeAsGroupOnly: true
                }
            }
        },
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
        }, {
            type: 'pc',
            id: 'overlay',
            linkedTo: 'aapl',
            yAxis: 0
        }, {
            type: 'macd',
            id: 'oscillator',
            linkedTo: 'aapl',
            yAxis: 2
        }]
    }, function (chart) {
        document.getElementById('overlays').addEventListener('change', function (e) {
            const series = chart.get('overlay');

            if (series) {
                series.remove(false);
                chart.addSeries({
                    type: e.target.value,
                    linkedTo: 'aapl',
                    id: 'overlay'
                });
            }
        });

        document.getElementById('oscillators').addEventListener('change', function (e) {
            const series = chart.get('oscillator');

            if (series) {
                series.remove(false);
                chart.addSeries({
                    type: e.target.value,
                    linkedTo: 'aapl',
                    id: 'oscillator',
                    yAxis: 2
                });
            }
        });
    });
})();