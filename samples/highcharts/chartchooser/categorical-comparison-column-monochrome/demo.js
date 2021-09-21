Highcharts.setOptions({
    colors: ['#C0C0C0', '#0C090A']
});
Highcharts.chart('container', {
    chart: {
        type: 'column',
        zoomType: 'y'
    },
    title: {
        text: 'Corn vs wheat estimated production for 2020 (1000 MT)'
    },
    subtitle: {
        text:
      'Source: <a href="https://www.indexmundi.com/agriculture/?commodity=corn">indexmundi</a>'
    },
    xAxis: {
        categories: ['USA', 'China', 'Brazil', 'EU', 'India', 'Russia'],
        title: {
            text: null
        },
        accessibility: {
            description: 'Countries'
        }
    },
    yAxis: {
        title: {
            text: 'Production in 1000 million ton'
        },
        labels: {
            overflow: 'justify'
        }
    },
    plotOptions: {
        column: {
            dataLabels: {
                enabled: true
            }
        }
    },
    tooltip: {
        valueSuffix: ' (1000 MT)',
        stickOnContact: true,
        backgroundColor: 'rgba(255, 255, 255, 0.93)'
    },
    legend: {
        enabled: true
    },
    series: [
        {
            name: 'Corn',
            data: [406292, 260000, 107000, 68300, 27500, 14500],
            borderColor: '#949494'
        },
        {
            name: 'Wheat',
            data: [51086, 136000, 5500, 141000, 107180, 77000]
        }
    ]
});
