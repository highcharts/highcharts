Highcharts.chart('container', {
    chart: {
        type: 'bar',
        zoomType: 'y'
    },
    title: {
        text: 'Top 10 EU countries in organic farming area (2018)'
    },
    subtitle: {
        text:
        'Source: <a href="https://ec.europa.eu/eurostat/statistics-explained/index.php/Organic_farming_statistics">Eurostat</a>'
    },
    xAxis: {
        categories: [
            'Austria',
            'Estonia',
            'Sweden',
            'Italy',
            'Czechia',
            'Latvia',
            'Finland',
            'Slovenia',
            'Slovakia',
            'Denmark'
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
        max: 30,
        tickInterval: 10,
        title: {
            text: null
        },
        accessibility: {
            description: 'Organic farming area',
            rangeDescription: 'Range: 0 to 30%.'
        },
        labels: {
            overflow: 'justify',
            format: '{value}%'
        }
    },
    plotOptions: {
        bar: {
            dataLabels: {
                enabled: true,
                format: '{y}%'
            }
        }
    },
    tooltip: {
        valueSuffix: '%',
        stickOnContact: true,
        backgroundColor: 'rgba(255, 255, 255, 0.93)'
    },
    legend: {
        enabled: false
    },
    series: [
        {
            name: 'Organic farming area',
            color: '#a5d6a7',
            borderColor: '#60A465',
            data: [24.1, 20.6, 20.3, 15.2, 14.8, 14.5, 13.1, 10.0, 9.9, 9.8]
        }
    ]
});
