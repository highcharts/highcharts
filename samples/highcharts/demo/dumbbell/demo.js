var data = [{
    name: 'Austria',
    low: 69,
    high: 82
}, {
    name: 'Belgium',
    low: 70,
    high: 81
}, {
    name: 'Bulgaria',
    low: 69,
    high: 75
}, {
    name: 'Croatia',
    low: 65,
    high: 78
}, {
    name: 'Cyprus',
    low: 70,
    high: 81
}, {
    name: 'Czech Republic',
    low: 70,
    high: 79
}, {
    name: 'Denmark',
    low: 72,
    high: 81
}, {
    name: 'Estonia',
    low: 68,
    high: 78
}, {
    name: 'Finland',
    low: 69,
    high: 81
}, {
    name: 'France',
    low: 70,
    high: 83
}, {
    name: 'Greece',
    low: 68,
    high: 81
}, {
    name: 'Spain',
    low: 69,
    high: 83
}, {
    name: 'Netherlands',
    low: 73,
    high: 82
}, {
    name: 'Ireland',
    low: 70,
    high: 82
}, {
    name: 'Lithuania',
    low: 70,
    high: 75
}, {
    name: 'Luxembourg',
    low: 68,
    high: 83
}, {
    name: 'Latvia',
    low: 70,
    high: 75
}, {
    name: 'Malta',
    low: 69,
    high: 82
}, {
    name: 'Germany',
    low: 69,
    high: 81
}, {
    name: 'Poland',
    low: 68,
    high: 78
}, {
    name: 'Portugal',
    low: 63,
    high: 81
}, {
    name: 'Romania',
    low: 66,
    high: 75
}, {
    name: 'Slovakia',
    low: 70,
    high: 77
}, {
    name: 'Slovenia',
    low: 69,
    high: 81
}, {
    name: 'Sweden',
    low: 73,
    high: 82
}, {
    name: 'Hungary',
    low: 68,
    high: 76
}, {
    name: 'Italy',
    low: 69,
    high: 83
}, {
    name: 'UK',
    low: 71,
    high: 81
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
        text: '1960 vs 2018'
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