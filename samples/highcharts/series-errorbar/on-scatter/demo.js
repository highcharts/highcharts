Highcharts.chart('container', {
    title: {
        text: 'Experimental vs Predicted Values'
    },
    xAxis: {
        title: {
            text: 'Experimental Measurements'
        },
        gridLineWidth: 1
    },
    yAxis: {
        title: {
            text: 'Predicted Values'
        },
        gridLineWidth: 1
    },
    legend: {
        enabled: false
    },
    series: [{
        name: 'Markers',
        type: 'scatter',
        data: [
            [16, 75],
            [83, 102],
            [83, 31],
            [132, 150],
            [272, 231],
            [328, 290]
        ]
    }, {
        name: 'Errors',
        type: 'errorbar',
        data: [
            [16, 35, 120],
            [83, 72, 132],
            [83, -10, 71],
            [132, 130, 170],
            [272, 195, 275],
            [328, 270, 310]
        ],
        // Set the width of the error bar:
        pointWidth: 15,
        // Prevents error bar from adding extra padding on the xAxis:
        pointRange: 0
    }]
});