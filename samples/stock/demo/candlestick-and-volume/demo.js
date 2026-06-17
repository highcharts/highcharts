(async () => {

    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-ohlcv.json'
    ).then(response => response.json());

    // Convert the data rows to columns and create a DataTable
    const columns = ['DateTime', 'Open', 'High', 'Low', 'Close', 'Volume']
        .reduce((acc, name, i) => {
            acc[name] = data.map(row => row[i]);
            return acc;
        }, {});
    const dataTable = new Highcharts.DataTable({ columns });

    // Create the chart
    Highcharts.stockChart('container', {

        dataTable,

        rangeSelector: {
            selected: 4
        },

        title: {
            text: 'AAPL Historical'
        },

        yAxis: [{
            labels: {
                align: 'right',
                x: -3
            },
            title: {
                text: 'OHLC'
            },
            height: '70%',
            lineWidth: 2,
            resize: {
                enabled: true
            }
        }, {
            labels: {
                align: 'right',
                x: -3
            },
            title: {
                text: 'Volume'
            },
            top: '75%',
            height: '25%',
            offset: 0,
            lineWidth: 2
        }],

        tooltip: {
            split: true
        },

        plotOptions: {
            series: {
                dataMapping: {
                    x: 'DateTime'
                },
                // Common data grouping for the two series
                dataGrouping: {
                    units: [[
                        'week',                         // Unit name
                        [1]                             // Allowed multiples
                    ], [
                        'month',
                        [1, 2, 3, 4, 6]
                    ]]
                }
            }
        },

        series: [{
            type: 'candlestick',
            name: 'AAPL',
            dataMapping: {
                open: 'Open',
                high: 'High',
                low: 'Low',
                close: 'Close'
            }
        }, {
            type: 'column',
            name: 'Volume',
            dataMapping: {
                y: 'Volume'
            },
            yAxis: 1
        }]
    });
})();