const commonOptions = {
    api: {
        url: 'https://demo-live-data.highcharts.com',
        access: {
            url: 'https://demo-live-data.highcharts.com/token/oauth',
            token: 'token'
        }
    }
};

const NVIDIACorpId = '0P000003RE';

const NVIDIAPriceConnector =
    new HighchartsConnectors.Morningstar.TimeSeriesConnector({
        ...commonOptions,
        series: {
            type: 'OHLCV'
        },
        securities: [
            {
                id: NVIDIACorpId,
                idType: 'MSID'
            }
        ],
        currencyId: 'EUR'
    });

(async () => {
    await NVIDIAPriceConnector.load();

    Highcharts.stockChart('container', {
        dataTable: NVIDIAPriceConnector.getTable(),
        yAxis: [{
            labels: {
                align: 'left'
            },
            height: '80%',
            resize: {
                enabled: true
            }
        }, {
            labels: {
                align: 'left'
            },
            top: '80%',
            height: '20%',
            offset: 0
        }],
        rangeSelector: {
            selected: 4
        },
        tooltip: {
            shape: 'square',
            headerShape: 'callout',
            borderWidth: 0,
            shadow: false,
            fixed: true
        },
        series: [{
            type: 'candlestick',
            id: 'nvidia-candlestick',
            name: 'NVIDIA Corp Stock Price',
            dataMapping: {
                x: 'Date',
                open: `${NVIDIACorpId}_Open`,
                high: `${NVIDIACorpId}_High`,
                low: `${NVIDIACorpId}_Low`,
                close: `${NVIDIACorpId}_Close`,
                y: `${NVIDIACorpId}_Close` // #22506, issue no. 6
            },
            dataGrouping: {
                groupPixelWidth: 20
            }
        }, {
            type: 'column',
            id: 'nvidia-volume',
            name: 'NVIDIA Volume',
            dataMapping: {
                x: 'Date',
                y: `${NVIDIACorpId}_Volume`
            },
            yAxis: 1
        }],
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 800
                },
                chartOptions: {
                    rangeSelector: {
                        inputEnabled: false
                    }
                }
            }]
        }
    });
})();