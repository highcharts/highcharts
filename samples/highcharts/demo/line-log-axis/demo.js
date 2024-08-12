Highcharts.chart('container', {
    title: {
        text: 'Growth of Internet Users Worldwide (logarithmic scale)'
    },

    accessibility: {
        point: {
            valueDescriptionFormat:
                '{xDescription}{separator}{value} million(s)'
        }
    },

    xAxis: {
        title: {
            text: 'Year'
        },
        categories: [1995, 2000, 2005, 2010, 2015, 2020, 2023]
    },

    yAxis: {
        type: 'logarithmic',
        title: {
            text: 'Number of Internet Users (in millions)'
        }
    },

    tooltip: {
        headerFormat: '<b>{series.name}</b><br />',
        pointFormat: '{point.y} million(s)'
    },

    series: [{
        name: 'Internet Users',
        keys: ['y', 'color'],
        data: [
            [16, '#0000ff'],
            [361, '#8d0073'],
            [1018, '#ba0046'],
            [2025, '#d60028'],
            [3192, '#eb0014'],
            [4673, '#fb0004'],
            [5200, '#ff0000']
        ],
        color: {
            linearGradient: {
                x1: 0,
                x2: 0,
                y1: 1,
                y2: 0
            },
            stops: [
                [0, '#0000ff'],
                [1, '#ff0000']
            ]
        }
    }]
});
