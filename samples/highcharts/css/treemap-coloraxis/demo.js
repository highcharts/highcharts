Highcharts.chart('container', {
    colorAxis: {
        min: 1,
        max: 6,
        minColor: '#FFFFFF',
        maxColor: '#FF0000'
    },
    series: [{
        type: "treemap",
        data: [{
            name: 'A',
            value: 6,
            colorValue: 6
        }, {
            name: 'B',
            value: 6,
            colorValue: 6
        }, {
            name: 'C',
            value: 4,
            colorValue: 4
        }, {
            name: 'D',
            value: 3,
            colorValue: 3
        }, {
            name: 'E',
            value: 2,
            colorValue: 2
        }, {
            name: 'F',
            value: 2,
            colorValue: 2
        }, {
            name: 'G',
            value: 1,
            colorValue: 1
        }]
    }],
    title: {
        text: 'Highcharts Treemap'
    }
});