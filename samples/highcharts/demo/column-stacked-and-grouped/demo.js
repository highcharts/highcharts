// Data retrieved from https://en.wikipedia.org/wiki/Winter_Olympic_Games
Highcharts.chart('container', {
    dataTable: {
        columns: {
            Medal: ['Gold', 'Silver', 'Bronze'],
            Norway: [148, 133, 124],
            Germany: [102, 98, 65],
            'United States': [113, 122, 95],
            Canada: [77, 72, 80]
        }
    },
    chart: {
        type: 'column'
    },

    title: {
        text: 'Olympic Games all-time medal table, grouped by continent',
        align: 'left'
    },

    xAxis: {
        type: 'category'
    },

    yAxis: {
        allowDecimals: false,
        min: 0,
        title: {
            text: 'Count medals'
        }
    },

    tooltip: {
        format: '<b>{key}</b><br/>{series.name}: {y}<br/>' +
            'Total: {point.stackTotal}'
    },

    plotOptions: {
        column: {
            stacking: 'normal',
            dataMapping: {
                name: 'Medal'
            }
        }
    },

    series: [{
        dataMapping: {
            y: 'Norway'
        },
        stack: 'Europe'
    }, {
        dataMapping: {
            y: 'Germany'
        },
        stack: 'Europe'
    }, {
        dataMapping: {
            y: 'United States'
        },
        stack: 'North America'
    }, {
        dataMapping: {
            y: 'Canada'
        },
        stack: 'North America'
    }]
});
