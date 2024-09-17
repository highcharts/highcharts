Highcharts.chart('container', {
    series: [{
        name: 'Regions',
        type: 'treemap',
        layoutAlgorithm: 'squarified',
        allowTraversingTree: true,
        groupAreaThreshold: {
            enabled: true,
            pixelWidth: 30,
            pixelHeight: 30
        },
        data: [{
            value: 600,
            name: 'A',
            id: 'A'
        }, {
            value: 200,
            name: 'B'
        }, {
            value: 1,
            name: 'C'
        }, {
            value: 3,
            name: 'D'
        }, {
            value: 2,
            name: 'E'
        }, {
            value: 4,
            name: 'F'
        }, {
            value: 2,
            name: 'G'
        }, {
            value: 4,
            name: 'H'
        }]
    }]
});
