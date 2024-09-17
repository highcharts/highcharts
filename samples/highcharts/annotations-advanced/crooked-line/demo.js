const chart = Highcharts.chart('container', {

    title: {
        text: 'Crooked Line Annotation'
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

const applyColors = document.getElementById('applyColors');

applyColors.onclick = function () {
    chart.annotations[0].update({
        typeOptions: {
            line: {
                stroke: '#ff5f00',
                strokeWidth: 4
            }
        }
    });
};
