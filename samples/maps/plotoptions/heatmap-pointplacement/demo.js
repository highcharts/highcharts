Highcharts.chart('container', {

    chart: {
        type: 'heatmap'
    },

    colorAxis: {
        min: 0
    },

    series: [{
        pointPlacement: 'between',
        pointRange: 1,
        data: [
            [0, 0, 5],
            [0, 1, 2],
            [1, 0, 6],
            [1, 1, 1],
            [2, 0, 9],
            [2, 1, 3]
        ]
    }],

    title: {
        text: 'pointPlacement option in heatmap'
    }

});
