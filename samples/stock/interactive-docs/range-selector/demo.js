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
    let isDefaultButtons = true;
    const updateButton =
        document.getElementById('update-range-selector-buttons');

    const newOptions = {
        buttons: [{
            type: 'month',
            count: 1,
            text: 'Month',
            title: 'View 1 month'
        }, {
            type: 'month',
            count: 6,
            text: '6 months',
            title: 'View 6 months'
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
    };
    const originalOptions = {
        buttons: [{
            type: 'month',
            count: 1,
            text: '1m',
            title: 'View 1 month'
        }, {
            type: 'month',
            count: 3,
            text: '3m',
            title: 'View 3 months'
        }, {
            type: 'month',
            count: 6,
            text: '6m',
            title: 'View 6 months'
        }, {
            type: 'ytd',
            text: 'YTD',
            title: 'View year to date'
        }, {
            type: 'year',
            count: 1,
            text: '1y',
            title: 'View 1 year'
        }, {
            type: 'all',
            text: 'All',
            title: 'View all'
        }],
        buttonTheme: {
            width: 28
        }
    };

    updateButton.addEventListener('click', () => {
        chart.update({
            rangeSelector: isDefaultButtons ? newOptions : originalOptions
        });

        isDefaultButtons = !isDefaultButtons;
    });
})();
