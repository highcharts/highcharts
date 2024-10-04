const chart = Highcharts.chart('container', {
    chart: {
        zooming: {
            type: 'xy'
        }
    },

    yAxis: {
        tickInterval: 0.5
    },

    annotations: [{
        type: 'verticalLine',
        typeOptions: {
            point: 's',
            label: {
                /* label options */
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
        labelOptions: {
            style: {
                color: 'rgb(255, 69, 69)',
                fontSize: '1.3em'
            }
        },
        typeOptions: {
            connector: {
                fill: 'rgb(255, 69, 69)',
                stroke: 'rgba(255, 69, 69, 0.4)',
                strokeWidth: 2
            }
        }
    });
};
