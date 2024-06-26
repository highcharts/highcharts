Highcharts.chart('container', {
    chart: {
        type: 'line'
    },
    title: {
        text: 'Website Traffic Data'
    },
    xAxis: {
        categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    yAxis: {
        title: {
            text: 'Number of visitors'
        }
    },
    series: [{
        name: 'visitors',
        data: [523, 619, 798, 630, 754]
    }],
    accessibility: {
        point: {
            valueDescriptionFormat:
            'On {xDescription}, there were {point.y}'
        }
    }
});
