const chart = Highcharts.chart('container', {
    chart: {
        events: {
            load: function () {
                this.annotations.forEach(function (annotation) {
                    annotation.setControlPointsVisibility(true);
                    annotation.cpVisibility = true;
                });
            }
        }
    },

    title: {
        text: 'Measure advanced annotation'
    },
    annotations: [{
        type: 'measure',
        typeOptions: {
            point: {
                x: 0,
                y: 6
            },
            label: {
                enabled: true
            },
            background: {
                width: 300 + 'px',
                height: 150 + 'px'
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

const button = document.getElementById('button');

button.onclick = function () {
    chart.annotations[0].update({
        typeOptions: {
            background: {
                fill: 'rgba(255, 222, 77, 0.4)',
                stroke: 'rgba(255, 76, 76, 0.4)',
                strokeWidth: 4
            },
            crosshairX: {
                stroke: '#ff4c4c',
                strokeWidth: 2,
                fill: '#ff4c4c',
                dashStyle: 'ShortDash'
            },
            crosshairY: {
                stroke: '#ff4c4c',
                strokeWidth: 2,
                fill: '#ff4c4c',
                dashStyle: 'ShortDash'
            },
            label: {
                style: {
                    fontSize: '1.3em'
                }
            }
        }
    });
};
