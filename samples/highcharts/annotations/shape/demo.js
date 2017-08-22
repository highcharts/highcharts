Highcharts.chart('container', {
    chart: {
        type: 'column'
    },

    title: {
        text: 'Basic shape annotations'
    },

    series: [{
        keys: ['y', 'id'],
        data: [[29.9, '0'], [71.5, '1'], [106.4, '2'], [129.2, '3'], [144.0, '4'], [176.0, '5']]
    }],

    yAxis: {
        max: 300
    },

    xAxis: {
        min: 0,
        max: 6
    },

    annotations: [{
        shapes: [{
            point: '0',
            type: 'circle',
            r: 10
        }, {
            point: '3',
            type: 'rect',
            width: 20,
            height: 20,
            x: -10,
            y: -25
        }, {
            fill: 'none',
            stroke: 'red',
            strokeWidth: 3,
            type: 'path',
            points: ['0', '3', {
                x: 6,
                y: 195,
                xAxis: 0,
                yAxis: 0
            }],
            markerEnd: 'arrow'
        }],
        labels: [{
            point: {
                x: 6,
                y: 195,
                xAxis: 0,
                yAxis: 0
            }
        }]
    }]
});
