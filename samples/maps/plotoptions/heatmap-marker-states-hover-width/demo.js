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
                    width: 70,
                    height: 70
                }
            }
        }
    }],

    title: {
        text: 'Marker\'s fixed width and height on hover in heatmap'
    }

});
