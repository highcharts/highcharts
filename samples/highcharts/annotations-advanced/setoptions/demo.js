Highcharts.setOptions({
    annotations: {
        // Common to all annotations
        shapeOptions: {
            stroke: 'lightgreen'
        },

        // Type override
        types: {
            crookedLine: {
                controlPointOptions: {
                    style: {
                        stroke: 'lightgreen'
                    }
                }
            }
        }
    }
});


Highcharts.chart('container', {

    title: {
        text: 'Themed Crooked Line Annotation'
    },

    annotations: [{
        id: '1',
        type: 'crookedLine',
        controlPointOptions: {
            visible: true
        },
        typeOptions: {
            points: [{
                x: 1,
                y: 5,
                controlPoint: {
                    symbol: 'square'
                }
            }, {
                x: 4,
                y: 5
            }, {
                x: 8,
                y: 8,
                controlPoint: {
                    style: {
                        // Individual instance setting
                        fill: 'blue'
                    }
                }
            }, {
                x: 12,
                y: 8
            }],
            line: {
                // markerEnd: 'arrow'
            }
        }
    }],

    series: [{
        data: [
            1, 2, 3, { y: 4, id: 's' }, 5, { y: 6, id: 'm' },
            2, 3, 4, 5, 6, 7, 8, 3, 2, 4, 4, 4, 4, 3
        ]
    }]
});
