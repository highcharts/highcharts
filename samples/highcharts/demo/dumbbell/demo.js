const data = [{
    name: 'Austria',
    low: 70.1,
    high: 81.3
}, {
    name: 'Belgium',
    low: 71.0,
    high: 81.9
},  {
    name: 'Czechia',
    low: 69.6,
    high: 77.4
}, {
    name: 'Estonia',
    low: 70.4,
    high: 76.9
}, {
    name: 'Greece',
    low: 73.8,
    high: 80.3
}, {
    name: 'Hungary',
    low: 69.2,
    high: 74.5
}, {
    name: 'Iceland',
    low: 73.8,
    high: 83.2
}, {
    name: 'Lithuania',
    low: 71.1,
    high: 74.5
}, {
    name: 'Norway',
    low: 74.3,
    high: 83.2
},  {
    name: 'Portugal',
    low: 66.7,
    high: 81.2
}, {
    name: 'Romania',
    low: 68.2,
    high: 72.9
},  {
    name: 'Slovakia',
    low: 69.8,
    high: 74.8
}, {
    name: 'Sweden',
    low: 74.7,
    high: 83.2
}, {
    name: 'Switzerland',
    low: 73.2,
    high: 84.0
}];

Highcharts.chart('container', {

    chart: {
        type: 'dumbbell',
        inverted: true
    },

    legend: {
        enabled: false
    },

    subtitle: {
        text: '1970 vs 2021 Source: ' +
            '<a href="https://ec.europa.eu/eurostat/en/web/main/data/database"' +
            'target="_blank">Eurostat</a>'
    },

    title: {
        text: 'Change in Life Expectancy'
    },

    tooltip: {
        shared: true
    },

    xAxis: {
        type: 'category'
    },

    yAxis: {
        title: {
            text: 'Life Expectancy (years)'
        }
    },

    series: [{
        name: 'Life expectancy change',
        data: data
    }]

});