Highcharts.chart('container', {

    chart: {
        type: 'heatmap'
    },

    colorAxis: {
        min: 0
    },

    series: [{
        data: [
            [0, 0, 5],
            [0, 1, 2],
            [1, 0, 6],
            [1, 1, 1],
            [2, 0, 9],
            [2, 1, 3]
        ],
        marker: {
            states: {
                hover: {
                    lineWidthPlus: 5,
                    lineColor: 'rgba(0, 0, 255, 1)'
                }
            }
        }
    }],

    title: {
        text: 'lineWidthPlus on point hover in heatmap'
    }

});
