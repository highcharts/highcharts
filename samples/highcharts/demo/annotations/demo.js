const commonOptions = {
    api: {
        url: 'https://demo-live-data.highcharts.com',
        access: {
            url: 'https://demo-live-data.highcharts.com/token/oauth',
            token: 'token'
        }
    }
};

const TeslaISIN = 'US88160R1014';

const connector = new HighchartsConnectors.Morningstar.TimeSeriesConnector({
    ...commonOptions,
    series: {
        type: 'Price'
    },
    securities: [
        {
            id: TeslaISIN,
            idType: 'ISIN'
        }
    ],
    startDate: '2017-01-01',
    endDate: '2025-03-17',
    currencyId: 'USD'
});

(async () => {
    await connector.load();

    const cols = connector.getTable().getColumns();

    const name = Array.from(Object.keys(cols).filter(k => k !== 'Date'))[0];
    const data = cols[name].map((value, i) => [cols.Date[i], value]);

    Highcharts.chart('container', {
        chart: {
            type: 'area',
            zooming: {
                type: 'x'
            },
            panning: true,
            panKey: 'shift',
            scrollablePlotArea: {
                minWidth: 600,
                scrollPositionX: 1
            }
        },

        caption: {
            text: `This chart uses the Highcharts Annotations feature to place
                labels at various points of interest. The labels are responsive
                and will be hidden to avoid overlap on small screens.`
        },

        title: {
            text: 'TSLA Stock price 2017 - March 17, 2025',
            align: 'left'
        },

        accessibility: {
            landmarkVerbosity: 'one'
        },

        credits: {
            enabled: false
        },

        annotations: [
            {
                draggable: '',
                labelOptions: {
                    shape: 'connector'
                },
                labels: [
                    {
                        allowOverlap: true,
                        point: {
                            xAxis: 0,
                            yAxis: 0,
                            x: '2020-08-20',
                            y: 133.45
                        },
                        x: -100,
                        text: '5 for 1 Stock split announcement'
                    },
                    {
                        point: {
                            xAxis: 0,
                            yAxis: 0,
                            x: '2020-12-21',
                            y: 216.62
                        },
                        text: 'Inclusion to S&P 500 Index',
                        x: -70,
                        y: -20
                    },
                    {
                        point: {
                            xAxis: 0,
                            yAxis: 0,
                            x: '2021-04-01',
                            y: 220.58
                        },
                        text: 'Record earnings in Q1 2021',
                        y: -60,
                        x: -25
                    },
                    {
                        point: {
                            xAxis: 0,
                            yAxis: 0,
                            x: '2021-11-01',
                            y: 402.86
                        },
                        x: -100,
                        text: 'Stock Sale by Elon Musk'
                    },
                    {
                        point: {
                            xAxis: 0,
                            yAxis: 0,
                            x: '2022-03-22',
                            y: 331.33
                        },
                        text: 'Berlin\'s giga factory opening',
                        x: -15,
                        y: 120
                    },
                    {
                        point: {
                            xAxis: 0,
                            yAxis: 0,
                            x: '2022-04-12',
                            y: 328.98
                        },
                        text: 'Musk\'s Twitter aquisition',
                        x: 70
                    },
                    {
                        point: {
                            xAxis: 0,
                            yAxis: 0,
                            x: '2023-09-16',
                            y: 265.28
                        },
                        text: '5 million cars produced',
                        x: -15,
                        y: -15
                    },
                    {
                        point: {
                            xAxis: 0,
                            yAxis: 0,
                            x: '2024-11-05',
                            y: 251.44
                        },
                        text: 'Trump wins elections',
                        x: -50,
                        y: -120
                    }
                ]
            },
            {
                draggable: '',
                labels: [
                    {
                        point: {
                            xAxis: 0,
                            yAxis: 0,
                            x: '2019-03-14',
                            y: 19.33
                        },
                        x: -60,
                        text: 'Tesla Model Y announced'
                    },
                    {
                        point: {
                            xAxis: 0,
                            yAxis: 0,
                            x: '2019-11-21',
                            y: 23.65
                        },
                        text: 'Tesla CyberTruck announced',
                        x: -80,
                        y: -40
                    },
                    {
                        point: {
                            xAxis: 0,
                            yAxis: 0,
                            x: '2020-09-22',
                            y: 141.41
                        },
                        x: 100,
                        y: 50,
                        text: 'Tesla Model S and X Plaid announced'
                    }, {
                        point: {
                            xAxis: 0,
                            yAxis: 0,
                            x: '2024-01-24',
                            y: 207.83
                        },
                        y: 70,
                        text: 'Tesla Model 2 announced'
                    }
                ]
            }
        ],

        xAxis: {
            type: 'datetime'
        },

        yAxis: {
            startOnTick: true,
            endOnTick: false,
            title: {
                text: null
            },
            labels: {
                format: '{value} USD'
            },
            accessibility: {
                description: 'Price',
                rangeDescription: 'Price ranges from 0 to 480 USD.'
            }
        },

        tooltip: {
            pointFormat: '{point.y:.2f} USD',
            shared: true
        },

        legend: {
            enabled: false
        },

        series: [
            {
                data,
                color: '#cc0000',
                fillColor: {
                    linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                    stops: [
                        [0, 'var(--highcharts-neutral-color-40, #999999)'],
                        [1, 'var(--highcharts-neutral-color-3, #f7f7f7)']
                    ]
                },
                fillOpacity: 0.5,
                name: 'TSLA Stock Price',
                marker: {
                    enabled: false
                },
                threshold: null
            }
        ]
    });
})();
