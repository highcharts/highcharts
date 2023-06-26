// Apply a theme like Highcharts v10
Highcharts.setOptions({
    colors: [
        '#7cb5ec',
        '#434348',
        '#90ed7d',
        '#f7a35c',
        '#8085e9',
        '#f15c80',
        '#e4d354',
        '#2b908f',
        '#f45b5b',
        '#91e8e1'
    ],
    chart: {
        style: {
            fontFamily: '"Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif',
            fontSize: '16px'
        }
    },
    title: {
        style: {
            fontWeight: 'normal',
            fontSize: '18px'
        }
    },
    plotOptions: {
        area: {
            lineWidth: 2
        },
        column: {
            borderRadius: 0
        },
        pie: {
            borderRadius: 0,
            dataLabels: {
                connectorShape: 'fixedOffset'
            }
        },
        line: {
            lineWidth: 2
        },
        spline: {
            lineWidth: 2
        }
    },
    tooltip: {
        borderWidth: 1
    },
    legend: {
        itemStyle: {
            fontWeight: 'bold'
        },
        itemHiddenStyle: {
            color: '#cccccc',
            textDecoration: 'none'
        }
    },
    xAxis: {
        labels: {
            distance: 8,
            style: {
                color: '#666666',
                fontSize: '11px'
            }
        },
        lineColor: '#ccd6eb'
    },
    yAxis: {
        labels: {
            distance: 8,
            style: {
                color: '#666666',
                fontSize: '11px'
            }
        }
    },
    colorAxis: {
        labels: {
            distance: 8,
            style: {
                color: '#666666',
                fontSize: '11px'
            }
        },
        maxColor: '#003399',
        minColor: '#e6ebf5'
    },
    scrollbar: {
        barBorderRadius: 0,
        barBorderWidth: 1,
        buttonsEnabled: true,
        height: 14,
        margin: 0,
        rifleColor: '#333',
        trackBackgroundColor: '#f2f2f2',
        trackBorderRadius: 0
    }
});

(async () => {

    Highcharts.chart('container-1', {

        title: {
            text: 'Line and column'
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
        },

        colorAxis: undefined,

        series: [{
            data: [1, 4, 3, 5, 4, 6],
            type: 'column',
            name: 'Items'
        }, {
            data: [3, 2, 1, 5, 4, 2],
            name: 'Trend'
        }]
    });

    Highcharts.chart('container-2', {

        chart: {
            type: 'pie'
        },

        title: {
            text: 'Pie chart'
        },

        colorAxis: undefined,

        series: [{
            data: [
                ['Spain', 9],
                ['France', 8],
                ['Italy', 7],
                ['Greece', 6],
                ['Turkey', 5],
                ['Portugal', 4],
                ['Switzerland', 3],
                ['Andorra', 2],
                ['Austria', 1]
            ],
            name: 'Items'
        }]
    });

    // Map chart
    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-ma', 10], ['us-wa', 11], ['us-ca', 12], ['us-or', 13],
        ['us-wi', 14], ['us-me', 15], ['us-mi', 16], ['us-nv', 17],
        ['us-nm', 18], ['us-co', 19], ['us-wy', 20], ['us-ks', 21],
        ['us-ne', 22], ['us-ok', 23], ['us-mo', 24], ['us-il', 25],
        ['us-in', 26], ['us-vt', 27], ['us-ar', 28], ['us-tx', 29],
        ['us-ri', 30], ['us-al', 31], ['us-ms', 32], ['us-nc', 33],
        ['us-va', 34], ['us-ia', 35], ['us-md', 36], ['us-de', 37],
        ['us-pa', 38], ['us-nj', 39], ['us-ny', 40], ['us-id', 41],
        ['us-sd', 42], ['us-ct', 43], ['us-nh', 44], ['us-ky', 45],
        ['us-oh', 46], ['us-tn', 47], ['us-wv', 48], ['us-dc', 49],
        ['us-la', 50], ['us-fl', 51], ['us-ga', 52], ['us-sc', 53],
        ['us-mn', 54], ['us-mt', 55], ['us-nd', 56], ['us-az', 57],
        ['us-ut', 58], ['us-hi', 59], ['us-ak', 60]
    ];

    Highcharts.mapChart('container-3', {
        chart: {
            map: topology
        },

        title: {
            text: 'Highcharts Maps'
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                align: 'right',
                verticalAlign: 'bottom'
            }
        },

        colorAxis: {
            min: 0
        },

        legend: {
            symbolRadius: 0
        },

        series: [{
            data: data,
            name: 'Random data',
            states: {
                hover: {
                    color: '#BADA55'
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }]
    });

    // Stock chart
    const ohlcData = await fetch(
        'https://demo-live-data.highcharts.com/aapl-ohlc.json'
    ).then(response => response.json());

    // create the chart
    Highcharts.stockChart('container-4', {
        rangeSelector: {
            selected: 1
        },

        title: {
            text: 'Stock chart'
        },

        series: [{
            type: 'candlestick',
            name: 'AAPL Stock Price',
            data: ohlcData
        }]
    });

})();