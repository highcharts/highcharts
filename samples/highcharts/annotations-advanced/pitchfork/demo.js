const chart = Highcharts.chart('container', {

    title: {
        text: 'Pitchfork advanced annotation'
    },
    annotations: [{
        type: 'pitchfork',
        controlPointOptions: {
            visible: true
        },
        typeOptions: {
            points: [{
                x: 4,
                y: 4,
                controlPoint: {
                    /* control point options */
                    style: {
                        fill: 'red'
                    }
                }
            }, {
                x: 10,
                y: 6
            }, {
                x: 10,
                y: 2
            }],
            innerBackground: {
                /* background shape options */
                fill: 'rgba(100, 170, 255, 0.8)'
            },
            outerBackground: { /* background shape options */ }
            // yAxis: 0,
            // xAxis: 0
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
            innerBackground: {
                fill: '#AD49E1',
                stroke: '#7A1CAC',
                strokeWidth: 4
            },
            outerBackground: {
                fill: '#EBD3F8',
                stroke: '#7A1CAC',
                strokeWidth: 4
            }
        }
    });
};
