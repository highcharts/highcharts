const chart = Highcharts.chart('container', {
    title: {
        text: 'Elliott Wave advanced annotation'
    },
    chart: {
        zooming: {
            type: 'xy'
        }
    },

    annotations: [{
        type: 'elliottWave',
        controlPointOptions: {
            visible: true
        },
        typeOptions: {
            xAxis: 0,
            yAxis: 0,
            points: [{
                x: 1,
                y: 5,
                label: {
                    text: 'a',
                    style: {
                        color: 'blue'
                    }
                }
            }, {
                x: 4,
                y: 5
            }, {
                x: 8,
                y: 8
            }, {
                x: 12,
                y: 8
            }, {
                x: 14,
                y: 8
            }, {
                x: 16,
                y: 8
            }],
            line: {
                stroke: 'red'
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
                stroke: '#af8f6f',
                strokeWidth: 4
            }
        }
    });
};
