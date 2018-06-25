// Create the chart
Highcharts.stockChart('container', {

    chart: {
        type: 'column'
    },

    rangeSelector: {
        selected: 2
    },

    title: {
        text: 'AAPL Stock Price'
    },

    subtitle: {
        text: 'Use navigator to compare column groupings'
    },

    yAxis: [{
        height: '50%'
    }, {
        top: '50%',
        height: '50%'
    }],

    plotOptions: {
        series: {
            tooltip: {
                valueDecimals: 2
            },
            dataGrouping: {
                enabled: true,
                forced: true,
                units: [
                    ['month', [1, 3, 6]]
                ]
            }
        }
    },

    series: [{
        name: 'AAPL',
        data: ADBE,
        cropShoulder: 1,
        dataGrouping: {
            groupAll: true
        }
    }, {
        name: 'AAPL',
        data: ADBE,
        yAxis: 1,
        dataGrouping: {
            // Default:
            // groupAll: false
        }
    }]
});