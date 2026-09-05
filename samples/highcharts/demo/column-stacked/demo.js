// Data retrieved from:
// - https://en.as.com/soccer/which-teams-have-won-the-premier-league-the-most-times-n/
// - https://www.statista.com/statistics/383679/fa-cup-wins-by-team/
// - https://www.uefa.com/uefachampionsleague/history/winners/
Highcharts.chart('container', {
    dataTable: {
        columns: {
            Team: ['Arsenal', 'Chelsea', 'Liverpool', 'Manchester United'],
            BPL: [3, 5, 1, 13],
            'FA Cup': [14, 8, 8, 12],
            CL: [0, 2, 6, 3]
        }
    },
    chart: {
        type: 'column'
    },
    title: {
        text: 'Major trophies for some English teams',
        align: 'left'
    },
    xAxis: {
        type: 'category'
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Count trophies'
        },
        stackLabels: {
            enabled: true
        }
    },
    legend: {
        align: 'left',
        x: 70,
        verticalAlign: 'top',
        y: 70,
        floating: true,
        backgroundColor: 'var(--highcharts-background-color, #ffffff)',
        borderColor: 'var(--highcharts-neutral-color-20, #cccccc)',
        borderWidth: 1,
        shadow: false
    },
    tooltip: {
        headerFormat: '<b>{name}</b><br/>',
        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
    },
    plotOptions: {
        column: {
            dataMapping: {
                name: 'Team'
            },
            stacking: 'normal',
            dataLabels: {
                enabled: true
            }
        }
    },
    series: [{
        dataMapping: {
            y: 'BPL'
        }
    }, {
        dataMapping: {
            y: 'FA Cup'
        }
    }, {
        dataMapping: {
            y: 'CL'
        }
    }]
});
