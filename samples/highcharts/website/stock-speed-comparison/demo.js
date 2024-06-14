Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    legend: {
        align: 'left',
        verticalAlign: 'top',
        floating: true,
        x: 20,
        y: 100,
        width: '50%'
    },
    title: {
        text: 'Point Pushing Comparison',
        align: 'left',
        floating: true,
        x: 30,
        y: 60,
        style: {
            textOutline: '2px white'
        }
    },
    xAxis: {
        title: {
            text: 'Number of Points Pushed'
        },
        categories: ['10', '1000', '10000', '100000', '500000']
    },
    yAxis: {
        tickInterval: 5000,
        endOnTick: false,
        startOnTick: false,
        title: {
            text: 'Time (ms)'
        },
        opposite: true


    },
    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                format: '<span style="color:{point.color}">{point.y}</span>',
                style: {
                    color: '#000000',
                    fontWeight: 'normal'
                }
            }
        }
    },
    series: [{
        name: 'Highcharts Stock',
        color: '#545ECC',
        data: [115, 129, 140, 345, 1067]
    }, {
        name: 'FusionCharts',
        color: '#45467D',
        visible: false,
        data: [1210, 1331, 3173, 35883, null]
    }, {
        name: 'ChartJS',
        color: '#FE787B',
        data: [66, 93, 311, 2350, 11498]
    }, {
        name: 'CanvasJS',
        color: '#74B566',
        data: [140, 127, 185, 1086, 4645]
    }, {
        name: 'AnyChart',
        color: '#4184CA',
        data: [115, 166, 543, 4122, 19755]
    }]
});
