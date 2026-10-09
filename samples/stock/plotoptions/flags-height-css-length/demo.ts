Highcharts.stockChart('container', {
    title: {
        text: 'Demo of <em>plotOptions.flags.height</em>'
    },
    navigator: {
        enabled: false
    },
    plotOptions: {
        flags: {
            height: '2rem'
        }
    },
    rangeSelector: {
        enabled: false
    },
    scrollbar: {
        enabled: false
    },
    series: [
        {
            data: [3, 5, 4, 6, 8, 7, 9, 8, 10, 9],
            name: 'Value',
            pointInterval: 86400000,
            pointStart: 1735689600000
        },
        {
            data: [
                {
                    title: 'A',
                    x: 1735862400000
                },
                {
                    title: 'B',
                    x: 1736121600000
                },
                {
                    title: 'C',
                    x: 1736380800000
                }
            ],
            name: 'Events',
            shape: 'squarepin',
            type: 'flags'
        }
    ]
});
