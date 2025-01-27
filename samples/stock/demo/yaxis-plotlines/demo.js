(async () => {

    // Load the dataset
    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-c.json'
    ).then(response => response.json());

    const startDate = new Date(data[data.length - 1][0]);
    let minRate = null,
        maxRate = null,
        date,
        rate,
        index;

    startDate.setMonth(startDate.getMonth() - 3); // a quarter of a year
    // before last data point

    const startPeriod = Date.UTC(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
    );

    for (index = data.length - 1; index >= 0; index = index - 1) {
        date = data[index][0]; // data[i][0] is date
        rate = data[index][1]; // data[i][1] is stock price
        if (date < startPeriod) {
            break; // stop measuring highs and lows
        }
        if (rate > maxRate || maxRate === null) {
            maxRate = rate;
        }
        if (rate < minRate || minRate === null) {
            minRate = rate;
        }
    }

    // Create the chart
    Highcharts.stockChart('container', {

        rangeSelector: {
            selected: 1
        },

        title: {
            text: 'AAPL Stock Price'
        },

        yAxis: {
            title: {
                text: 'Stock price'
            },
            plotLines: [{
                value: minRate,
                color: 'green',
                dashStyle: 'shortdash',
                width: 2,
                label: {
                    text: 'Last quarter minimum',
                    y: 15
                }
            }, {
                value: maxRate,
                color: 'red',
                dashStyle: 'shortdash',
                width: 2,
                label: {
                    text: 'Last quarter maximum'
                }
            }]
        },

        series: [{
            name: 'AAPL Stock Price',
            data: data,
            tooltip: {
                valueDecimals: 2
            }
        }]
    });
})();
