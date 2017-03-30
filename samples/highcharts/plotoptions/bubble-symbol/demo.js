Highcharts.chart('container', {

    chart: {
        type: 'bubble'
    },

    title: {
        text: 'Highcharts Bubbles with symbols'
    },

    series: [{
        data: [
            [97, 36, 79],
            [94, 74, 60],
            [68, 76, 58],
            [64, 87, 56],
            [68, 27, 73],
            [74, 99, 42],
            [7, 93, 87],
            [51, 69, 40],
            [38, 23, 33],
            {
                x: 57,
                y: 0,
                z: 31,
                marker: {
                    symbol: 'triangle',
                    lineColor: 'red',
                    fillColor: 'rgba(255,0,0,0.5)'
                },
                dataLabels: {
                    enabled: true,
                    format: 'Individual marker'
                }
            }
        ],
        marker: {
            symbol: 'square'
        },
        name: 'Square'
    }, {
        data: [
            [25, 10, 87],
            [2, 75, 59],
            [11, 54, 8],
            [86, 55, 93],
            [5, 3, 58],
            [90, 63, 44],
            [91, 33, 17],
            [97, 3, 56],
            [15, 67, 48],
            [54, 25, 81]
        ],
        marker: {
            symbol: 'diamond'
        },
        name: 'Diamond'
    }, {
        data: [
            [47, 47, 21],
            [20, 12, 4],
            [6, 76, 91],
            [38, 30, 40],
            [57, 98, 64],
            [61, 17, 10],
            [83, 60, 13],
            [67, 78, 75],
            [64, 12, 10],
            [30, 77, 82]
        ],
        marker: {
            symbol: 'url(https://www.highcharts.com/samples/graphics/earth.svg)'
        },
        name: 'Earth'
    }]

});
