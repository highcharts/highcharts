Highcharts.chart('container', {
    title: {
        text: ' Income Distribution and Intentional Homicide Rates, 1965-1994'
    },

    subtitle: {
        text:
        'Source: <a href="https://web.worldbank.org/" target="_blank">Worldbank</a>'
    },

    yAxis: {
        title: {
            text: 'Intentional Homicide Rates'
        }
    },

    xAxis: {
        title: { text: 'Gini Coefficient' },
        category: [20, 25, 30, 35, 40, 45, 50, 55, 60],
        accessibility: {
            rangeDescription: 'Range: 20 to 60'
        }
    },

    legend: {
        enabled: false
    },

    plotOptions: {
        series: {
            marker: {
                enabled: false
            },
            pointStart: 20,
            pointInterval: 5
        }
    },

    series: [
        {
            name: 'Income Distribution and Intentional Homicide Rates,',
            data: [16.56, 18.9, 21.24, 23.58, 25.92, 28.26, 30.6, 32.94, 35.28]
        }
    ]
});
