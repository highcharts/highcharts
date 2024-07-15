(async () => {

    // Load the dataset
    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-ohlc.json'
    ).then(response => response.json());

    const chart = Highcharts.stockChart('container', {
        series: [{
            type: 'ohlc',
            id: 'aapl-ohlc',
            name: 'AAPL Stock Price',
            data: data
        }],
        rangeSelector: {
            enabled: false
        }
    });

    // Toggle navigator
    const toggleNavigator = document.getElementById('toggle-navigator');
    toggleNavigator.addEventListener('click', () => {
        const navigatorEnabled = chart.navigator.navigatorEnabled;

        chart.update({
            navigator: {
                enabled: !navigatorEnabled
            }
        });

        toggleNavigator.innerText =
        `${navigatorEnabled ? 'Enable' : 'Disable'} navigator`;
    });

    // Toggle navigator
    const toggleScrollbar = document.getElementById('toggle-scrollbar');
    toggleScrollbar.addEventListener('click', () => {
        const scrollbarEnabled = !!chart.scrollbar.scrollbar;

        chart.update({
            scrollbar: {
                enabled: !scrollbarEnabled
            }
        });

        toggleScrollbar.innerText =
        `${scrollbarEnabled ? 'Enable' : 'Disable'} scrollbar`;
    });

    // Change navigator height
    document
        .getElementById('navigator-slider')
        .addEventListener('change', e => {
            chart.update({
                navigator: {
                    height: +e.target.value
                }
            });
        });


})();
