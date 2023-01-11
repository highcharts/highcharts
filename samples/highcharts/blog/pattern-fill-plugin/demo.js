Highcharts.chart('container', {

    title: {
        text: 'Pattern fill plugin demo'
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yAxis: {
        plotBands: [{
            from: 100,
            to: 200,
            color: {
                patternIndex: 1

            }

        }]
    },
    series: [{
        type: 'area',
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5,
            216.4, 194.1, 95.6, 54.4],
        color: {
            patternIndex: 0
        }
    }, {
        type: 'column',
        data: [148.5, 216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4, 129.2,
            144.0, 176.0, 135.6],
        color: {
            patternIndex: 2
        }

    }]

});
