Highcharts.chart('container', {

    title: {
        text: 'Animation defer options'
    },

    plotOptions: {
        column: {
            stacking: 'normal',
            animation: {
                defer: 2000
            }
        },
        series: {
            // series labels will be shown after defer set in series.animation
            animation: {
                defer: 4000
            },
            dataLabels: {
                enabled: true,
                animation: {
                    defer: 6000
                }
            }
        }
    },

    yAxis: {
        stackLabels: {
            enabled: true,
            animation: {
                defer: 4000
            }
        }
    },

    series: [{
        type: 'column',
        data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
    }, {
        type: 'column',
        data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
    }, {
        data: [11744, 17722, 16005, 59771, 60185, 74377, 82147, 99387]
    }, {
        data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111]
    }]
});