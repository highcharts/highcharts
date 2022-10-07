Highcharts.chart('container', {
    chart: {
        alignThresholds: true,
        type: 'column'
    },
    title: {
        text: 'The <em>alignThreshold</em> option is true'
    },
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May']
    },
    yAxis: [{
        title: {
            text: 'Primary Axis'
        },
        plotLines: [{
            value: 0,
            width: 2,
            zIndex: 1
        }],
        gridLineWidth: 0
    }, {
        title: {
            text: 'Secondary Axis'
        },
        opposite: true
    }],
    series: [{
        data: [-5, -11, -1, 2, 0],
        yAxis: 0
    }, {
        data: [1000, 1001, 1002, 1004, 1003],
        yAxis: 1
    }]
});