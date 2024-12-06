const chart = Highcharts.chart('container', {
    chart: {
        zooming: {
            type: 'xy'
        }
    },

    title: {
        text: 'Fibonacci Annotation'
    },
    annotations: [{
        type: 'fibonacci',
        controlPointOptions: {
            visible: true
        },
        typeOptions: {
            points: [{
                x: 2,
                y: 4
            }, {
                x: 10,
                y: 6.5
            }],
            xAxis: 0,
            yAxis: 0
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
                color: '#071952'
            }
        },
        typeOptions: {
            backgroundColors: [
                'rgb(7, 25, 82,   0.4)',
                'rgb(8, 131, 149, 0.4)',
                'rgb(7, 25, 82,   0.4)',
                'rgb(8, 131, 149, 0.4)',
                'rgb(7, 25, 82,   0.4)',
                'rgb(8, 131, 149, 0.4)'
            ],
            lineColor: 'rgba(0, 0, 0, 0.8)'
        }
    });
};
