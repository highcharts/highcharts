Highcharts.chart('container', {
    title: {
        text: 'Overflowing text of plotband labels'
    },
    xAxis: {
        plotBands: [{
            from: 1,
            to: 2,

            // Set 'inside' to 'false' to display the full text
            label: {
                text: 'One to two plotband',
                inside: false
            }
        }, {
            from: 3,
            to: 4,

            // 'inside' defaults to 'true' and adds ellipsis by default
            label: {
                text: 'Three to four plotband'
            }
        }, {
            from: 5,
            to: 6,

            // 'inside' defaults to 'true'..
            label: {
                text: 'Five to six plotband',

                style: {
                    // Set 'textOverflow' to 'none' to make the text wrap
                    textOverflow: 'none'
                }
            }
        }, {
            from: 7,
            to: 8,

            // The boundaries of the text can be configured with 'width'
            label: {
                text: 'Seven to eight plotband',

                style: {
                    width: 30
                }
            }
        }]
    },
    series: [{
        data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    }]
});