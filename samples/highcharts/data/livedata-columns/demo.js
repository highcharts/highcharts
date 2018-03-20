Highcharts.chart('container', {
    chart: {
        type: 'bar',
        height: 600
    },
    title: {
        text: 'Server Monitoring Demo'
    },
    legend: {
        enabled: false
    },
    subtitle: {
        text: 'Instance Load'
    },
    data: {
        csvURL: 'https://demo-live-data.highcharts.com/vs-load.csv',
        enablePolling: true,
        dataRefreshRate: 1
    },
    plotOptions: {
        bar: {
            colorByPoint: true
        },
        series: {
            zones: [{
                color: '#4CAF50',
                value: 0
            }, {
                color: '#8BC34A',
                value: 10
            }, {
                color: '#CDDC39',
                value: 20
            }, {
                color: '#CDDC39',
                value: 30
            }, {
                color: '#FFEB3B',
                value: 40
            }, {
                color: '#FFEB3B',
                value: 50
            }, {
                color: '#FFC107',
                value: 60
            }, {
                color: '#FF9800',
                value: 70
            }, {
                color: '#FF5722',
                value: 80
            }, {
                color: '#F44336',
                value: 90
            }, {
                color: '#F44336',
                value: Number.MAX_VALUE
            }],
            dataLabels: {
                enabled: true,
                format: '{point.y:.0f}%'
            }
        }
    },
    tooltip: {
        valueDecimals: 1,
        valueSuffix: '%'
    },
    xAxis: {
        type: 'category',
        labels: {
            style: {
                fontSize: '10px'
            }
        }
    },
    yAxis: {
        max: 100,
        title: false,
        plotBands: [{
            from: 0,
            to: 30,
            color: '#E8F5E9'
        }, {
            from: 30,
            to: 70,
            color: '#FFFDE7'
        }, {
            from: 70,
            to: 100,
            color: "#FFEBEE"
        }]
    }
});