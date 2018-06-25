Highcharts.chart('container', {
    title: {
        text: 'Highcharts Annotations'
    },

    subtitle: {
        text: 'Custom markers'
    },

    chart: {
        type: 'scatter'
    },

    series: [{
        keys: ['y', 'id'],
        data: [
            [29.9, '0'], [71.5, '1'], [106.4, '2'], [129.2, '3'],
            [144.0, '4'], [176.0, '5']
        ]
    }],

    defs: {
        marker0: {
            tagName: 'marker',
            render: false, // if false it does not render the element to the dom
            id: 'custom-shape',
            children: [{
                tagName: 'path',
                d: 'M 10,0 C 0,0 0,10 10,10 C 12.5,7.5 12.5,7.5 20,5 C 12.5,2.5 12.5,2.5 10,0 Z'
            }],
            markerWidth: 40,
            markerHeight: 40,
            refX: 20,
            refY: 5
        },
        marker1: {
            children: [{
                tagName: 'circle',
                r: 9,
                cx: 11,
                cy: 11,
                fill: 'rgba(224, 101, 0, 0.6'
            }, {
                tagName: 'circle',
                r: 10,
                cx: 11,
                cy: 11,
                fill: 'none',
                'stroke-width': 2,
                stroke: 'black'
            }],
            tagName: 'marker',
            id: 'circle',
            markerWidth: 25,
            markerHeight: 25,
            refX: 10,
            refY: 10
        }
    },

    yAxis: {
        max: 300
    },

    annotations: [{
        shapes: [{
            points: [{ x: 100, y: 100 }, { x: 200, y: 100 }, '1'],
            type: 'path',
            fill: 'none',
            stroke: 'red',
            markerStart: 'circle',
            markerEnd: 'custom-shape'
        }]
    }]
});
