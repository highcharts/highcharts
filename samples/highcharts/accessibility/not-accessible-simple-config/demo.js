Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Corn vs wheat estimated production for 2020',
        align: 'left'
    },
    subtitle: {
        text:
            'Source: <a target="_blank" ' +
            'href="https://www.indexmundi.com/agriculture/?commodity=corn">indexmundi</a>',
        align: 'left'
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: [
        {
            data: [406292, 260000, 107000, 68300, 27500, 14500],
            color: '#0899FD'
        },
        {
            data: [51086, 136000, 5500, 141000, 107180, 77000],
            color: '#8F8CD9'
        }
    ]
});
