Highcharts.chart('container', {
    chart: {
        type: 'bar',
        zoomType: 'y'
    },
    title: {
        text: 'Total organic area 2012 and 2018'
    },
    subtitle: {
        text: 'Source: <a href="https://ec.europa.eu/eurostat/statistics-explained/index.php?title=File:Tab1_Total_organic_area_(fully_converted_and_under_conversion),_by_country,_2012_and_2018.png">Eurostat</a>'
    },
    xAxis: {
        categories: ['AUT', 'EST', 'SWE'],
        title: {
            text: null
        },
        accessibility: {
            description: 'Countries'
        }
    },
    yAxis: {
        title: {
            text: null
        },
        accessibility: {
            description: 'Organic area',
            rangeDescription: '0 to 1000 kha.'
        },
        tickInterval: 500,
        labels: {
            overflow: 'justify',
            format: '{value} kha'
        }
    },
    plotOptions: {
        bar: {
            dataLabels: {
                enabled: true,
                format: '{y} kha'
            }
        }
    },
    tooltip: {
        valueSuffix: 'kha',
        stickOnContact: true,
        backgroundColor: 'rgba(255, 255, 255, 0.95)'
    },
    legend: {
        enabled: false
    },
    series: [
        {
            name: '2012',
            data: [533.23, 142.065, 477.684],
            color: '#0C090A',
            borderColor: '#949494'
        },
        {
            name: '2018',
            data: [639.097, 206.59, 608.754],
            color: '#C0C0C0'
        }
    ]
});
