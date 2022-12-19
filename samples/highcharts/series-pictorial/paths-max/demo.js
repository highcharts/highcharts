Highcharts.chart('container', {
    chart: {
        type: 'pictorial'
    },

    subtitle: {
        text: 'Source: ' +
                '<a href="https://en.wikipedia.org/wiki/Coffea_liberica" ' +
                'target="_blank">Wikipedia.com</a>'
    },

    title: {
        text: 'Caffeine depending on type of coffee bean'
    },

    xAxis: {
        categories: ['Liberica', 'Arabica', 'Robusta']
    },

    yAxis: {
        title: {
            text: 'mg/100g coffe beans'
        },
        labels: {
            format: '{value} mg'
        }
    },

    tooltip: {
        valueSuffix: ' mg'
    },

    plotOptions: {
        series: {
            pointPadding: 0,
            groupPadding: 0,
            borderWidth: 0,
            paths: [{
                definition: 'M14.257,275.602C-17.052,220.391,4.253,133.798,69.023,69.01c73.553-73.543,175.256-91.076,227.182-39.16 c0.061,0.068,0.112,0.145,0.195,0.214c-10.392,30.235-43.486,94.567-142.686,129.348C62.842,191.29,27.788,241.972,14.257,275.602z M310.81,48.75c-7.871,18.361-21.57,42.356-45.173,65.957c-23.725,23.735-57.445,47.046-105.208,63.8 C63.49,212.5,36.405,268.149,28.848,295.116c0.357,0.36,0.664,0.733,1.011,1.083c51.921,51.918,153.628,34.386,227.176-39.169 C322.479,191.585,343.526,103.869,310.81,48.75z',
                max: 1
            }]
        }
    },

    series: [{
        name: 'Caffeine',
        data: [1.23, 1.61, 2.26],
        color: '#4B371C'
    }]
});