Highcharts.chart('container', {
    chart: {
        type: 'column',
        options3d: {
            enabled: true,
            alpha: 10,
            beta: 25,
            depth: 70
        }
    },
    title: {
        text: 'External trade in goods by country, Norway 2021',
        align: 'left'
    },
    subtitle: {
        text: 'Source: ' +
            '<a href="https://www.ssb.no/en/statbank/table/08804/"' +
            'target="_blank">SSB</a>',
        align: 'left'
    },
    plotOptions: {
        column: {
            depth: 25
        }
    },
    xAxis: {
        categories: ['Belgium', 'China', 'Denmark', 'Fiji', 'Germany', 'Netherlands', 'Russia',
            'Sweden', 'Turkey', 'United States', 'Unspecified', 'Vietnam'],
        labels: {
            skew3d: true,
            style: {
                fontSize: '16px'
            }
        }
    },
    yAxis: {
        title: {
            text: 'NOK (million)',
            margin: 20
        }
    },
    tooltip: {
        valueSuffix: ' MNOK'
    },
    series: [{
        name: 'Total imports',
        data: [16076, 112688, 39452, 0, 94352,
            30495, 21813, 95908, 11596, 53771, null, 8270]
    }]
});
