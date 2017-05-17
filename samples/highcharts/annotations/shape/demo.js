Highcharts.chart('container', {
    chart: {
       type: 'column',
    },

    series: [{
        keys: ['y', 'id'],
        data: [[29.9, '0'], [71.5, '1'], [106.4, '2'], [129.2, '3'], [144.0, '4'], [176.0, '5']]
    }],

    defs: {
        markers: [{
            color: 'red',
            elements: [{
                type: 'path',
                attrs: {
                    d: 'M 0 0 L 10 0 L 10 10 L 0 10 Z'
               }
            }],
            refY: 5
        }, {
            elements: [{
                type: 'path',
                attrs: {
                    d: 'M 10,0 C 0,0 0,10 10,10 C 12.5,7.5 12.5,7.5 20,5 C 12.5,2.5 12.5,2.5 10,0 Z'
                }
            }],
            markerWidth: 40,
            markerHeight: 40,
            refX: 15,
            refY: 5
        }, {
            elements: [{
                type: 'circle',
                attrs: {
                    r: 5,
                    cx: 5,
                    cy: 5
                }
            }],
            id: 'circle',
            markerWidth: 10,
            markerHeight: 10,
            refX: 5,
            refY: 5
        }]
    },

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
            point: '1',
            borderWidth: 1,
            backgroundColor: 'none',
            type: 'path',
            points: ['0', '3', {
                x: 6,
                y: 195,
                xAxis: 0,
                yAxis: 0
            }],
            markerEnd: 'url(#highcharts-marker-arrow)'
        }],
        labels: [{
            point: {
                x: 6,
                y: 195,
                xAxis: 0,
                yAxis: 0
            },
            format: '{y} ?'
        }]
    }]
});
