// Data retrieved from https://companiesmarketcap.com/
Highcharts.chart('container', {
    chart: {
        type: 'area',
        inverted: true
    },
    title: {
        text: 'Alibaba and Meta (Facebook) revenue'
    },
    accessibility: {
        keyboardNavigation: {
            seriesNavigation: {
                mode: 'serialize'
            }
        }
    },
    tooltip: {
        valuePrefix: '$',
        valueSuffix: ' B'
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        x: -150,
        y: 100,
        floating: true,
        borderWidth: 1,
        backgroundColor: 'var(--highcharts-background-color, #ffffff)'
    },
    yAxis: {
        labels: {
            format: '${text}'
        },
        title: {
            text: 'Revenue (billions USD)'
        }
    },
    plotOptions: {
        series: {
            pointStart: 2014
        },
        area: {
            fillOpacity: 0.5
        }
    },
    series: [{
        name: 'Alibaba',
        data: [
            11.46, 14.91, 21.43, 34.05, 51.53,
            70.43, 94.64, 129.68, 127.92, 130.86,
            136.30, 142.68, 145.4
        ]
    }, {
        name: 'Meta (Facebook)',
        data: [
            12.47, 17.93, 27.64, 40.65, 55.84,
            70.70, 85.97, 117.93, 116.61, 134.90,
            164.50, 200.97, 214.96
        ]
    }]
});
