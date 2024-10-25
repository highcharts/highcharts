const commonOptions = {
    api: {
        url: 'https://demo-live-data.highcharts.com',
        access: {
            url: 'https://demo-live-data.highcharts.com/token/oauth',
            username: 'username',
            password: 'password'
        }
    }
};

const AMDISIN = 'US0079031078';

// eslint-disable-next-line no-undef
const AMDPriceConnector = new Connectors.Morningstar.TimeSeriesConnector({
    ...commonOptions,
    series: {
        type: 'Price'
    },
    securities: [
        {
            id: AMDISIN,
            idType: 'ISIN'
        }
    ],
    currencyId: 'EUR'
});

Promise.all([AMDPriceConnector.load()]).then(() => {
    const cols = AMDPriceConnector.table.getColumns();

    const name = Array.from(Object.keys(cols).filter(k => k !== 'Date'))[0];
    const price = cols[name].map((value, i) => [cols.Date[i], value]);

    const firstNav = Highcharts.navigator('navigator-container', {
        series: [{
            data: price
        }]
    });

    const secondNav = Highcharts.navigator('second-navigator-container', {
        series: [{
            data: price
        }]
    });

    const priceChart = Highcharts.stockChart('price-chart', {
        navigator: {
            enabled: false
        },
        rangeSelector: {
            enabled: false
        },
        scrollbar: {
            enabled: false
        },
        title: {
            text: 'AMD Stock Pice'
        },
        series: [{
            name: 'AMD',
            data: price
        }]
    });

    // Adjust second navigator range based on the first navigator
    Highcharts.addEvent(firstNav.navigator, 'setRange', function (e) {
        secondNav.navigator.xAxis.update({ min: e.min, max: e.max });

        const { min, max } = secondNav.navigator.chart.xAxis[0].getExtremes();
        const newMin = Math.max(min, e.min);
        const newMax = Math.min(max, e.max);

        e.min = newMin;
        e.max = newMax;

        Highcharts.fireEvent(secondNav.navigator, 'setRange', e);
    });

    // Bind chart
    secondNav.bind(priceChart);

    // Set initial ranges
    firstNav.setRange(
        Date.UTC(2014),
        firstNav.navigator.xAxis.max
    );

    secondNav.setRange(
        Date.UTC(2022),
        secondNav.navigator.xAxis.max
    );
});
