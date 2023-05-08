Highcharts.chart('container', {
    chart: {
        type: 'column',
        zoomType: 'y'
    },
    title: {
        text: 'Top 10 countries in wheat exportation (2019)'
    },
    subtitle: {
        text: 'Source: <a href="http://www.worldstopexports.com/wheat-exports-country/">worldstopexports</a>'
    },
    xAxis: {
        categories: [
            'Russia',
            'US',
            'Canada',
            'France',
            'Australia',
            'Argentina',
            'Ukraine',
            'Romania',
            'Germany',
            'Kazakhstan'
        ],
        title: {
            text: null
        },
        accessibility: {
            description: 'Countries'
        }
    },
    yAxis: {
        min: 0,
        tickInterval: 2,
        title: {
            text: 'Exportation in billion US$'
        },
        labels: {
            overflow: 'justify',
            format: '{value}'
        }
    },
    plotOptions: {
        column: {
            dataLabels: {
                enabled: true,
                format: '{y}BUS$'
            }
        }
    },
    tooltip: {
        valueSuffix: ' billion US$',
        stickOnContact: true,
        backgroundColor: 'rgba(255, 255, 255, 0.93)'
    },
    legend: {
        enabled: false
    },
    series: [
        {
            name: 'Wheat exportation in 2019',
            data: [6.4, 6.3, 5.4, 4.4, 2.51, 2.45, 1.6, 1.29, 1.25, 1],
            borderColor: '#5997DE'
        }
    ]
});
