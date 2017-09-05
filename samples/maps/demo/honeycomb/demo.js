Highcharts.chart('container', {
    chart: {
        type: 'honeycomb'
    },

    title: {
        text: 'Honeycomb demo'
    },

    xAxis: {
        visible: false
    },

    yAxis: {
        visible: false
    },

    colorAxis: {
        min: 1,
        max: 9,
        minColor: '#FFFFFF',
        maxColor: Highcharts.getOptions().colors[3]
    },

    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                color: '#000000',
                format: '{point.name}'
            },
            borderWidth: 1,
            borderColor: '#a08383',
            keys: ['x', 'y', 'name', 'value']
        }
    },

    series: [{
        data: [
            [0, 1, 'A', 1],
            [1, 3, 'B', 2],
            [2, 2, 'C', 3],
            [3, 0, 'D', 4],
            [4, 2, 'E', 5],
            [0, 2, 'F', 6],
            [1, 4, 'G', 7],
            [2, 4, 'H', 8],
            [3, 2, 'I', 9]
        ]
    }, {
        data: [
            [0, 3, 'J'],
            [1, 0, 'K'],
            [2, 0, 'L'],
            [3, 1, 'M'],
            [4, 1, 'N'],
            [0, 4, 'O'],
            [1, 2, 'P'],
            [2, 3, 'Q'],
            [4, 0, 'R']
        ]
    }, {
        color: '#b07373',
        data: [
            [0, 5, 'Zone 1'],
            [1, 6, 'Zone 2'],
            [2, 5, 'Zone 3'],
            [3, 6, 'Zone 4'],
            [4, 5, 'Zone 5'],
            [5, 0, 'Zone 6'],
            [6, 2, 'Zone 7'],
            [5, 4, 'Zone 8'],
            [6, 5, 'Zone 9'],
            [3, 4, 'Zone 10'],
            [4, 4, 'Zone 11']
        ]
    }, {
        data: [
            [0, 6, 'Project 1', 1],
            [1, 5, 'Project 2', 2],
            [2, 6, 'Project 3', 3],
            [3, 5, 'Project 4', 4],
            [4, 6, 'Project 5', 5],
            [5, 3, 'Project 6', 6],
            [6, 1, 'Project 7', 7],
            [6, 3, 'Project 8', 8]
        ]
    }]
});
