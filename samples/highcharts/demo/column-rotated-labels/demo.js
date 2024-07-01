Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'World\'s largest cities per 2024'
    },
    subtitle: {
        text: 'Source: <a href="https://worldpopulationreview.com/world-cities" target="_blank">World Population Review</a>'
    },
    xAxis: {
        type: 'category',
        labels: {
            autoRotation: [-45, -90],
            style: {
                fontSize: '13px',
                fontFamily: 'Verdana, sans-serif'
            }
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Population (millions)'
        }
    },
    legend: {
        enabled: false
    },
    tooltip: {
        pointFormat: 'Population in 2024: <b>{point.y:.1f} millions</b>'
    },
    series: [{
        name: 'Population',
        colors: [
            '#9b20d9', '#9215ac', '#861ec9', '#7a17e6', '#7010f9', '#691af3',
            '#6225ed', '#5b30e7', '#533be1', '#4c46db', '#4551d5', '#3e5ccf',
            '#3667c9', '#2f72c3', '#277dbd', '#1f88b7', '#1693b1', '#0a9eaa',
            '#03c69b',  '#00f194'
        ],
        colorByPoint: true,
        groupPadding: 0,
        data: [
            ['Tokyo', 37.11],
            ['Delhi', 33.81],
            ['Shanghai', 29.87],
            ['Dhaka', 23.94],
            ['Sao Paulo', 22.80],
            ['Cairo', 22.62],
            ['Mexico City', 22.51],
            ['Beijing', 22.19],
            ['Mumbai', 21.67],
            ['Osaka', 18.97],
            ['Chongqing', 17.77],
            ['Karachi', 17.65],
            ['Kinshasa', 17.03],
            ['Lagos', 16.54],
            ['Istanbul', 16.05],
            ['Buenos Aires', 15.62],
            ['Kolkata', 15.57],
            ['Manila', 14.94],
            ['Guangzhou', 14.59],
            ['Tianjin', 14.47]
        ],
        dataLabels: {
            enabled: true,
            rotation: -90,
            color: '#FFFFFF',
            inside: true,
            verticalAlign: 'top',
            format: '{point.y:.1f}', // one decimal
            y: 10, // 10 pixels down from the top
            style: {
                fontSize: '13px',
                fontFamily: 'Verdana, sans-serif'
            }
        }
    }]
});
