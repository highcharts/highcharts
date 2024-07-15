(async () => {

    // Load the dataset
    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-ohlc.json'
    ).then(response => response.json());

    const chart = Highcharts.stockChart('container', {
        series: [{
            type: 'candlestick',
            id: 'aapl-ohlc',
            name: 'AAPL Stock Price',
            data: data
        }],
        navigator: {
            enabled: false
        }
    });

    // Toggle range selector
    const toggleButton = document.getElementById('toggle-range-selector');
    toggleButton.addEventListener('click', () => {
        const rangeSelectorEnabled = chart.rangeSelector.options.enabled;

        chart.update({
            rangeSelector: {
                enabled: !rangeSelectorEnabled
            }
        });

        toggleButton.innerText =
        `${rangeSelectorEnabled ? 'Enable' : 'Disable'} range selector`;
    });

    // Update range selector buttons
    const updateButton =
        document.getElementById('update-range-selector-buttons');

    updateButton.addEventListener('click', () => {
        chart.update({
            rangeSelector: {
                buttons: [{
                    type: 'month',
                    count: 1,
                    text: 'Month',
                    title: 'View 1 months'
                }, {
                    type: 'month',
                    count: 6,
                    text: '6 months',
                    title: 'View 1 months'
                }, {
                    type: 'week',
                    count: 1,
                    text: 'Week',
                    title: 'View 1 week'
                }, {
                    type: 'year',
                    text: 'Year',
                    title: 'View 1 year'
                }],
                buttonTheme: {
                    width: 60
                }
            }
        });
    });


})();
