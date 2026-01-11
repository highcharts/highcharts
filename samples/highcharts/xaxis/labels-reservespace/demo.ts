Highcharts.chart('container', {
    chart: {
        borderWidth: 1,
        type: 'column'
    },
    title: {
        text: 'Demo of <em>xAxis.labels.reserveSpace</em>'
    },
    xAxis: {
        categories: ['Product 1', 'Product 2', 'Yet another product'],
        labels: {
            align: 'left',
            reserveSpace: false,
            rotation: -90,
            style: {
                color: '#FFFFFF',
                fontSize: '12pt',
                fontWeight: 'bold',
                textOutline: '1px contrast'
            },
            y: -5
        },
        tickWidth: 0
    },
    credits: {
        enabled: false
    },
    legend: {
        enabled: false
    },
    series: [{
        data: [39.9, 71.5, 106.4],
        dataLabels: {
            enabled: true
        }
    }]
} satisfies Highcharts.Options);
