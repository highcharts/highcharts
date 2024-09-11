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

const ISINMap = {
    Netflix: 'US64110L1061',
    Apple: 'US0378331005',
    Intel: 'US4581401001',
    Nvidia: 'US67066G1040',
    AMD: 'US0079031078',
    Microsoft: 'US5949181045',
    Tesla: 'US88160R1014',
    Meta: 'US30303M1027',
    Amazon: 'US0231351067',
    GoogleClassA: 'US02079K3059',
    GoogleClassC: 'US02079K1079'
};

// eslint-disable-next-line no-undef
const ApplePriceConnector = new Connectors.Morningstar.TimeSeriesConnector({
    ...commonOptions,
    series: {
        type: 'Price'
    },
    securities: [
        {
            id: ISINMap.Netflix,
            idType: 'ISIN'
        }
    ],
    currencyId: 'EUR'
});

Promise.all([
    ApplePriceConnector.load()
]).then(() => {
    const { Date: dates, ...cols } = ApplePriceConnector.table.getColumns(),
        data = Object.values(cols)
            .flatMap(vals => vals.map((v, i) => [dates[i], v]));

    Highcharts.chart('container', {
        chart: {
            type: 'areaspline'
        },
        title: {
            text: 'Netflix Inc',
            align: 'left'
        },
        subtitle: {
            text: 'Source: <a href="https://www.morningstar.com/stocks/xnas/nflx/quote" target="_blank">Morning star</a>',
            align: 'left'
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'top',
            x: 120,
            y: 70,
            floating: true,
            borderWidth: 1,
            backgroundColor:
                    Highcharts.defaultOptions.legend.backgroundColor ||
                    '#FFFFFF'
        },
        xAxis: {
            type: 'datetime',
            plotBands: [{
                from: new Date('2020-07-05').valueOf(),
                to: new Date('2020-07-22').valueOf(),
                color: 'rgba(68, 170, 213, .4)'
            }]
        },
        yAxis: {
            title: {
                text: 'USD'
            }
        },
        tooltip: {
            valueDecimals: 2,
            valuePrefix: '$'
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            areaspline: {
                fillOpacity: 0.5
            }
        },
        series: [{
            name: 'NFLX',
            data: data
        }]
    });
});
