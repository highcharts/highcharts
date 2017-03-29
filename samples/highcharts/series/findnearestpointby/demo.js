Highcharts.chart('container', {
    title: {
        text: 'The top series snaps hover along X axis'
    },

    plotOptions: {
        line: {
            marker: {
                enabled: true
            }
        }
    },

    series: [{
        findNearestPointBy: 'x',
        // Hover at [3.5, 6] to demo x-dimension search
        // Compare to Series 2 behavior at [5.5, 3]
        data: [
            [0, 6],
            [1, 6],
            [1, 7],
            [2, 6],
            [3, 6],
            [3.5, 4],
            [4, 6],
            [5, 6],
            [6, 6],
            [7, 6]
        ]
    }, {
        findNearestPointBy: 'xy',
        // Hover at [1, 4] to demo xy-dimension search.
        // Useful when having multiple points on the same x-value.
        data: [
            [0, 3],
            [1, 3],
            [1, 4],
            [2, 3],
            [3, 3],
            [4, 3],
            [5, 3],
            [5.5, 5.5],
            [6, 3],
            [7, 3]
        ]
    }]
});
