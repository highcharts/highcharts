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
            [0, 2, 3],
            [1, 0, 6],
            [1, 1, 1],
            [1, 2, 3],
            [2, 0, 9],
            [2, 1, 3],
            [2, 2, 5]
        ],
        marker: {
            states: {
                hover: {
                    widthPlus: 20,
                    heightPlus: 20
                }
            }
        }
    }],

    title: {
        text: 'Marker\'s widthPlus and heightPlus option on hover in heatmap'
    }

});
