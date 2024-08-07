(async () => {

    // Load the dataset
    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-ohlc.json'
    ).then(response => response.json());
    Highcharts.setOptions({
        lang: {
            rangeSelectorZoom: 'DataGrouping intervals'
        }
    });

    const chart = Highcharts.stockChart('container', {
        series: [{
            type: 'candlestick',
            id: 'aapl-ohlc',
            name: 'AAPL Stock Price',
            data: data
        }],
        rangeSelector: {
            buttons: [{
                text: 'D1',
                title: 'Set timeframe to 1 day',
                dataGrouping: {
                    forced: true,
                    units: [
                        ['day', [1]]
                    ]
                }
            }, {
                text: 'W1',
                title: 'Set timeframe to 1 week',
                dataGrouping: {
                    forced: true,
                    units: [
                        ['week', [1]]
                    ]
                }
            }, {
                text: 'MN',
                title: 'Set timeframe to 1 month',
                dataGrouping: {
                    forced: true,
                    units: [
                        ['month', [1]]
                    ]
                }
            }],
            inputEnabled: false
        }
    });

    // Toggle data grouping
    const toggleDataGrouping = document.getElementById('toggle-data-grouping');
    toggleDataGrouping.addEventListener('click', () => {
        const dataGroupingEnabled = !!chart.series[0].currentDataGrouping;

        chart.series[0].update({
            dataGrouping: {
                enabled: !dataGroupingEnabled
            }
        });

        toggleDataGrouping.innerText =
        `${dataGroupingEnabled ? 'Enable' : 'Disable'} data grouping`;
    });

})();
